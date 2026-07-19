package com.kartezy.finance.service;

import com.kartezy.finance.constants.*;
import com.kartezy.finance.entity.*;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class BankService {

    private final BankAccountRepository bankAccountRepository;
    private final BankTransactionRepository bankTransactionRepository;
    private final ReconciliationRecordRepository reconciliationRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final AuditService auditService;

    @Transactional
    public BankAccount registerBankAccount(BankAccount account) {
        account.setIsActive(true);
        BankAccount saved = bankAccountRepository.save(account);

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_BANK,
            saved.getId(), saved.getAccountHolderName(), "System",
            null, "Bank account registered: " + saved.getBankName());

        return saved;
    }

    @Transactional
    public BankTransaction importBankTransaction(BankTransaction transaction) {
        transaction.setStatus("IMPORTED");
        return bankTransactionRepository.save(transaction);
    }

    @Transactional
    public List<BankTransaction> bulkImportTransactions(List<BankTransaction> transactions) {
        transactions.forEach(t -> t.setStatus("IMPORTED"));
        return bankTransactionRepository.saveAll(transactions);
    }

    @Transactional
    public ReconciliationRecord reconcileTransaction(Long bankTransactionId, Long systemTransactionId,
                                                      String systemType, String matchedBy) {
        BankTransaction bankTxn = bankTransactionRepository.findById(bankTransactionId)
            .orElseThrow(() -> new FinanceException("Bank transaction not found"));

        LedgerEntry systemTxn = ledgerEntryRepository.findById(systemTransactionId)
            .orElseThrow(() -> new FinanceException("System transaction not found"));

        BigDecimal difference = (bankTxn.getCreditAmount() != null ? bankTxn.getCreditAmount() : BigDecimal.ZERO)
            .subtract(systemTxn.getCreditAmount() != null ? systemTxn.getCreditAmount() : BigDecimal.ZERO)
            .add(bankTxn.getDebitAmount() != null ? bankTxn.getDebitAmount() : BigDecimal.ZERO)
            .subtract(systemTxn.getDebitAmount() != null ? systemTxn.getDebitAmount() : BigDecimal.ZERO);

        ReconciliationStatus status = difference.compareTo(BigDecimal.ZERO) == 0
            ? ReconciliationStatus.MATCHED
            : ReconciliationStatus.PARTIALLY_MATCHED;

        ReconciliationRecord record = ReconciliationRecord.builder()
            .bankTransactionId(bankTransactionId)
            .systemTransactionId(systemTransactionId)
            .systemTransactionType(systemType)
            .bankAmount(bankTxn.getCreditAmount() != null ? bankTxn.getCreditAmount() : bankTxn.getDebitAmount())
            .systemAmount(systemTxn.getCreditAmount() != null ? systemTxn.getCreditAmount() : systemTxn.getDebitAmount())
            .differenceAmount(difference.abs())
            .matchType(status == ReconciliationStatus.MATCHED ? "EXACT" : "PARTIAL")
            .status(status)
            .matchedBy(matchedBy)
            .matchedAt(java.time.LocalDateTime.now())
            .isAutoMatched(false)
            .build();

        ReconciliationRecord saved = reconciliationRepository.save(record);

        // Update bank transaction as reconciled
        bankTxn.setIsReconciled(true);
        bankTxn.setReconciliationId(saved.getId());
        bankTxn.setReconciledAt(java.time.LocalDateTime.now());
        bankTransactionRepository.save(bankTxn);

        // Update ledger entry
        systemTxn.setReconciled(true);
        systemTxn.setReconciliationDate(LocalDate.now());
        ledgerEntryRepository.save(systemTxn);

        auditService.log(AuditAction.RECONCILE, FinanceConstants.ENTITY_RECONCILIATION,
            saved.getId(), null, matchedBy, null, "Transaction reconciled. Diff: " + difference);

        return saved;
    }

    @Transactional
    public List<ReconciliationRecord> autoReconcile(Long bankAccountId) {
        List<BankTransaction> unreconciled = bankTransactionRepository
            .findUnreconciledByBankAccountId(bankAccountId);

        List<ReconciliationRecord> results = new ArrayList<>();

        for (BankTransaction bankTxn : unreconciled) {
            // Try to find matching ledger entry by reference
            if (bankTxn.getReferenceNumber() != null) {
                List<LedgerEntry> matches = ledgerEntryRepository
                    .findByReferenceNumber(bankTxn.getReferenceNumber());

                for (LedgerEntry entry : matches) {
                    if (!entry.isReconciled()) {
                        BigDecimal diff = calculateDifference(bankTxn, entry);
                        if (diff.compareTo(BigDecimal.valueOf(0.01)) <= 0) {
                            ReconciliationRecord record = ReconciliationRecord.builder()
                                .bankTransactionId(bankTxn.getId())
                                .systemTransactionId(entry.getId())
                                .systemTransactionType(entry.getReferenceType())
                                .bankAmount(getTransactionAmount(bankTxn))
                                .systemAmount(getEntryAmount(entry))
                                .differenceAmount(diff)
                                .matchType("AUTO_EXACT")
                                .status(ReconciliationStatus.MATCHED)
                                .matchedBy("SYSTEM")
                                .matchedAt(java.time.LocalDateTime.now())
                                .isAutoMatched(true)
                                .build();

                            ReconciliationRecord saved = reconciliationRepository.save(record);

                            bankTxn.setIsReconciled(true);
                            bankTxn.setReconciliationId(saved.getId());
                            bankTransactionRepository.save(bankTxn);

                            entry.setReconciled(true);
                            ledgerEntryRepository.save(entry);

                            results.add(saved);
                            break;
                        }
                    }
                }
            }
        }

        log.info("Auto-reconciliation completed for bank account {}. Matched: {}", bankAccountId, results.size());
        return results;
    }

    @Transactional(readOnly = true)
    public List<BankAccount> getEntityBankAccounts(String entityType, Long entityId) {
        return bankAccountRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    @Transactional(readOnly = true)
    public Page<BankTransaction> getBankTransactions(Long bankAccountId, Pageable pageable) {
        return bankTransactionRepository.findByBankAccountIdOrderByTransactionDateDesc(bankAccountId, pageable);
    }

    private BigDecimal calculateDifference(BankTransaction bankTxn, LedgerEntry entry) {
        BigDecimal bankAmt = getTransactionAmount(bankTxn);
        BigDecimal entryAmt = getEntryAmount(entry);
        return bankAmt.subtract(entryAmt).abs();
    }

    private BigDecimal getTransactionAmount(BankTransaction txn) {
        return (txn.getCreditAmount() != null ? txn.getCreditAmount() : BigDecimal.ZERO)
            .add(txn.getDebitAmount() != null ? txn.getDebitAmount() : BigDecimal.ZERO);
    }

    private BigDecimal getEntryAmount(LedgerEntry entry) {
        return (entry.getCreditAmount() != null ? entry.getCreditAmount() : BigDecimal.ZERO)
            .add(entry.getDebitAmount() != null ? entry.getDebitAmount() : BigDecimal.ZERO);
    }
}
