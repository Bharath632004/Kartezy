package com.kartezy.inventoryservice.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @NotBlank @Size(max = 100)
    private String sku;
    @NotBlank @Size(max = 200)
    private String productName;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    @Size(max = 200)
    private String location;
    private Boolean lowStockAlertEnabled;
    private Integer lowStockThreshold;
}