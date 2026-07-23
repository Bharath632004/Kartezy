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
public class CartItemDto {
    private String id;
    private String productId;
    private String productName;
    private String productImage;
    private double unitPrice;
    private int quantity;
    private double totalPrice;
    private Map<String, String> variants;
    private boolean savedForLater;
}
