package com.kartezy.ops.controller;

import com.kartezy.ops.entity.DeliveryOperation;
import com.kartezy.ops.service.DeliveryOpsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryOpsService deliveryOpsService;

    @GetMapping
    public ResponseEntity<List<DeliveryOperation>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryOpsService.getAllDeliveries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryOperation> getDeliveryById(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryOpsService.getDeliveryById(id));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<DeliveryOperation> getByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(deliveryOpsService.getDeliveryByOrderId(orderId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DeliveryOperation>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(deliveryOpsService.getDeliveriesByStatus(status));
    }

    @GetMapping("/partner/{partnerId}")
    public ResponseEntity<List<DeliveryOperation>> getByPartner(@PathVariable Long partnerId) {
        return ResponseEntity.ok(deliveryOpsService.getDeliveriesByPartner(partnerId));
    }

    @PostMapping
    public ResponseEntity<DeliveryOperation> createDelivery(@RequestBody DeliveryOperation delivery) {
        return ResponseEntity.ok(deliveryOpsService.createDelivery(delivery));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<DeliveryOperation> assignPartner(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(deliveryOpsService.assignPartner(id,
            Long.valueOf(body.get("partnerId").toString()),
            (String) body.get("partnerName")));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DeliveryOperation> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(deliveryOpsService.updateStatus(id, body.get("status")));
    }

    @GetMapping("/stats/by-status")
    public ResponseEntity<List<Object[]>> getStatsByStatus() {
        return ResponseEntity.ok(deliveryOpsService.getDeliveryCountByStatus());
    }
}
