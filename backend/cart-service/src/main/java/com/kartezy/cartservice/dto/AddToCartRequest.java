package com.kartezy.cartservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {
    private String userId;
    private String productId;
    private int quantity;
    private String productName;
    private String productImage;
    private double unitPrice;
    private Map<String, String> variants;
}
