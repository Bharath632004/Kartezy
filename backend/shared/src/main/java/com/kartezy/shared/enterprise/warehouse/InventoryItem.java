package com.kartezy.shared.enterprise.warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

/**
 * Inventory item for warehouse stock management.
 * Tracks real-time stock levels, reservations, and movement.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    private String inventoryId;
    private String warehouseId;
    private String productId;
    private String sku;
    private String barcode;
    private String batchNumber;

    // Quantities
    private int quantity;
    private int reservedQuantity;
    private int availableQuantity;
    private int damagedQuantity;
    private int returnedQuantity;
    private int lowStockThreshold;
    private int reorderPoint;
    private int reorderQuantity;

    // Location within warehouse
    private String zone;
    private String aisle;
    private String shelf;
    private String bin;

    // Pricing
    private BigDecimal unitCost;
    private BigDecimal sellingPrice;
    private BigDecimal mrp;

    // Dates
    private ZonedDateTime manufacturedDate;
    private ZonedDateTime expiryDate;
    private ZonedDateTime receivedDate;
    private ZonedDateTime lastCountedDate;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    // Status
    private StockStatus status;
    private boolean isActive;

    public enum StockStatus {
        IN_STOCK, LOW_STOCK, OUT_OF_STOCK, DISCONTINUED, DAMAGED, QUARANTINED
    }

    public int getAvailableQuantity() {
        return quantity - reservedQuantity;
    }

    public boolean isLowStock() {
        return quantity <= lowStockThreshold;
    }

    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(ZonedDateTime.now());
    }

    public boolean isOutOfStock() {
        return getAvailableQuantity() <= 0;
    }
}
