package com.kartezy.finance.service;

import com.kartezy.finance.constants.*;
import com.kartezy.finance.entity.*;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaxService {

    private final TaxRecordRepository taxRecordRepository;
    private final GSTRecordRepository gstRecordRepository;
    private final AccountingService accountingService;
    private final AccountRepository accountRepository;
    private final AuditService auditService;

    @Transactional
    public GSTRecord createGSTEntry(GSTRecord record) {
        record.setStatus("PENDING");
        GSTRecord saved = gstRecordRepository.save(record);

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_GST,
            saved.getId(), null, "System", null, "GST entry created");

        return saved;
    }

    @Transactional
    public TaxRecord createTaxEntry(TaxRecord record) {
        record.setStatus("PENDING");
        TaxRecord saved = taxRecordRepository.save(record);

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_TAX,
            saved.getId(), null, "System", null, "Tax entry created: " + saved.getTaxType());

        return saved;
    }

    @Transactional
    public GSTRecord fileGSTReturn(String returnPeriod) {
        BigDecimal totalInput = gstRecordRepository.getTotalInputCredit(returnPeriod);
        BigDecimal totalOutput = gstRecordRepository.getTotalOutputLiability(returnPeriod);
        BigDecimal netGSTPayable = totalOutput.subtract(totalInput);

        // Mark all records in period as filed
        List<GSTRecord> records = gstRecordRepository.findByReturnPeriod(returnPeriod);
        for (GSTRecord record : records) {
            record.setReturnFiled(true);
            record.setStatus("FILED");
        }
        gstRecordRepository.saveAll(records);

        // Create journal entry for GST payment
        if (netGSTPayable.compareTo(BigDecimal.ZERO) > 0) {
            createGSTPaymentJournalEntry(netGSTPayable, returnPeriod);
        }

        log.info("GST return filed for period: {}. Net payable: {}", returnPeriod, netGSTPayable);

        auditService.log(AuditAction.SUBMIT, FinanceConstants.ENTITY_GST,
            null, returnPeriod, "System", null,
            "GST return filed. Input: " + totalInput + ", Output: " + totalOutput + ", Net: " + netGSTPayable);

        // Return first record as representative
        return records.isEmpty() ? null : records.get(0);
    }

    @Transactional
    public TaxRecord deductTDS(TaxRecord record) {
        record.setIsDeductedAtSource(true);
        record.setTaxType("TDS");
        record.setStatus("PENDING_DEPOSIT");

        TaxRecord saved = taxRecordRepository.save(record);

        // Create journal entry for TDS deduction
        createTDSJournalEntry(saved);

        return saved;
    }

    private void createGSTPaymentJournalEntry(BigDecimal amount, String returnPeriod) {
        Account gstPayable = accountRepository.findByAccountCode(FinanceConstants.GST_PAYABLE_CODE).orElse(null);
        Account cashAcct = accountRepository.findByAccountCode(FinanceConstants.CASH_ACCOUNT_CODE).orElse(null);

        if (gstPayable == null || cashAcct == null) return;

        JournalEntry entry = JournalEntry.builder()
            .entryNumber("JE-GST-" + returnPeriod)
            .entryDate(LocalDate.now())
            .entryType(JournalEntryType.STANDARD)
            .description("GST payment for period: " + returnPeriod)
            .referenceNumber("GST-" + returnPeriod)
            .referenceType("GST_PAYMENT")
            .build();

        accountingService.createJournalEntry(entry, Arrays.asList(
            JournalEntryLine.builder().account(gstPayable)
                .description("GST liability settled").debitAmount(amount).creditAmount(BigDecimal.ZERO).build(),
            JournalEntryLine.builder().account(cashAcct)
                .description("GST payment").debitAmount(BigDecimal.ZERO).creditAmount(amount).build()
        ));
    }

    private void createTDSJournalEntry(TaxRecord record) {
        Account tdsPayable = accountRepository.findByAccountCode("202002").orElse(null);
        Account expenseAcct = accountRepository.findByAccountCode(FinanceConstants.COGS_CODE).orElse(null);

        if (tdsPayable == null || expenseAcct == null) return;

        JournalEntry entry = JournalEntry.builder()
            .entryNumber("JE-TDS-" + record.getId())
            .entryDate(LocalDate.now())
            .entryType(JournalEntryType.STANDARD)
            .description("TDS deduction: " + record.getTdsSection())
            .referenceNumber(String.valueOf(record.getId()))
            .referenceType("TDS")
            .build();

        accountingService.createJournalEntry(entry, Arrays.asList(
            JournalEntryLine.builder().account(expenseAcct)
                .description("Expense net of TDS").debitAmount(record.getTaxableAmount()).creditAmount(BigDecimal.ZERO).build(),
            JournalEntryLine.builder().account(tdsPayable)
                .description("TDS payable").debitAmount(BigDecimal.ZERO).creditAmount(record.getTaxAmount()).build()
        ));
    }

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getGSTSummary(String returnPeriod) {
        Map<String, BigDecimal> summary = new LinkedHashMap<>();
        summary.put("totalInputCredit", gstRecordRepository.getTotalInputCredit(returnPeriod));
        summary.put("totalOutputLiability", gstRecordRepository.getTotalOutputLiability(returnPeriod));
        summary.put("netPayable", summary.get("totalOutputLiability").subtract(summary.get("totalInputCredit")));
        return summary;
    }
}
