package com.kartezy.inventoryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Data Transfer Object for Inventory Item
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDto {
    private Long id;
    private String sku;
    private String productName;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private String location;
    private Boolean lowStockAlertEnabled;
    private Integer lowStockThreshold;
}