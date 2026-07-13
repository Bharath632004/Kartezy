package com.kartezy.orderservice.controller;

import com.kartezy.orderservice.dto.OrderDto;
import com.kartezy.orderservice.entity.Order;
import com.kartezy.orderservice.repository.OrderRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderServiceController {

    private final OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<List<OrderDto>> getList(@RequestParam java.util.Map<String, String> params) {
        List<Order> orders = orderRepository.findAll();
        List<OrderDto> dtos = orders.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getDetail(@PathVariable UUID id) {
        return orderRepository.findById(id)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{orderId}/assign/{driverId}")
    public ResponseEntity<?> assignDriver(@PathVariable UUID orderId, @PathVariable UUID driverId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setDriverId(driverId);
                    orderRepository.save(order);
                    return ResponseEntity.ok("Driver assigned successfully");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{orderId}/reassign/{driverId}")
    public ResponseEntity<?> reassignDriver(@PathVariable UUID orderId, @PathVariable UUID driverId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setDriverId(driverId);
                    orderRepository.save(order);
                    return ResponseEntity.ok("Driver reassigned successfully");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable UUID orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus("CANCELLED");
                    orderRepository.save(order);
                    return ResponseEntity.ok("Order cancelled");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{orderId}/refund")
    public ResponseEntity<?> refundOrder(@PathVariable UUID orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus("REFUNDED");
                    orderRepository.save(order);
                    return ResponseEntity.ok("Order refunded");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{orderId}/return")
    public ResponseEntity<?> returnOrder(@PathVariable UUID orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus("RETURNED");
                    orderRepository.save(order);
                    return ResponseEntity.ok("Order returned");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{orderId}/replacement")
    public ResponseEntity<?> replacementOrder(@PathVariable UUID orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus("REPLACEMENT");
                    orderRepository.save(order);
                    return ResponseEntity.ok("Order replacement created");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{orderId}/invoice")
    public ResponseEntity<?> getInvoice(@PathVariable UUID orderId) {
        return orderRepository.findById(orderId)
                .map(order -> ResponseEntity.ok("Invoice for order " + order.getId()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{orderId}/payment-status")
    public ResponseEntity<?> getPaymentStatus(@PathVariable UUID orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    // Assume payment status tied to order status for demo
                    String paymentStatus = "PAID".equalsIgnoreCase(order.getStatus()) ? "PAID" : "PENDING";
                    return ResponseEntity.ok(paymentStatus);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private OrderDto toDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .orderNumber(order.getOrderNumber())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .driverId(order.getDriverId())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}