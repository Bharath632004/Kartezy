package com.kartezy.fraudservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudCheckResponse {
    private UUID orderId;
    private double riskScore;
    private boolean isFraudulent;
    private String reasons;
    private String recommendedAction;
}
