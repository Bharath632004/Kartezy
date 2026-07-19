package com.kartezy.finance.service;

import com.kartezy.finance.constants.*;
import com.kartezy.finance.entity.*;
import com.kartezy.finance.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaxServiceTest {

    @Mock private TaxRecordRepository taxRecordRepository;
    @Mock private GSTRecordRepository gstRecordRepository;
    @Mock private AccountingService accountingService;
    @Mock private AccountRepository accountRepository;
    @Mock private AuditService auditService;

    private TaxService taxService;

    @BeforeEach
    void setUp() {
        taxService = new TaxService(taxRecordRepository, gstRecordRepository,
            accountingService, accountRepository, auditService);
    }

    @Test
    @DisplayName("Should create GST record as pending")
    void createGSTEntry_ShouldCreatePending() {
        GSTRecord record = GSTRecord.builder()
            .gstin("27AABCU1234D1Z1").gstType(GSTType.CGST)
            .returnPeriod("06/2026").taxableValue(BigDecimal.valueOf(10000))
            .taxAmount(BigDecimal.valueOf(900)).build();

        when(gstRecordRepository.save(any(GSTRecord.class)))
            .thenAnswer(inv -> { GSTRecord r = inv.getArgument(0); r.setId(1L); return r; });

        GSTRecord result = taxService.createGSTEntry(record);
        assertEquals("PENDING", result.getStatus());
    }

    @Test
    @DisplayName("Should file GST return and create journal entry")
    void fileGSTReturn_ShouldUpdateRecordsAndCreateJE() {
        String period = "06/2026";
        when(gstRecordRepository.getTotalInputCredit(period))
            .thenReturn(BigDecimal.valueOf(50000));
        when(gstRecordRepository.getTotalOutputLiability(period))
            .thenReturn(BigDecimal.valueOf(120000));
        when(gstRecordRepository.findByReturnPeriod(period))
            .thenReturn(List.of(
                GSTRecord.builder().id(1L).returnFiled(false).build(),
                GSTRecord.builder().id(2L).returnFiled(false).build()
            ));
        when(gstRecordRepository.saveAll(anyList()))
            .thenAnswer(inv -> inv.getArgument(0));
        when(accountRepository.findByAccountCode(FinanceConstants.GST_PAYABLE_CODE))
            .thenReturn(Optional.of(Account.builder().id(1L).build()));
        when(accountRepository.findByAccountCode(FinanceConstants.CASH_ACCOUNT_CODE))
            .thenReturn(Optional.of(Account.builder().id(2L).build()));

        GSTRecord result = taxService.fileGSTReturn(period);

        assertNotNull(result);
        verify(gstRecordRepository).saveAll(anyList());
        verify(accountingService, times(1)).createJournalEntry(any(), anyList());
    }

    @Test
    @DisplayName("Should deduct TDS and create journal entry")
    void deductTDS_ShouldCreateDeductionEntry() {
        TaxRecord record = TaxRecord.builder()
            .taxType("TDS").tdsSection("194C")
            .taxableAmount(BigDecimal.valueOf(500000))
            .taxAmount(BigDecimal.valueOf(5000))
            .tdsRate(BigDecimal.ONE).build();

        when(taxRecordRepository.save(any(TaxRecord.class)))
            .thenAnswer(inv -> inv.getArgument(0));
        when(accountRepository.findByAccountCode(anyString()))
            .thenReturn(Optional.of(Account.builder().id(1L).build()));

        TaxRecord result = taxService.deductTDS(record);

        assertTrue(result.getIsDeductedAtSource());
        assertEquals("TDS", result.getTaxType());
        assertEquals("PENDING_DEPOSIT", result.getStatus());
        verify(accountingService, times(1)).createJournalEntry(any(), anyList());
    }

    @Test
    @DisplayName("Should get GST summary")
    void getGSTSummary_ShouldReturnCorrectValues() {
        String period = "06/2026";
        when(gstRecordRepository.getTotalInputCredit(period))
            .thenReturn(BigDecimal.valueOf(50000));
        when(gstRecordRepository.getTotalOutputLiability(period))
            .thenReturn(BigDecimal.valueOf(120000));

        Map<String, BigDecimal> summary = taxService.getGSTSummary(period);
        assertEquals(BigDecimal.valueOf(50000), summary.get("totalInputCredit"));
        assertEquals(BigDecimal.valueOf(120000), summary.get("totalOutputLiability"));
        assertEquals(BigDecimal.valueOf(70000), summary.get("netPayable"));
    }
}
