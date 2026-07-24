package com.kartezy.inventoryservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @NotBlank @Size(max = 100)
    private String sku;
    @NotBlank @Size(max = 200)
    private String productName;
    private Integer currentStock;
    private Integer threshold;
    @NotBlank @Size(max = 50)
    private String alertType;
    @NotBlank
    private String severity;
}
