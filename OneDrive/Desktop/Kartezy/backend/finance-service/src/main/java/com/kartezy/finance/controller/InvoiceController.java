package com.kartezy.finance.controller;

import com.kartezy.finance.constants.InvoiceStatus;
import com.kartezy.finance.entity.Invoice;
import com.kartezy.finance.entity.InvoicePayment;
import com.kartezy.finance.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices", description = "Invoice management and payment tracking")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    @Operation(summary = "Create a new invoice")
    public ResponseEntity<Map<String, Object>> createInvoice(@RequestBody Invoice invoice) {
        Invoice created = invoiceService.createInvoice(invoice);
        return ResponseEntity.ok(wrapResponse(created, "Invoice created"));
    }

    @GetMapping
    @Operation(summary = "Get invoices with filters")
    public ResponseEntity<Map<String, Object>> getInvoices(
        @RequestParam(required = false) Long merchantId,
        @RequestParam(required = false) Long vendorId,
        @RequestParam(required = false) InvoiceStatus status,
        Pageable pageable) {
        Page<Invoice> invoices = invoiceService.getInvoices(merchantId, vendorId, status, pageable);
        return ResponseEntity.ok(wrapResponse(invoices, "Invoices retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get invoice details")
    public ResponseEntity<Map<String, Object>> getInvoice(@PathVariable Long id) {
        Invoice invoice = invoiceService.getInvoice(id);
        return ResponseEntity.ok(wrapResponse(invoice, "Invoice retrieved"));
    }

    @PostMapping("/{id}/send")
    @Operation(summary = "Send/issue invoice")
    public ResponseEntity<Map<String, Object>> sendInvoice(@PathVariable Long id) {
        Invoice invoice = invoiceService.sendInvoice(id);
        return ResponseEntity.ok(wrapResponse(invoice, "Invoice sent"));
    }

    @PostMapping("/{id}/pay")
    @Operation(summary = "Record payment against invoice")
    public ResponseEntity<Map<String, Object>> recordPayment(
        @PathVariable Long id,
        @RequestParam BigDecimal amount,
        @RequestParam String paymentReference,
        @RequestParam String paymentMethod) {
        InvoicePayment payment = invoiceService.recordPayment(id, amount, paymentReference, paymentMethod);
        return ResponseEntity.ok(wrapResponse(payment, "Payment recorded"));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an invoice")
    public ResponseEntity<Map<String, Object>> cancelInvoice(
        @PathVariable Long id,
        @RequestParam String reason) {
        Invoice invoice = invoiceService.cancelInvoice(id, reason);
        return ResponseEntity.ok(wrapResponse(invoice, "Invoice cancelled"));
    }

    @GetMapping("/outstanding")
    @Operation(summary = "Get total outstanding amount")
    public ResponseEntity<Map<String, Object>> getOutstanding(
        @RequestParam(required = false) Long merchantId) {
        BigDecimal outstanding = merchantId != null
            ? invoiceService.getMerchantOutstanding(merchantId)
            : invoiceService.getTotalOutstanding();
        return ResponseEntity.ok(wrapResponse(outstanding, "Outstanding amount retrieved"));
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
