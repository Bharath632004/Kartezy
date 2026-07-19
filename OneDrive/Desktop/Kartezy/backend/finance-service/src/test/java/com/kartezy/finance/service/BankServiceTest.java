package com.kartezy.finance.service;

import com.kartezy.finance.constants.ReconciliationStatus;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BankServiceTest {

    @Mock private BankAccountRepository bankAccountRepository;
    @Mock private BankTransactionRepository bankTransactionRepository;
    @Mock private ReconciliationRecordRepository reconciliationRepository;
    @Mock private LedgerEntryRepository ledgerEntryRepository;
    @Mock private AuditService auditService;

    private BankService bankService;

    @BeforeEach
    void setUp() {
        bankService = new BankService(bankAccountRepository, bankTransactionRepository,
            reconciliationRepository, ledgerEntryRepository, auditService);
    }

    @Test
    @DisplayName("Should register a bank account")
    void registerBankAccount_ShouldActivate() {
        BankAccount account = BankAccount.builder()
            .bankName("HDFC Bank").accountHolderName("Test Company")
            .build();
        when(bankAccountRepository.save(any(BankAccount.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        BankAccount result = bankService.registerBankAccount(account);
        assertTrue(result.getIsActive());
    }

    @Test
    @DisplayName("Should reconcile exact matching transactions")
    void reconcileTransaction_ShouldMatch_WhenAmountsEqual() {
        BankTransaction bankTxn = BankTransaction.builder()
            .id(1L).creditAmount(BigDecimal.valueOf(5000)).debitAmount(BigDecimal.ZERO).build();
        LedgerEntry ledgerEntry = LedgerEntry.builder()
            .id(1L).creditAmount(BigDecimal.valueOf(5000)).debitAmount(BigDecimal.ZERO).build();

        when(bankTransactionRepository.findById(1L)).thenReturn(Optional.of(bankTxn));
        when(ledgerEntryRepository.findById(1L)).thenReturn(Optional.of(ledgerEntry));
        when(reconciliationRepository.save(any(ReconciliationRecord.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        ReconciliationRecord result = bankService.reconcileTransaction(
            1L, 1L, "PAYMENT", "Admin");

        assertEquals(ReconciliationStatus.MATCHED, result.getStatus());
        assertEquals("EXACT", result.getMatchType());
        assertEquals(BigDecimal.ZERO, result.getDifferenceAmount());
        assertTrue(bankTxn.getIsReconciled());
        assertTrue(ledgerEntry.isReconciled());
    }

    @Test
    @DisplayName("Should flag partial match when amounts differ")
    void reconcileTransaction_ShouldFlagPartial_WhenAmountsDiffer() {
        BankTransaction bankTxn = BankTransaction.builder()
            .id(1L).creditAmount(BigDecimal.valueOf(5000)).debitAmount(BigDecimal.ZERO).build();
        LedgerEntry ledgerEntry = LedgerEntry.builder()
            .id(1L).creditAmount(BigDecimal.valueOf(4800)).debitAmount(BigDecimal.ZERO).build();

        when(bankTransactionRepository.findById(1L)).thenReturn(Optional.of(bankTxn));
        when(ledgerEntryRepository.findById(1L)).thenReturn(Optional.of(ledgerEntry));
        when(reconciliationRepository.save(any(ReconciliationRecord.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        ReconciliationRecord result = bankService.reconcileTransaction(
            1L, 1L, "PAYMENT", "Admin");

        assertEquals(ReconciliationStatus.PARTIALLY_MATCHED, result.getStatus());
        assertEquals("PARTIAL", result.getMatchType());
    }

    @Test
    @DisplayName("Should auto-reconcile by reference number")
    void autoReconcile_ShouldMatchByReference() {
        BankTransaction bankTxn = BankTransaction.builder()
            .id(1L).referenceNumber("PAY-REF-001")
            .creditAmount(BigDecimal.valueOf(5000)).debitAmount(BigDecimal.ZERO)
            .build();

        LedgerEntry entry = LedgerEntry.builder()
            .id(1L).referenceNumber("PAY-REF-001")
            .creditAmount(BigDecimal.valueOf(5000)).debitAmount(BigDecimal.ZERO)
            .reconciled(false).build();

        when(bankTransactionRepository.findUnreconciledByBankAccountId(100L))
            .thenReturn(List.of(bankTxn));
        when(ledgerEntryRepository.findByReferenceNumber("PAY-REF-001"))
            .thenReturn(List.of(entry));
        when(reconciliationRepository.save(any(ReconciliationRecord.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        List<ReconciliationRecord> results = bankService.autoReconcile(100L);

        assertEquals(1, results.size());
        assertEquals(ReconciliationStatus.MATCHED, results.get(0).getStatus());
        assertTrue(results.get(0).getIsAutoMatched());
    }

    @Test
    @DisplayName("Should bulk import bank transactions")
    void bulkImportTransactions_ShouldSetImportedStatus() {
        List<BankTransaction> txns = List.of(
            BankTransaction.builder().description("Txn 1").build(),
            BankTransaction.builder().description("Txn 2").build()
        );
        when(bankTransactionRepository.saveAll(anyList()))
            .thenAnswer(inv -> inv.getArgument(0));

        List<BankTransaction> result = bankService.bulkImportTransactions(txns);
        assertEquals(2, result.size());
        result.forEach(t -> assertEquals("IMPORTED", t.getStatus()));
    }
}
