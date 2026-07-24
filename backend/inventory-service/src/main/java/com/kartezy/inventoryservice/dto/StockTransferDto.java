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
public class StockTransferDto {
    private UUID id;
    private UUID fromWarehouseId;
    private UUID toWarehouseId;
    private UUID productId;
    @NotBlank @Size(max = 100)
    private String sku;
    private Integer quantity;
    private String reason;
    private String status;
    private String initiatedBy;
    private String approvedBy;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
