package com.kartezy.shared.enterprise.warehouse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Warehouse Management System (WMS) service.
 * Handles multi-warehouse inventory, stock transfers, and fulfillment.
 */
@Slf4j
@Service
public class WarehouseService {

    private final Map<String, Warehouse> warehouses = new ConcurrentHashMap<>();
    private final Map<String, InventoryItem> inventory = new ConcurrentHashMap<>();
    private final Map<String, StockTransfer> transfers = new ConcurrentHashMap<>();

    /**
     * Register a new warehouse.
     */
    public Warehouse registerWarehouse(Warehouse warehouse) {
        warehouse.setActive(true);
        warehouse.setCreatedAt(java.time.ZonedDateTime.now());
        warehouses.put(warehouse.getWarehouseId(), warehouse);
        log.info("Warehouse registered: {} ({}) at {}, {}",
                warehouse.getName(), warehouse.getWarehouseId(),
                warehouse.getCity(), warehouse.getCountry());
        return warehouse;
    }

    /**
     * Check stock availability across all warehouses for a product.
     */
    public int getTotalStock(String productId) {
        return inventory.values().stream()
                .filter(i -> i.getProductId().equals(productId))
                .mapToInt(InventoryItem::getQuantity)
                .sum();
    }

    /**
     * Find the nearest warehouse with stock for a product.
     */
    public Optional<Warehouse> findNearestWarehouse(String productId, double latitude, double longitude) {
        return inventory.values().stream()
                .filter(i -> i.getProductId().equals(productId) && i.getQuantity() > 0)
                .map(i -> warehouses.get(i.getWarehouseId()))
                .filter(Objects::nonNull)
                .filter(Warehouse::isActive)
                .min(Comparator.comparingDouble(w ->
                        haversineDistance(latitude, longitude, w.getLatitude(), w.getLongitude())));
    }

    /**
     * Reserve stock for an order.
     */
    public boolean reserveStock(String warehouseId, String productId, int quantity) {
        String key = warehouseId + "_" + productId;
        InventoryItem item = inventory.get(key);
        if (item == null || item.getQuantity() < quantity) {
            log.warn("Insufficient stock: warehouse={}, product={}, required={}, available={}",
                    warehouseId, productId, quantity, item != null ? item.getQuantity() : 0);
            return false;
        }
        item.setQuantity(item.getQuantity() - quantity);
        item.setReservedQuantity(item.getReservedQuantity() + quantity);
        log.info("Stock reserved: warehouse={}, product={}, quantity={}", warehouseId, productId, quantity);
        return true;
    }

    /**
     * Initiate stock transfer between warehouses.
     */
    public StockTransfer transferStock(String fromWarehouse, String toWarehouse,
                                        String productId, int quantity, String reason) {
        // Check source availability
        String fromKey = fromWarehouse + "_" + productId;
        InventoryItem sourceItem = inventory.get(fromKey);
        if (sourceItem == null || sourceItem.getQuantity() < quantity) {
            throw new IllegalStateException("Insufficient stock for transfer");
        }

        // Deduct from source
        sourceItem.setQuantity(sourceItem.getQuantity() - quantity);

        // Add to destination
        String toKey = toWarehouse + "_" + productId;
        InventoryItem destItem = inventory.computeIfAbsent(toKey,
                k -> InventoryItem.builder()
                        .warehouseId(toWarehouse)
                        .productId(productId)
                        .quantity(0)
                        .build());
        destItem.setQuantity(destItem.getQuantity() + quantity);

        StockTransfer transfer = StockTransfer.builder()
                .transferId(UUID.randomUUID().toString())
                .fromWarehouse(fromWarehouse)
                .toWarehouse(toWarehouse)
                .productId(productId)
                .quantity(quantity)
                .status(StockTransfer.TransferStatus.COMPLETED)
                .reason(reason)
                .createdAt(java.time.ZonedDateTime.now())
                .build();

        transfers.put(transfer.getTransferId(), transfer);
        log.info("Stock transfer completed: {} units of {} from {} to {}",
                quantity, productId, fromWarehouse, toWarehouse);
        return transfer;
    }

    /**
     * Get all warehouses in a city.
     */
    public List<Warehouse> getWarehousesByCity(String city) {
        return warehouses.values().stream()
                .filter(w -> w.getCity().equalsIgnoreCase(city))
                .collect(Collectors.toList());
    }

    /**
     * Get warehouse utilization metrics.
     */
    public Map<String, Object> getWarehouseMetrics(String warehouseId) {
        Warehouse warehouse = warehouses.get(warehouseId);
        if (warehouse == null) return Collections.emptyMap();

        long totalItems = inventory.values().stream()
                .filter(i -> i.getWarehouseId().equals(warehouseId))
                .count();
        long lowStockItems = inventory.values().stream()
                .filter(i -> i.getWarehouseId().equals(warehouseId))
                .filter(i -> i.getQuantity() <= i.getLowStockThreshold())
                .count();

        return Map.of(
                "name", warehouse.getName(),
                "capacity", warehouse.getCapacity(),
                "utilization", warehouse.getCurrentUtilization(),
                "totalItems", totalItems,
                "lowStockItems", lowStockItems,
                "activeOrders", 0,
                "pendingTransfers", transfers.values().stream()
                        .filter(t -> t.getToWarehouse().equals(warehouseId) ||
                                t.getFromWarehouse().equals(warehouseId))
                        .filter(t -> t.getStatus() == StockTransfer.TransferStatus.IN_TRANSIT)
                        .count()
        );
    }

    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
