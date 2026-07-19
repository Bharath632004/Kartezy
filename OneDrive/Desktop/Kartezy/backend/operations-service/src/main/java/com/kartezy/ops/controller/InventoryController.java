package com.kartezy.ops.controller;

import com.kartezy.ops.entity.InventoryOperation;
import com.kartezy.ops.service.InventoryOpsService;
import com.kartezy.ops.repository.InventoryOperationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryOpsService inventoryOpsService;
    private final InventoryOperationRepository inventoryOperationRepository;

    @GetMapping
    public ResponseEntity<List<InventoryOperation>> getAllInventory() {
        return ResponseEntity.ok(inventoryOpsService.getAllInventory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryOperation> getInventoryById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryOpsService.getInventoryById(id));
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<InventoryOperation>> getByWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(inventoryOpsService.getInventoryByWarehouse(warehouseId));
    }

    @GetMapping("/health/{status}")
    public ResponseEntity<List<InventoryOperation>> getByHealth(@PathVariable String status) {
        return ResponseEntity.ok(inventoryOpsService.getInventoryByHealth(status));
    }

    @PostMapping
    public ResponseEntity<InventoryOperation> createInventory(@RequestBody InventoryOperation inv) {
        return ResponseEntity.ok(inventoryOpsService.createInventoryOperation(inv));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryOperation> updateInventory(@PathVariable Long id, @RequestBody InventoryOperation inv) {
        return ResponseEntity.ok(inventoryOpsService.updateInventoryOperation(id, inv));
    }

    @PostMapping("/{id}/audit")
    public ResponseEntity<InventoryOperation> performAudit(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(inventoryOpsService.performAudit(id, body.get("actualSkuCount")));
    }

    @GetMapping("/stats/health")
    public ResponseEntity<List<Object[]>> getHealthStats() {
        return ResponseEntity.ok(inventoryOperationRepository.countByHealthStatus());
    }

    @GetMapping("/stats/totals")
    public ResponseEntity<Map<String, Long>> getTotals() {
        return ResponseEntity.ok(Map.of(
            "outOfStock", inventoryOpsService.getTotalOutOfStock(),
            "lowStock", inventoryOpsService.getTotalLowStock()
        ));
    }
}
