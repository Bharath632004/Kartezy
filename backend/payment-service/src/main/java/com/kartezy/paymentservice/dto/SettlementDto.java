package com.kartezy.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementDto {
    private UUID id;
    private UUID merchantId;
    private UUID orderId;
    private String settlementReference;
    private BigDecimal orderAmount;
    private BigDecimal commissionAmount;
    private BigDecimal platformFee;
    private BigDecimal taxAmount;
    private BigDecimal settlementAmount;
    private String status;
    private String cycle;
    private LocalDateTime cycleStartDate;
    private LocalDateTime cycleEndDate;
    private String bankAccountNumber;
    private String bankIfscCode;
    private String bankName;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
    private LocalDateTime completedAt;
}
