package com.kartezy.finance.controller;

import com.kartezy.finance.constants.AccountType;
import com.kartezy.finance.entity.Account;
import com.kartezy.finance.entity.JournalEntry;
import com.kartezy.finance.entity.JournalEntryLine;
import com.kartezy.finance.entity.LedgerEntry;
import com.kartezy.finance.service.AccountingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/accounting")
@RequiredArgsConstructor
@Tag(name = "Accounting", description = "Double-entry accounting, journal entries, ledger, and chart of accounts")
public class AccountingController {

    private final AccountingService accountingService;

    @PostMapping("/accounts")
    @Operation(summary = "Create a new account in chart of accounts")
    public ResponseEntity<Map<String, Object>> createAccount(@RequestBody Account account) {
        Account created = accountingService.createAccount(account);
        return ResponseEntity.ok(wrapResponse(created, "Account created successfully"));
    }

    @GetMapping("/accounts")
    @Operation(summary = "Get all accounts (chart of accounts)")
    public ResponseEntity<Map<String, Object>> getAllAccounts() {
        List<Account> accounts = accountingService.getChartOfAccounts();
        return ResponseEntity.ok(wrapResponse(accounts, "Chart of accounts retrieved"));
    }

    @GetMapping("/accounts/{id}")
    @Operation(summary = "Get account details by ID")
    public ResponseEntity<Map<String, Object>> getAccount(@PathVariable Long id) {
        Account account = accountingService.getAccount(id);
        return ResponseEntity.ok(wrapResponse(account, "Account retrieved"));
    }

    @GetMapping("/accounts/type/{accountType}")
    @Operation(summary = "Get accounts by type")
    public ResponseEntity<Map<String, Object>> getAccountsByType(@PathVariable AccountType accountType) {
        List<Account> accounts = accountingService.getAccountsByType(accountType);
        return ResponseEntity.ok(wrapResponse(accounts, "Accounts by type retrieved"));
    }

    @GetMapping("/accounts/{id}/balance")
    @Operation(summary = "Get account balance")
    public ResponseEntity<Map<String, Object>> getAccountBalance(@PathVariable Long id) {
        BigDecimal balance = accountingService.getAccountBalance(id);
        return ResponseEntity.ok(wrapResponse(balance, "Account balance retrieved"));
    }

    @PostMapping("/journal-entries")
    @Operation(summary = "Create a double-entry journal entry")
    public ResponseEntity<Map<String, Object>> createJournalEntry(
        @RequestBody JournalEntryRequest request) {
        JournalEntry entry = JournalEntry.builder()
            .entryNumber(request.entryNumber())
            .entryDate(request.entryDate())
            .entryType(request.entryType())
            .description(request.description())
            .referenceNumber(request.referenceNumber())
            .referenceType(request.referenceType())
            .build();

        JournalEntry created = accountingService.createJournalEntry(entry, request.lines());
        return ResponseEntity.ok(wrapResponse(created, "Journal entry created"));
    }

    @GetMapping("/journal-entries")
    @Operation(summary = "Get journal entries within date range")
    public ResponseEntity<Map<String, Object>> getJournalEntries(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        Pageable pageable) {
        Page<JournalEntry> entries = accountingService.getJournalEntries(from, to, pageable);
        return ResponseEntity.ok(wrapResponse(entries, "Journal entries retrieved"));
    }

    @GetMapping("/ledger/{accountId}")
    @Operation(summary = "Get account statement/ledger entries")
    public ResponseEntity<Map<String, Object>> getAccountStatement(
        @PathVariable Long accountId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<LedgerEntry> entries = accountingService.getAccountStatement(accountId, from, to);
        return ResponseEntity.ok(wrapResponse(entries, "Account statement retrieved"));
    }

    @PostMapping("/journal-entries/{id}/reverse")
    @Operation(summary = "Reverse a journal entry")
    public ResponseEntity<Map<String, Object>> reverseJournalEntry(
        @PathVariable Long id,
        @RequestParam String reason) {
        JournalEntry reversed = accountingService.reverseJournalEntry(id, reason);
        return ResponseEntity.ok(wrapResponse(reversed, "Journal entry reversed"));
    }

    private Map<String, Object> wrapResponse(Object data, String message) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }

    public record JournalEntryRequest(
        String entryNumber,
        LocalDate entryDate,
        com.kartezy.finance.constants.JournalEntryType entryType,
        String description,
        String referenceNumber,
        String referenceType,
        List<JournalEntryLine> lines
    ) {}
}
