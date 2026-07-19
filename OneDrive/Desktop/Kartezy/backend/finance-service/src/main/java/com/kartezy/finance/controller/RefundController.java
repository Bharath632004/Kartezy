package com.kartezy.finance.controller;

import com.kartezy.finance.entity.RefundRecord;
import com.kartezy.finance.service.RefundService;
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
@RequestMapping("/api/finance/refunds")
@RequiredArgsConstructor
@Tag(name = "Refund Accounting", description = "Refund processing and accounting")
public class RefundController {

    private final RefundService refundService;

    @PostMapping
    @Operation(summary = "Process a refund")
    public ResponseEntity<Map<String, Object>> processRefund(@RequestBody RefundRecord record) {
        RefundRecord processed = refundService.processRefund(record);
        return ResponseEntity.ok(wrapResponse(processed, "Refund processed"));
    }

    @GetMapping
    @Operation(summary = "Get refunds for an order or merchant")
    public ResponseEntity<Map<String, Object>> getRefunds(
        @RequestParam(required = false) Long orderId,
        @RequestParam(required = false) Long merchantId,
        Pageable pageable) {
        Page<RefundRecord> refunds;
        if (orderId != null) {
            refunds = refundService.getOrderRefunds(orderId, pageable);
        } else if (merchantId != null) {
            refunds = refundService.getMerchantRefunds(merchantId, pageable);
        } else {
            return ResponseEntity.ok(wrapResponse(null, "Provide orderId or merchantId"));
        }
        return ResponseEntity.ok(wrapResponse(refunds, "Refunds retrieved"));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get refund statistics")
    public ResponseEntity<Map<String, Object>> getRefundStats() {
        Map<String, Object> stats = refundService.getRefundStats();
        return ResponseEntity.ok(wrapResponse(stats, "Refund statistics retrieved"));
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
