package com.kartezy.financeservice.controller;

import com.kartezy.financeservice.dto.InvoiceDto;
import com.kartezy.financeservice.dto.SettlementDto;
import com.kartezy.financeservice.dto.TransactionDto;
import com.kartezy.financeservice.service.FinanceService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    // Transactions
    @PostMapping("/transactions")
    @PreAuthorize("hasAnyRole('ADMIN', 'MERCHANT')")
    public ResponseEntity<ApiResponse<TransactionDto>> createTransaction(@RequestBody TransactionDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(financeService.createTransaction(request), "Transaction created"));
    }

    @PostMapping("/transactions/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TransactionDto>> completeTransaction(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(financeService.completeTransaction(id)));
    }

    @GetMapping("/transactions/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TransactionDto>> getTransaction(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(financeService.getTransaction(id)));
    }

    @GetMapping("/transactions/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TransactionDto>>> getUserTransactions(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(financeService.getUserTransactions(userId)));
    }

    @GetMapping("/transactions/merchant/{merchantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MERCHANT')")
    public ResponseEntity<ApiResponse<List<TransactionDto>>> getMerchantTransactions(@PathVariable UUID merchantId) {
        return ResponseEntity.ok(ApiResponse.success(financeService.getMerchantTransactions(merchantId)));
    }

    // Invoices
    @PostMapping("/invoices")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<InvoiceDto>> createInvoice(@RequestBody InvoiceDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(financeService.createInvoice(request), "Invoice created"));
    }

    @GetMapping("/invoices/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<InvoiceDto>> getInvoice(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(financeService.getInvoice(id)));
    }

    @GetMapping("/invoices/merchant/{merchantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MERCHANT')")
    public ResponseEntity<ApiResponse<List<InvoiceDto>>> getMerchantInvoices(@PathVariable UUID merchantId) {
        return ResponseEntity.ok(ApiResponse.success(financeService.getMerchantInvoices(merchantId)));
    }

    // Settlements
    @PostMapping("/settlements")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SettlementDto>> createSettlement(@RequestBody SettlementDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(financeService.createSettlement(request), "Settlement created"));
    }

    @GetMapping("/settlements/merchant/{merchantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MERCHANT')")
    public ResponseEntity<ApiResponse<List<SettlementDto>>> getMerchantSettlements(@PathVariable UUID merchantId) {
        return ResponseEntity.ok(ApiResponse.success(financeService.getMerchantSettlements(merchantId)));
    }
}
