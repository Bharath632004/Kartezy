package com.kartezy.checkoutservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    private String deliveryCity;
    private String deliveryState;
    private String deliveryPincode;
    private String deliveryLatitude;
    private String deliveryLongitude;
    private String couponCode;
    private String notes;

    @NotNull(message = "Items are required")
    private List<CheckoutItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckoutItemRequest {
        @NotNull(message = "Product ID is required")
        private UUID productId;

        @NotNull(message = "Merchant ID is required")
        private UUID merchantId;

        @NotBlank(message = "Product name is required")
        private String productName;

        private String productImage;
        private String sku;
        private String variantName;

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be positive")
        private Integer quantity;

        @NotNull(message = "Unit price is required")
        @Positive(message = "Unit price must be positive")
        private BigDecimal unitPrice;

        private BigDecimal discountAmount;
        private String discountDescription;
    }
}
