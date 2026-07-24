package com.kartezy.inventoryservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class StockAuditDto {
    private UUID id;
    @NotBlank @Size(max = 100)
    private String sku;
    @NotBlank @Size(max = 200)
    private String productName;
    private Integer systemQuantity;
    private Integer physicalQuantity;
    private Integer variance;
    private String notes;
    private String status;
    private String auditedBy;
    private LocalDateTime auditDate;
}
