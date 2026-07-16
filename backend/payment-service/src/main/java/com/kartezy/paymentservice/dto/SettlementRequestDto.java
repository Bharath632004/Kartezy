package com.kartezy.paymentservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
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
public class SettlementRequestDto {
    @NotNull private UUID merchantId;
    @NotNull private UUID orderId;
    @NotNull @DecimalMin("0.01") private BigDecimal orderAmount;
    @NotNull @DecimalMin("0") private BigDecimal commissionAmount;
    @NotNull @DecimalMin("0") private BigDecimal platformFee;
    @NotNull @DecimalMin("0") private BigDecimal taxAmount;
    private String cycle;
    @NotNull private LocalDateTime cycleStartDate;
    @NotNull private LocalDateTime cycleEndDate;
    private String bankAccountNumber;
    private String bankIfscCode;
    private String bankName;
    private String notes;
}
