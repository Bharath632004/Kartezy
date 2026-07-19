package com.kartezy.ops.controller;

import com.kartezy.ops.entity.Warehouse;
import com.kartezy.ops.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<List<Warehouse>> getAllWarehouses() {
        return ResponseEntity.ok(warehouseService.getAllWarehouses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Warehouse> getWarehouseById(@PathVariable Long id) {
        return ResponseEntity.ok(warehouseService.getWarehouseById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Warehouse> getWarehouseByCode(@PathVariable String code) {
        return ResponseEntity.ok(warehouseService.getWarehouseByCode(code));
    }

    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<Warehouse>> getWarehousesByCity(@PathVariable Long cityId) {
        return ResponseEntity.ok(warehouseService.getWarehousesByCity(cityId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Warehouse>> getActiveWarehouses() {
        return ResponseEntity.ok(warehouseService.getActiveWarehouses());
    }

    @PostMapping
    public ResponseEntity<Warehouse> createWarehouse(@RequestBody Warehouse warehouse) {
        return ResponseEntity.ok(warehouseService.createWarehouse(warehouse));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Warehouse> updateWarehouse(@PathVariable Long id, @RequestBody Warehouse warehouse) {
        return ResponseEntity.ok(warehouseService.updateWarehouse(id, warehouse));
    }

    @PatchMapping("/{id}/utilization")
    public ResponseEntity<Void> updateUtilization(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        warehouseService.updateWarehouseUtilization(id, body.get("usedSqFt"), body.get("occupiedBays"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats/by-status")
    public ResponseEntity<List<Object[]>> getWarehouseStatsByStatus() {
        return ResponseEntity.ok(warehouseService.getWarehouseCountByStatus());
    }

    @GetMapping("/stats/by-city")
    public ResponseEntity<List<Object[]>> getWarehouseStatsByCity() {
        return ResponseEntity.ok(warehouseService.getWarehouseCountByCity());
    }
}
