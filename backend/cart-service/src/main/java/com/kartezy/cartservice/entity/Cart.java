package com.kartezy.cartservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "carts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    private String id = java.util.UUID.randomUUID().toString();
    private String userId;
    private String couponCode;
    private double discountAmount;
    private double tipAmount;
    private double walletAmount;
    // OneToMany relationship with CartItem
    // We'll define it in the CartItem class for bidirectional
}