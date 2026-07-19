package com.kartezy.finance.controller;

import com.kartezy.finance.entity.WalletTransaction;
import com.kartezy.finance.service.WalletAccountingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/wallet-accounting")
@RequiredArgsConstructor
@Tag(name = "Wallet Accounting", description = "Wallet transaction tracking synced with wallet-service")
public class WalletController {

    private final WalletAccountingService walletAccountingService;

    @PostMapping("/transactions")
    @Operation(summary = "Record a wallet transaction")
    public ResponseEntity<Map<String, Object>> recordTransaction(@RequestBody WalletTransaction transaction) {
        WalletTransaction saved = walletAccountingService.recordWalletTransaction(transaction);
        return ResponseEntity.ok(wrapResponse(saved, "Wallet transaction recorded"));
    }

    @GetMapping("/merchant/{merchantId}")
    @Operation(summary = "Get wallet transactions for a merchant")
    public ResponseEntity<Map<String, Object>> getMerchantTransactions(
        @PathVariable Long merchantId, Pageable pageable) {
        Page<WalletTransaction> transactions = walletAccountingService.getMerchantWalletTransactions(merchantId, pageable);
        return ResponseEntity.ok(wrapResponse(transactions, "Merchant wallet transactions retrieved"));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get wallet transactions for a customer")
    public ResponseEntity<Map<String, Object>> getCustomerTransactions(
        @PathVariable Long customerId, Pageable pageable) {
        Page<WalletTransaction> transactions = walletAccountingService.getCustomerWalletTransactions(customerId, pageable);
        return ResponseEntity.ok(wrapResponse(transactions, "Customer wallet transactions retrieved"));
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
