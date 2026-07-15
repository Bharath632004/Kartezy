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
public class RefundDto {
    private UUID id;
    private UUID paymentId;
    private UUID orderId;
    private String refundReference;
    private BigDecimal amount;
    private String reason;
    private String reasonDetail;
    private String status;
    private String gatewayRefundId;
    private String failureReason;
    private String initiatedBy;
    private String approvedBy;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
