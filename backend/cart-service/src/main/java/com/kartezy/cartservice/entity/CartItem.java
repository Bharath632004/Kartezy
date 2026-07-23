package com.kartezy.cartservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    @Id
    private String id;

    @Column(nullable = false)
    private String cartId;

    @Column(nullable = false)
    private String productId;

    private String productName;

    private String productImage;

    private double unitPrice;

    private int quantity;

    private double totalPrice;

    @Column(columnDefinition = "TEXT")
    private String variants;

    @Column(nullable = false)
    private boolean savedForLater;
}
