package com.kartezy.financeservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementDto {
    private UUID id;

    @NotBlank @Size(max = 50)
    private String settlementNumber;

    @NotNull
    private UUID merchantId;

    @NotNull
    private BigDecimal totalAmount;

    @NotNull
    private BigDecimal commissionAmount;

    @NotNull
    private BigDecimal netAmount;

    private BigDecimal adjustmentAmount;

    @NotBlank
    private String status;

    @Size(max = 50)
    private String settlementPeriod;

    @Size(max = 50)
    private String bankAccountNumber;

    @Size(max = 20)
    private String bankIfscCode;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime settledAt;
}
