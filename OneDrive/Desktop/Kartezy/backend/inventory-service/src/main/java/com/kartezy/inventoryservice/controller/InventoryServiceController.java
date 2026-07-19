package com.kartezy.inventoryservice.controller;

import com.kartezy.inventoryservice.dto.*;
import com.kartezy.inventoryservice.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@PreAuthorize("isAuthenticated()")
@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryServiceController {
    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryEnhancedDto>> getAllItems() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryEnhancedDto> getItem(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getItem(id));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<InventoryEnhancedDto> updateStock(@PathVariable Long id, @RequestBody java.util.Map<String, Object> body) {
        Integer quantity = (Integer) body.get("quantity");
        if (quantity == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(inventoryService.updateStock(id, quantity));
    }

    @PutMapping("/{id}/reserve")
    public ResponseEntity<InventoryEnhancedDto> reserveStock(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> body) {
        return ResponseEntity.ok(inventoryService.reserveStock(id, body.get("quantity")));
    }

    @PutMapping("/{id}/release")
    public ResponseEntity<InventoryEnhancedDto> releaseStock(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> body) {
        return ResponseEntity.ok(inventoryService.releaseStock(id, body.get("quantity")));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<InventoryAlertDto>> getAlerts(@RequestParam(required = false) String type) {
        return ResponseEntity.ok(inventoryService.getAlerts(type));
    }

    @PostMapping("/warehouses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WarehouseDto> createWarehouse(@RequestBody WarehouseDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createWarehouse(dto));
    }

    @GetMapping("/warehouses")
    public ResponseEntity<List<WarehouseDto>> getWarehouses() {
        return ResponseEntity.ok(inventoryService.getWarehouses());
    }

    @PostMapping("/transfers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StockTransferDto> createTransfer(@RequestBody StockTransferDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createTransfer(dto));
    }

    @GetMapping("/transfers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StockTransferDto>> getTransfers() {
        return ResponseEntity.ok(inventoryService.getTransfers());
    }

    @PutMapping("/transfers/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StockTransferDto> approveTransfer(@PathVariable UUID id, @RequestParam String approvedBy) {
        return ResponseEntity.ok(inventoryService.approveTransfer(id, approvedBy));
    }

    @PutMapping("/transfers/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StockTransferDto> completeTransfer(@PathVariable UUID id) {
        return ResponseEntity.ok(inventoryService.completeTransfer(id));
    }

    @PostMapping("/audits")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StockAuditDto> createAudit(@RequestBody StockAuditDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createAudit(dto));
    }

    @GetMapping("/audits")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StockAuditDto>> getAudits() {
        return ResponseEntity.ok(inventoryService.getAudits());
    }
}
