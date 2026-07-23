package com.kartezy.fraudservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudCheckRequest {
    private UUID orderId;
    private UUID userId;
    private UUID paymentId;
    private BigDecimal orderAmount;
    private boolean newUser;
    private String ipAddress;
    private String userAgent;
    private String paymentMethod;
}
