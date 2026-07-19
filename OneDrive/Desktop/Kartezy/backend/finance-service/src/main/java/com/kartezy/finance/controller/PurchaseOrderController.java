package com.kartezy.finance.controller;

import com.kartezy.finance.entity.PurchaseOrder;
import com.kartezy.finance.entity.PurchaseOrderItem;
import com.kartezy.finance.service.PurchaseOrderService;
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
@RequestMapping("/api/finance/purchase-orders")
@RequiredArgsConstructor
@Tag(name = "Purchase Orders", description = "Purchase order management")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @PostMapping
    @Operation(summary = "Create a purchase order with items")
    public ResponseEntity<Map<String, Object>> createPurchaseOrder(
        @RequestPart PurchaseOrder purchaseOrder,
        @RequestPart List<PurchaseOrderItem> items) {
        PurchaseOrder created = purchaseOrderService.createPurchaseOrder(purchaseOrder, items);
        return ResponseEntity.ok(wrapResponse(created, "Purchase order created"));
    }

    @GetMapping
    @Operation(summary = "Get purchase orders with filters")
    public ResponseEntity<Map<String, Object>> getPurchaseOrders(
        @RequestParam(required = false) Long vendorId,
        @RequestParam(required = false) String status,
        Pageable pageable) {
        Page<PurchaseOrder> orders = purchaseOrderService.getPurchaseOrders(vendorId, status, pageable);
        return ResponseEntity.ok(wrapResponse(orders, "Purchase orders retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get purchase order details")
    public ResponseEntity<Map<String, Object>> getPurchaseOrder(@PathVariable Long id) {
        PurchaseOrder order = purchaseOrderService.getPurchaseOrder(id);
        return ResponseEntity.ok(wrapResponse(order, "Purchase order retrieved"));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve purchase order")
    public ResponseEntity<Map<String, Object>> approvePurchaseOrder(
        @PathVariable Long id,
        @RequestParam String approvedBy) {
        PurchaseOrder order = purchaseOrderService.approvePurchaseOrder(id, approvedBy);
        return ResponseEntity.ok(wrapResponse(order, "Purchase order approved"));
    }

    @PostMapping("/{id}/receive")
    @Operation(summary = "Mark purchase order as received")
    public ResponseEntity<Map<String, Object>> receivePurchaseOrder(@PathVariable Long id) {
        PurchaseOrder order = purchaseOrderService.receivePurchaseOrder(id);
        return ResponseEntity.ok(wrapResponse(order, "Purchase order received"));
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
