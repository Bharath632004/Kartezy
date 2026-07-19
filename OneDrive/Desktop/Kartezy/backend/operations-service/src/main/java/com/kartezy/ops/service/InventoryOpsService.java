package com.kartezy.ops.service;

import com.kartezy.ops.entity.InventoryOperation;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.InventoryOperationRepository;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryOpsService {

    private final InventoryOperationRepository inventoryOperationRepository;

    public List<InventoryOperation> getAllInventory() {
        return inventoryOperationRepository.findAll();
    }

    public InventoryOperation getInventoryById(Long id) {
        return inventoryOperationRepository.findById(id)
            .orElseThrow(() -> new OpsException("Inventory operation not found: " + id, "INV_NOT_FOUND"));
    }

    public List<InventoryOperation> getInventoryByWarehouse(Long warehouseId) {
        return inventoryOperationRepository.findByWarehouseId(warehouseId);
    }

    public List<InventoryOperation> getInventoryByHealth(String healthStatus) {
        return inventoryOperationRepository.findByHealthStatus(healthStatus);
    }

    @Transactional
    public InventoryOperation createInventoryOperation(InventoryOperation inv) {
        inv.setHealthStatus(determineHealth(inv));
        return inventoryOperationRepository.save(inv);
    }

    @Transactional
    public InventoryOperation updateInventoryOperation(Long id, InventoryOperation updated) {
        InventoryOperation inv = getInventoryById(id);
        inv.setTotalSkuCount(updated.getTotalSkuCount());
        inv.setActiveSkuCount(updated.getActiveSkuCount());
        inv.setOutOfStockSkuCount(updated.getOutOfStockSkuCount());
        inv.setLowStockSkuCount(updated.getLowStockSkuCount());
        inv.setPendingRestocks(updated.getPendingRestocks());
        inv.setStockAccuracyPercent(updated.getStockAccuracyPercent());
        inv.setHealthStatus(determineHealth(inv));
        return inventoryOperationRepository.save(inv);
    }

    @Transactional
    public InventoryOperation performAudit(Long id, int actualSkuCount) {
        InventoryOperation inv = getInventoryById(id);
        int accuracy = inv.getTotalSkuCount() > 0
            ? (int) ((double) actualSkuCount / inv.getTotalSkuCount() * 100)
            : 100;
        inv.setStockAccuracyPercent(BigDecimal.valueOf(Math.min(accuracy, 100)));
        return inventoryOperationRepository.save(inv);
    }

    @Transactional
    public void updateStockLevels(Long id, int outOfStock, int lowStock) {
        InventoryOperation inv = getInventoryById(id);
        inv.setOutOfStockSkuCount(outOfStock);
        inv.setLowStockSkuCount(lowStock);
        inv.setHealthStatus(determineHealth(inv));
        inventoryOperationRepository.save(inv);
    }

    private String determineHealth(InventoryOperation inv) {
        if (inv.getOutOfStockSkuCount() > 20) return "CRITICAL";
        if (inv.getLowStockSkuCount() > 30) return "LOW_STOCK";
        if (inv.getOutOfStockSkuCount() > 5) return "WARNING";
        return "HEALTHY";
    }

    public long getTotalOutOfStock() {
        return inventoryOperationRepository.totalOutOfStock();
    }

    public long getTotalLowStock() {
        return inventoryOperationRepository.totalLowStock();
    }
}
