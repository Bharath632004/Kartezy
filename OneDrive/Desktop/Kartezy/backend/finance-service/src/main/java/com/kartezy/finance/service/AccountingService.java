package com.kartezy.finance.service;

import com.kartezy.finance.constants.*;
import com.kartezy.finance.entity.*;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountingService {

    private final AccountRepository accountRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final JournalEntryLineRepository journalEntryLineRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final AuditService auditService;

    @Transactional
    @CacheEvict(value = {"accounts", "ledger", "balances"}, allEntries = true)
    public JournalEntry createJournalEntry(JournalEntry entry, List<JournalEntryLine> lines) {
        log.info("Creating journal entry: {}", entry.getEntryNumber());

        // Validate the entry balances
        BigDecimal totalDebit = lines.stream()
            .map(l -> l.getDebitAmount() != null ? l.getDebitAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCredit = lines.stream()
            .map(l -> l.getCreditAmount() != null ? l.getCreditAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new FinanceException("Journal entry is not balanced. Debit: " + totalDebit + ", Credit: " + totalCredit);
        }

        entry.setTotalDebit(totalDebit);
        entry.setTotalCredit(totalCredit);
        entry.setBalanced(true);
        entry.setStatus("POSTED");
        entry.setPostingDate(LocalDate.now());

        JournalEntry savedEntry = journalEntryRepository.save(entry);

        for (int i = 0; i < lines.size(); i++) {
            JournalEntryLine line = lines.get(i);
            line.setJournalEntry(savedEntry);
            line.setLineNumber(i + 1);
            line.setDebit(line.getDebitAmount().compareTo(BigDecimal.ZERO) > 0);
            JournalEntryLine savedLine = journalEntryLineRepository.save(line);

            // Post to ledger
            postToLedger(savedEntry, savedLine);
        }

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_JOURNAL_ENTRY,
            savedEntry.getId(), savedEntry.getEntryNumber(), "System",
            null, entry.getDescription());

        return savedEntry;
    }

    @Transactional
    protected void postToLedger(JournalEntry entry, JournalEntryLine line) {
        Account account = line.getAccount();
        BigDecimal oldBalance = ledgerEntryRepository.getAccountBalance(account.getId());
        BigDecimal runningBalance = oldBalance;

        LedgerEntry ledgerEntry = LedgerEntry.builder()
            .account(account)
            .entryDate(entry.getEntryDate())
            .transactionType(mapToTransactionType(entry.getEntryType()))
            .description(line.getDescription() != null ? line.getDescription() : entry.getDescription())
            .debitAmount(line.getDebitAmount())
            .creditAmount(line.getCreditAmount())
            .referenceNumber(entry.getEntryNumber())
            .referenceType("JOURNAL_ENTRY")
            .journalEntryId(entry.getId())
            .reconciled(false)
            .build();

        // Calculate running balance based on account type
        if (account.getAccountType() == AccountType.ASSET || account.getAccountType() == AccountType.EXPENSE) {
            // Debit increases balance
            BigDecimal netChange = (line.getDebitAmount() != null ? line.getDebitAmount() : BigDecimal.ZERO)
                .subtract(line.getCreditAmount() != null ? line.getCreditAmount() : BigDecimal.ZERO);
            runningBalance = oldBalance.add(netChange);
        } else {
            // Credit increases balance
            BigDecimal netChange = (line.getCreditAmount() != null ? line.getCreditAmount() : BigDecimal.ZERO)
                .subtract(line.getDebitAmount() != null ? line.getDebitAmount() : BigDecimal.ZERO);
            runningBalance = oldBalance.add(netChange);
        }

        ledgerEntry.setRunningBalance(runningBalance);
        ledgerEntryRepository.save(ledgerEntry);

        // Update account balance
        account.setCurrentBalance(runningBalance);
        accountRepository.save(account);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "accounts", key = "#accountId")
    public Account getAccount(Long accountId) {
        return accountRepository.findById(accountId)
            .orElseThrow(() -> new FinanceException("Account not found: " + accountId));
    }

    @Transactional(readOnly = true)
    public Account getAccountByCode(String code) {
        return accountRepository.findByAccountCode(code)
            .orElseThrow(() -> new FinanceException("Account not found by code: " + code));
    }

    @Transactional(readOnly = true)
    public List<Account> getChartOfAccounts() {
        return accountRepository.findAllActiveAccounts();
    }

    @Transactional(readOnly = true)
    public List<Account> getAccountsByType(AccountType type) {
        return accountRepository.findByAccountType(type);
    }

    @Transactional
    @CacheEvict(value = "accounts", key = "#account.id")
    public Account createAccount(Account account) {
        log.info("Creating account: {}", account.getAccountCode());

        if (accountRepository.findByAccountCode(account.getAccountCode()).isPresent()) {
            throw new FinanceException("Account code already exists: " + account.getAccountCode());
        }

        account.setCurrentBalance(BigDecimal.ZERO);
        account.setLevel(calculateLevel(account));
        account.setPath(calculatePath(account));

        Account saved = accountRepository.save(account);

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_ACCOUNT,
            saved.getId(), saved.getAccountCode(), "System",
            null, "Created account: " + saved.getAccountName());

        return saved;
    }

    @Transactional(readOnly = true)
    public Page<JournalEntry> getJournalEntries(LocalDate from, LocalDate to, Pageable pageable) {
        return journalEntryRepository.findByEntryDateBetween(from, to, pageable);
    }

    @Transactional(readOnly = true)
    public List<LedgerEntry> getAccountStatement(Long accountId, LocalDate from, LocalDate to) {
        return ledgerEntryRepository.getAccountStatement(accountId, from, to);
    }

    @Transactional(readOnly = true)
    public BigDecimal getAccountBalance(Long accountId) {
        return ledgerEntryRepository.getAccountBalance(accountId);
    }

    @Transactional
    @CacheEvict(value = {"accounts", "ledger", "balances"}, allEntries = true)
    public JournalEntry reverseJournalEntry(Long journalEntryId, String reason) {
        JournalEntry original = journalEntryRepository.findById(journalEntryId)
            .orElseThrow(() -> new FinanceException("Journal entry not found: " + journalEntryId));

        if ("REVERSED".equals(original.getStatus())) {
            throw new FinanceException("Journal entry already reversed: " + journalEntryId);
        }

        List<JournalEntryLine> originalLines = journalEntryLineRepository.findByJournalEntryId(journalEntryId);

        String reversalNumber = "REV-" + original.getEntryNumber();
        JournalEntry reversal = JournalEntry.builder()
            .entryNumber(reversalNumber)
            .entryDate(LocalDate.now())
            .entryType(JournalEntryType.REVERSING)
            .description("Reversal: " + reason + " (Original: " + original.getEntryNumber() + ")")
            .referenceNumber(original.getEntryNumber())
            .referenceType("REVERSAL")
            .build();

        List<JournalEntryLine> reversalLines = originalLines.stream()
            .map(line -> JournalEntryLine.builder()
                .account(line.getAccount())
                .description("Reversal: " + line.getDescription())
                .debitAmount(line.getCreditAmount())
                .creditAmount(line.getDebitAmount())
                .referenceId(String.valueOf(original.getId()))
                .referenceType("REVERSAL")
                .build())
            .toList();

        original.setStatus("REVERSED");
        journalEntryRepository.save(original);

        auditService.log(AuditAction.REVERSE, FinanceConstants.ENTITY_JOURNAL_ENTRY,
            original.getId(), original.getEntryNumber(), "System",
            null, "Reversed: " + reason);

        return createJournalEntry(reversal, reversalLines);
    }

    private TransactionType mapToTransactionType(JournalEntryType entryType) {
        return switch (entryType) {
            case STANDARD -> TransactionType.INTERNAL_TRANSFER;
            case ADJUSTING -> TransactionType.ADJUSTMENT_CREDIT;
            case CLOSING -> TransactionType.CLOSING_ENTRY;
            case REVERSING -> TransactionType.REVERSAL;
            case OPENING -> TransactionType.OPENING_BALANCE;
            default -> TransactionType.INTERNAL_TRANSFER;
        };
    }

    private Integer calculateLevel(Account account) {
        if (account.getParentAccount() == null) return 1;
        Integer parentLevel = account.getParentAccount().getLevel();
        return parentLevel != null ? parentLevel + 1 : 2;
    }

    private String calculatePath(Account account) {
        if (account.getParentAccount() == null) return account.getAccountCode();
        String parentPath = account.getParentAccount().getPath();
        return parentPath != null ? parentPath + "." + account.getAccountCode() : account.getAccountCode();
    }
}
