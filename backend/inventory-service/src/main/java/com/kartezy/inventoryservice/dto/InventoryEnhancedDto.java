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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class WarehouseDto {
    private UUID id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Boolean isActive;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class StockTransferDto {
    private UUID id;
    private UUID fromWarehouseId;
    private UUID toWarehouseId;
    private UUID productId;
    private String sku;
    private Integer quantity;
    private String reason;
    private String status;
    private String initiatedBy;
    private String approvedBy;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class StockAuditDto {
    private UUID id;
    private String sku;
    private String productName;
    private Integer systemQuantity;
    private Integer physicalQuantity;
    private Integer variance;
    private String notes;
    private String status;
    private String auditedBy;
    private LocalDateTime auditDate;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class InventoryAlertDto {
    private String sku;
    private String productName;
    private Integer currentStock;
    private Integer threshold;
    private String alertType;
    private String severity;
}
