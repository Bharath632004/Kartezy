package com.kartezy.financeservice.dto;

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
    private String settlementNumber;
    private UUID merchantId;
    private BigDecimal totalAmount;
    private BigDecimal commissionAmount;
    private BigDecimal netAmount;
    private BigDecimal adjustmentAmount;
    private String status;
    private String settlementPeriod;
    private String bankAccountNumber;
    private String bankIfscCode;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime settledAt;
}
