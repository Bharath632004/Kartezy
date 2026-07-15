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
public class RefundRequestDto {
    @NotNull(message = "Payment ID is required")
    private UUID paymentId;

    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Reason is required")
    private String reason;

    private String reasonDetail;

    @NotNull(message = "Initiated by is required")
    private String initiatedBy;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class SettlementRequestDto {
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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class PaymentOverviewDto {
    private long totalPayments;
    private long successfulPayments;
    private long failedPayments;
    private long refundedPayments;
    private long pendingRefunds;
    private long pendingSettlements;
    private long upiPayments;
    private long codPayments;
    private long cardPayments;
    private long walletPayments;
}
