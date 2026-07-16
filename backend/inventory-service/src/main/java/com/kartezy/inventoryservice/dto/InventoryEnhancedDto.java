package com.kartezy.inventoryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryEnhancedDto {
    private Long id;
    private String sku;
    private String productName;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private String location;
    private Boolean lowStockAlertEnabled;
    private Integer lowStockThreshold;
    private UUID warehouseId;
    private String warehouseName;
    private String batchNumber;
    private LocalDateTime expiryDate;
    private String supplierName;
    private Double costPrice;
    private String unit;
    private Integer reorderPoint;
    private Integer maxStockLevel;
}
