package com.kartezy.checkoutservice.dto;

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
public class CheckoutSummaryDto {

    private UUID sessionId;
    private String status;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal deliveryFee;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String couponCode;
    private BigDecimal couponDiscount;
    private String paymentMethod;
    private int itemCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
