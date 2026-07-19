package com.kartezy.orderservice.controller;

import com.kartezy.orderservice.dto.*;
import com.kartezy.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderServiceController {
    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderEnhancedDto> createOrder(@Valid @RequestBody CreateOrderRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderEnhancedDto> getOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrderDetail(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderEnhancedDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrderEnhancedDto>> getUserOrders(@PathVariable UUID userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrderEnhancedDto>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status.toUpperCase()));
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderEnhancedDto> updateStatus(@PathVariable UUID orderId,
                                                          @Valid @RequestBody OrderStatusUpdateDto update) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, update));
    }

    @PutMapping("/{orderId}/assign/{driverId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderEnhancedDto> assignDriver(@PathVariable UUID orderId,
                                                          @PathVariable UUID driverId,
                                                          @RequestParam(required = false) String driverName,
                                                          @RequestParam(required = false) String driverPhone) {
        return ResponseEntity.ok(orderService.assignDriver(orderId, driverId, driverName, driverPhone));
    }

    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderEnhancedDto> cancelOrder(@PathVariable UUID orderId,
                                                         @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId, reason));
    }

    @PutMapping("/{orderId}/return")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderEnhancedDto> returnOrder(@PathVariable UUID orderId,
                                                         @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(orderService.returnOrder(orderId, reason));
    }

    @PutMapping("/{orderId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderEnhancedDto> refundOrder(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.refundOrder(orderId));
    }

    @GetMapping("/{orderId}/invoice")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderInvoiceDto> getInvoice(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.generateInvoice(orderId));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderStatsDto> getStats() {
        return ResponseEntity.ok(orderService.getOrderStats());
    }

    @GetMapping("/health")
    public String health() { return "order-service is healthy"; }
}
