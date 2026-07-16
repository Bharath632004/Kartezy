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
public class StockAuditDto {
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
