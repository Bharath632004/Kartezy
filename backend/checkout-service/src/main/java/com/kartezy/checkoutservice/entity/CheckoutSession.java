package com.kartezy.checkoutservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "checkout_sessions", indexes = {
    @Index(name = "idx_checkout_session_user_id", columnList = "userId"),
    @Index(name = "idx_checkout_session_status", columnList = "status"),
    @Index(name = "idx_checkout_session_cart_id", columnList = "cartId"),
    @Index(name = "idx_checkout_session_order_id", columnList = "orderId")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private UUID cartId;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "INITIATED";

    @Column(length = 100)
    private String sessionToken;

    private UUID orderId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, length = 50)
    private String paymentMethod;

    @Column(length = 255)
    private String deliveryAddress;

    @Column(length = 100)
    private String deliveryCity;

    @Column(length = 100)
    private String deliveryState;

    @Column(length = 20)
    private String deliveryPincode;

    @Column(length = 100)
    private String deliveryLatitude;

    @Column(length = 100)
    private String deliveryLongitude;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime completedAt;

    private LocalDateTime failedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "INITIATED";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
