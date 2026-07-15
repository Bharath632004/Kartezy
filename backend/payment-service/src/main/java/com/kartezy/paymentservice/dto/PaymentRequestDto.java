package com.kartezy.paymentservice.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    @NotNull(message = "Order ID is required")
    private UUID orderId;

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Merchant ID is required")
    private UUID merchantId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Payment method is required")
    private String paymentMethod;

    private BigDecimal platformFee;
    private BigDecimal gatewayFee;
    private BigDecimal tax;

    @Size(max = 100)
    private String idempotencyKey;

    @Size(max = 50)
    private String ipAddress;

    @Size(max = 500)
    private String userAgent;

    // UPI specific
    @Size(max = 100)
    private String upiId;

    // Card specific
    @Size(max = 20)
    private String cardNumber;

    @Size(max = 10)
    private String cardExpiryMonth;

    @Size(max = 10)
    private String cardExpiryYear;

    @Size(max = 10)
    private String cardCvv;

    @Size(max = 100)
    private String cardHolderName;

    // Split payment
    private boolean splitPayment;
}
