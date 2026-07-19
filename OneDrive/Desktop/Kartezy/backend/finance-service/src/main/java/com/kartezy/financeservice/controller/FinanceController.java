package com.kartezy.financeservice.controller;
import com.kartezy.financeservice.entity.*;
import com.kartezy.financeservice.repository.*;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/finance") @RequiredArgsConstructor
public class FinanceController {
    private final InvoiceRepository invoiceRepository;
    private final LedgerEntryRepository ledgerRepository;

    @GetMapping("/invoices/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Invoice> getInvoice(@PathVariable UUID orderId) {
        return ResponseEntity.ok(invoiceRepository.findByOrderId(orderId)
            .orElseThrow(() -> new RuntimeException("Invoice not found")));
    }

    @GetMapping("/invoices")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceRepository.findAll());
    }

    @GetMapping("/ledger/{accountId}")
    @PreAuthorize("isAuthenticated()")
    @Cacheable(value = "ledger", key = "#accountId")
    public ResponseEntity<List<LedgerEntry>> getLedger(@PathVariable String accountId) {
        return ResponseEntity.ok(ledgerRepository.findByAccountIdOrderByEntryDateDesc(accountId));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    @Cacheable(value = "financeSummary")
    public ResponseEntity<FinanceSummary> getSummary() {
        List<Invoice> invoices = invoiceRepository.findAll();
        BigDecimal totalRevenue = invoices.stream().filter(i -> "PAID".equals(i.getStatus()))
            .map(Invoice::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalPending = invoices.stream().filter(i -> "PENDING".equals(i.getStatus()))
            .map(Invoice::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return ResponseEntity.ok(new FinanceSummary(
            (long) invoices.size(), totalRevenue, totalPending,
            invoices.stream().filter(i -> "PAID".equals(i.getStatus())).count(),
            invoices.stream().filter(i -> "OVERDUE".equals(i.getStatus())).count()));
    }

    record FinanceSummary(long totalInvoices, BigDecimal totalRevenue, BigDecimal totalPending,
                          long paidCount, long overdueCount) {}
}
