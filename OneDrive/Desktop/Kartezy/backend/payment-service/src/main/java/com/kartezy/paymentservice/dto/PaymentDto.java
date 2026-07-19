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
public class PaymentDto {
    private UUID id;
    private UUID orderId;
    private UUID userId;
    private UUID merchantId;
    private String transactionId;
    private BigDecimal amount;
    private BigDecimal platformFee;
    private BigDecimal gatewayFee;
    private BigDecimal tax;
    private BigDecimal netAmount;
    private String paymentMethod;
    private String status;
    private String currency;
    private String gatewayReference;
    private String failureReason;
    private String bankReference;
    private String upiTransactionId;
    private String cardLastFour;
    private String cardBrand;
    private boolean refunded;
    private BigDecimal refundedAmount;
    private boolean splitPayment;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
