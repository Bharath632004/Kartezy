package com.kartezy.cartservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {
    private String id;
    private String userId;
    private String couponCode;
    private double discountAmount;
    private double subtotal;
    // Backward compatibility with mobile app Cart model expects 'totalAmount' = subtotal
    private double totalAmount;
    private int itemCount;
    private double deliveryCharges;
    private double platformFee;
    private double packagingFee;
    private double gstAmount;
    private double tipAmount;
    private double walletAmount;
    private double netAmount;
    private List<CartItemDto> items;
    private List<CartItemDto> savedForLaterItems;
}
