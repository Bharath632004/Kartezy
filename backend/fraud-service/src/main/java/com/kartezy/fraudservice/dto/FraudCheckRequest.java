package com.kartezy.fraudservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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
    @NotNull
    private UUID orderId;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID paymentId;

    @NotNull @Positive
    private BigDecimal orderAmount;

    private boolean newUser;

    @Size(max = 50)
    private String ipAddress;

    private String userAgent;

    @NotBlank @Size(max = 50)
    private String paymentMethod;
}
