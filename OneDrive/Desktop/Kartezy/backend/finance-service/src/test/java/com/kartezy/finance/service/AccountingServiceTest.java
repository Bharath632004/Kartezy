package com.kartezy.finance.service;

import com.kartezy.finance.constants.*;
import com.kartezy.finance.entity.*;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountingServiceTest {

    @Mock private AccountRepository accountRepository;
    @Mock private JournalEntryRepository journalEntryRepository;
    @Mock private JournalEntryLineRepository journalEntryLineRepository;
    @Mock private LedgerEntryRepository ledgerEntryRepository;
    @Mock private AuditService auditService;

    private AccountingService accountingService;

    @BeforeEach
    void setUp() {
        accountingService = new AccountingService(
            accountRepository, journalEntryRepository,
            journalEntryLineRepository, ledgerEntryRepository,
            auditService);
    }

    @Test
    @DisplayName("Should create a balanced journal entry")
    void createJournalEntry_ShouldSucceed_WhenBalanced() {
        Account cashAccount = Account.builder().id(1L).accountCode("101001")
            .accountName("Cash").accountType(AccountType.ASSET).currentBalance(BigDecimal.ZERO).build();
        Account revenueAccount = Account.builder().id(2L).accountCode("401001")
            .accountName("Revenue").accountType(AccountType.REVENUE).currentBalance(BigDecimal.ZERO).build();

        JournalEntry entry = JournalEntry.builder()
            .entryNumber("JE-TEST-001").entryDate(LocalDate.now())
            .entryType(JournalEntryType.STANDARD).description("Test entry").build();

        List<JournalEntryLine> lines = List.of(
            JournalEntryLine.builder().account(cashAccount)
                .debitAmount(BigDecimal.valueOf(1000)).creditAmount(BigDecimal.ZERO).build(),
            JournalEntryLine.builder().account(revenueAccount)
                .debitAmount(BigDecimal.ZERO).creditAmount(BigDecimal.valueOf(1000)).build()
        );

        when(journalEntryRepository.save(any(JournalEntry.class))).thenAnswer(inv -> {
            JournalEntry e = inv.getArgument(0);
            e.setId(1L);
            return e;
        });
        when(journalEntryLineRepository.save(any(JournalEntryLine.class))).thenAnswer(inv -> {
            JournalEntryLine l = inv.getArgument(0);
            l.setId(1L);
            return l;
        });
        when(ledgerEntryRepository.getAccountBalance(anyLong())).thenReturn(BigDecimal.ZERO);

        JournalEntry result = accountingService.createJournalEntry(entry, lines);

        assertNotNull(result);
        assertTrue(result.isBalanced());
        assertEquals("POSTED", result.getStatus());
        assertEquals(BigDecimal.valueOf(1000), result.getTotalDebit());
        assertEquals(BigDecimal.valueOf(1000), result.getTotalCredit());

        verify(journalEntryRepository, times(1)).save(any(JournalEntry.class));
        verify(journalEntryLineRepository, times(2)).save(any(JournalEntryLine.class));
    }

    @Test
    @DisplayName("Should throw exception when journal entry is not balanced")
    void createJournalEntry_ShouldThrow_WhenNotBalanced() {
        Account account = Account.builder().id(1L).build();
        JournalEntry entry = JournalEntry.builder().entryNumber("JE-TEST-002")
            .entryDate(LocalDate.now()).entryType(JournalEntryType.STANDARD).build();

        List<JournalEntryLine> lines = List.of(
            JournalEntryLine.builder().account(account)
                .debitAmount(BigDecimal.valueOf(1000)).creditAmount(BigDecimal.ZERO).build(),
            JournalEntryLine.builder().account(account)
                .debitAmount(BigDecimal.ZERO).creditAmount(BigDecimal.valueOf(500)).build()
        );

        FinanceException exception = assertThrows(FinanceException.class,
            () -> accountingService.createJournalEntry(entry, lines));
        assertTrue(exception.getMessage().contains("not balanced"));
    }

    @Test
    @DisplayName("Should get account by ID")
    void getAccount_ShouldReturnAccount_WhenFound() {
        Account account = Account.builder().id(1L).accountCode("101001")
            .accountName("Cash").accountType(AccountType.ASSET).build();
        when(accountRepository.findById(1L)).thenReturn(Optional.of(account));

        Account result = accountingService.getAccount(1L);
        assertEquals("Cash", result.getAccountName());
        assertEquals("101001", result.getAccountCode());
    }

    @Test
    @DisplayName("Should throw exception when account not found")
    void getAccount_ShouldThrow_WhenNotFound() {
        when(accountRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(FinanceException.class, () -> accountingService.getAccount(999L));
    }

    @Test
    @DisplayName("Should get chart of accounts")
    void getChartOfAccounts_ShouldReturnAllAccounts() {
        List<Account> accounts = List.of(
            Account.builder().id(1L).accountCode("1").accountName("Assets").build(),
            Account.builder().id(2L).accountCode("2").accountName("Liabilities").build()
        );
        when(accountRepository.findAllActiveAccounts()).thenReturn(accounts);

        List<Account> result = accountingService.getChartOfAccounts();
        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("Should reverse a journal entry")
    void reverseJournalEntry_ShouldCreateReversal() {
        JournalEntry original = JournalEntry.builder().id(1L).entryNumber("JE-ORIG-001")
            .entryDate(LocalDate.now()).entryType(JournalEntryType.STANDARD)
            .description("Original entry").status("POSTED").build();

        Account account = Account.builder().id(1L).build();
        List<JournalEntryLine> lines = List.of(
            JournalEntryLine.builder().id(1L).account(account)
                .debitAmount(BigDecimal.valueOf(500)).creditAmount(BigDecimal.ZERO).build(),
            JournalEntryLine.builder().id(2L).account(account)
                .debitAmount(BigDecimal.ZERO).creditAmount(BigDecimal.valueOf(500)).build()
        );

        when(journalEntryRepository.findById(1L)).thenReturn(Optional.of(original));
        when(journalEntryLineRepository.findByJournalEntryId(1L)).thenReturn(lines);
        when(journalEntryRepository.save(any(JournalEntry.class))).thenAnswer(inv -> inv.getArgument(0));
        when(journalEntryLineRepository.save(any(JournalEntryLine.class))).thenAnswer(inv -> inv.getArgument(0));
        when(ledgerEntryRepository.getAccountBalance(anyLong())).thenReturn(BigDecimal.ZERO);

        JournalEntry reversal = accountingService.reverseJournalEntry(1L, "Test reversal");

        assertNotNull(reversal);
        assertEquals("REVERSED", original.getStatus());
        verify(journalEntryRepository, atLeastOnce()).save(any(JournalEntry.class));
    }

    @Test
    @DisplayName("Should throw when reversing already reversed entry")
    void reverseJournalEntry_ShouldThrow_WhenAlreadyReversed() {
        JournalEntry original = JournalEntry.builder().id(1L)
            .entryNumber("JE-REV-001").status("REVERSED").build();
        when(journalEntryRepository.findById(1L)).thenReturn(Optional.of(original));

        assertThrows(FinanceException.class,
            () -> accountingService.reverseJournalEntry(1L, "Already reversed"));
    }

    @Test
    @DisplayName("Should get paginated journal entries")
    void getJournalEntries_ShouldReturnPage() {
        LocalDate from = LocalDate.now().minusDays(30);
        LocalDate to = LocalDate.now();
        PageRequest pageable = PageRequest.of(0, 20);
        Page<JournalEntry> expectedPage = new PageImpl<>(List.of(
            JournalEntry.builder().id(1L).entryNumber("JE-001").build()
        ));

        when(journalEntryRepository.findByEntryDateBetween(from, to, pageable))
            .thenReturn(expectedPage);

        Page<JournalEntry> result = accountingService.getJournalEntries(from, to, pageable);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    @DisplayName("Should get account statement")
    void getAccountStatement_ShouldReturnEntries() {
        LocalDate from = LocalDate.now().minusDays(30);
        LocalDate to = LocalDate.now();
        List<LedgerEntry> entries = List.of(
            LedgerEntry.builder().id(1L).description("Test entry").build()
        );

        when(ledgerEntryRepository.getAccountStatement(1L, from, to)).thenReturn(entries);

        List<LedgerEntry> result = accountingService.getAccountStatement(1L, from, to);
        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Create account should throw on duplicate code")
    void createAccount_ShouldThrow_WhenCodeExists() {
        Account account = Account.builder().accountCode("101001").accountName("Cash").build();
        when(accountRepository.findByAccountCode("101001"))
            .thenReturn(Optional.of(Account.builder().build()));

        assertThrows(FinanceException.class, () -> accountingService.createAccount(account));
    }

    @Test
    @DisplayName("Should post to ledger correctly for asset account")
    void postToLedger_ForAssetAccount_ShouldIncreaseBalanceOnDebit() {
        Account assetAccount = Account.builder().id(1L).accountCode("101001")
            .accountName("Cash").accountType(AccountType.ASSET).currentBalance(BigDecimal.ZERO).build();
        when(ledgerEntryRepository.getAccountBalance(1L)).thenReturn(BigDecimal.ZERO);

        JournalEntry entry = JournalEntry.builder().id(1L).entryNumber("JE-001")
            .entryDate(LocalDate.now()).entryType(JournalEntryType.STANDARD).build();
        JournalEntryLine line = JournalEntryLine.builder()
            .account(assetAccount).debitAmount(BigDecimal.valueOf(5000))
            .creditAmount(BigDecimal.ZERO).description("Test debit").build();

        when(ledgerEntryRepository.save(any(LedgerEntry.class))).thenAnswer(inv -> inv.getArgument(0));
        when(accountRepository.save(any(Account.class))).thenReturn(assetAccount);

        accountingService.postToLedger(entry, line);

        verify(ledgerEntryRepository, times(1)).save(any(LedgerEntry.class));
        verify(accountRepository, times(1)).save(any(Account.class));
        assertEquals(BigDecimal.valueOf(5000), assetAccount.getCurrentBalance());
    }
}
