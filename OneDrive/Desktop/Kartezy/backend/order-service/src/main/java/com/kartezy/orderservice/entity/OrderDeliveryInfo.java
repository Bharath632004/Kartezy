package com.kartezy.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "order_delivery_info", indexes = {
    @Index(name = "idx_odi_order_id", columnList = "orderId", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDeliveryInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID orderId;

    @Column(length = 500)
    private String deliveryAddress;

    @Column(length = 100)
    private String deliveryCity;

    @Column(length = 100)
    private String deliveryState;

    @Column(length = 20)
    private String deliveryPincode;

    private Double deliveryLatitude;

    private Double deliveryLongitude;

    @Column(length = 20)
    private String deliveryType;

    private LocalDateTime scheduledTime;

    private LocalDateTime deliveredAt;

    @Column(length = 500)
    private String pickupAddress;

    private Double pickupLatitude;

    private Double pickupLongitude;

    @Column(length = 20)
    private String deliveryOtp;

    @Column(length = 255)
    private String deliveryNotes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
