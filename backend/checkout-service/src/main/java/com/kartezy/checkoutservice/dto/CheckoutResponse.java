package com.kartezy.checkoutservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {

    private UUID sessionId;
    private UUID cartId;
    private UUID orderId;
    private String sessionToken;
    private String status;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal deliveryFee;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String couponCode;
    private BigDecimal couponDiscount;
    private String paymentMethod;
    private String deliveryAddress;
    private List<CheckoutItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String message;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckoutItemResponse {
        private UUID id;
        private UUID productId;
        private UUID merchantId;
        private String productName;
        private String productImage;
        private String sku;
        private String variantName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private BigDecimal discountAmount;
        private BigDecimal netPrice;
    }
}
