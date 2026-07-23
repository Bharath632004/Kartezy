package com.kartezy.subscriptionservice.dto;

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
public class SubscriptionDto {
    private UUID id;
    private UUID userId;
    private UUID merchantId;
    private String planName;
    private String planType;
    private String billingCycle;
    private BigDecimal amount;
    private String currency;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime nextBillingDate;
    private boolean autoRenew;
    private String paymentReference;
    private LocalDateTime createdAt;
}
