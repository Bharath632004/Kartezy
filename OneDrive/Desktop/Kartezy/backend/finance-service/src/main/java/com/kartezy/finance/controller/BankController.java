package com.kartezy.finance.controller;

import com.kartezy.finance.entity.BankAccount;
import com.kartezy.finance.entity.BankTransaction;
import com.kartezy.finance.entity.ReconciliationRecord;
import com.kartezy.finance.service.BankService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/banks")
@RequiredArgsConstructor
@Tag(name = "Multi-Bank Support", description = "Bank account management, transaction import, and reconciliation")
public class BankController {

    private final BankService bankService;

    @PostMapping("/accounts")
    @Operation(summary = "Register a bank account")
    public ResponseEntity<Map<String, Object>> registerBankAccount(@RequestBody BankAccount account) {
        BankAccount saved = bankService.registerBankAccount(account);
        return ResponseEntity.ok(wrapResponse(saved, "Bank account registered"));
    }

    @GetMapping("/accounts")
    @Operation(summary = "Get bank accounts for an entity")
    public ResponseEntity<Map<String, Object>> getBankAccounts(
        @RequestParam String entityType,
        @RequestParam Long entityId) {
        List<BankAccount> accounts = bankService.getEntityBankAccounts(entityType, entityId);
        return ResponseEntity.ok(wrapResponse(accounts, "Bank accounts retrieved"));
    }

    @PostMapping("/transactions/import")
    @Operation(summary = "Import bank transactions")
    public ResponseEntity<Map<String, Object>> importTransactions(@RequestBody List<BankTransaction> transactions) {
        List<BankTransaction> saved = bankService.bulkImportTransactions(transactions);
        return ResponseEntity.ok(wrapResponse(saved, "Transactions imported"));
    }

    @GetMapping("/transactions/{bankAccountId}")
    @Operation(summary = "Get bank transactions for an account")
    public ResponseEntity<Map<String, Object>> getBankTransactions(
        @PathVariable Long bankAccountId, Pageable pageable) {
        Page<BankTransaction> transactions = bankService.getBankTransactions(bankAccountId, pageable);
        return ResponseEntity.ok(wrapResponse(transactions, "Bank transactions retrieved"));
    }

    @PostMapping("/reconcile")
    @Operation(summary = "Manually reconcile a transaction")
    public ResponseEntity<Map<String, Object>> reconcileTransaction(
        @RequestParam Long bankTransactionId,
        @RequestParam Long systemTransactionId,
        @RequestParam String systemType,
        @RequestParam String matchedBy) {
        ReconciliationRecord record = bankService.reconcileTransaction(
            bankTransactionId, systemTransactionId, systemType, matchedBy);
        return ResponseEntity.ok(wrapResponse(record, "Transaction reconciled"));
    }

    @PostMapping("/reconcile/auto/{bankAccountId}")
    @Operation(summary = "Auto-reconcile bank account transactions")
    public ResponseEntity<Map<String, Object>> autoReconcile(@PathVariable Long bankAccountId) {
        List<ReconciliationRecord> records = bankService.autoReconcile(bankAccountId);
        return ResponseEntity.ok(wrapResponse(records, "Auto-reconciliation completed"));
    }

    private Map<String, Object> wrapResponse(Object data, String message) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
