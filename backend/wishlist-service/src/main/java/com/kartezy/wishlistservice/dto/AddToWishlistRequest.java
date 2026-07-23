package com.kartezy.wishlistservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class AddToWishlistRequest {
    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Product ID is required")
    private UUID productId;

    @NotNull(message = "Merchant ID is required")
    private UUID merchantId;

    @NotBlank(message = "Product name is required")
    private String productName;

    private String productImage;
    private BigDecimal price;
    private String notes;
}
