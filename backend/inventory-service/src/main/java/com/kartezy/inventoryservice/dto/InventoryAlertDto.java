package com.kartezy.inventoryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryAlertDto {
    private String sku;
    private String productName;
    private Integer currentStock;
    private Integer threshold;
    private String alertType;
    private String severity;
}
