package com.kartezy.subscriptionservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class SubscriptionDto {
    private UUID id;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID merchantId;

    @NotBlank @Size(max = 200)
    private String planName;

    @NotBlank @Size(max = 50)
    private String planType;

    @NotBlank @Size(max = 50)
    private String billingCycle;

    @NotNull @Positive
    private BigDecimal amount;

    @Size(max = 10)
    private String currency;

    @NotBlank
    private String status;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private LocalDateTime nextBillingDate;

    private boolean autoRenew;

    private String paymentReference;

    private LocalDateTime createdAt;
}
