package com.kartezy.merchantservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "stores", indexes = {
    @Index(name = "idx_store_merchant_id", columnList = "merchantId", unique = true),
    @Index(name = "idx_store_city", columnList = "city"),
    @Index(name = "idx_store_category", columnList = "category"),
    @Index(name = "idx_store_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID merchantId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(length = 100)
    private String category;

    @Column(length = 500)
    private String logoUrl;

    @Column(length = 500)
    private String bannerUrl;

    @Column(length = 100)
    private String tagline;

    @Column(nullable = false, length = 500)
    private String addressLine1;

    @Column(length = 500)
    private String addressLine2;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(length = 20)
    private String pincode;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false, length = 15)
    private String phoneNumber;

    @Column(length = 255)
    private String email;

    @Column(length = 255)
    private String website;

    @Column(length = 50)
    private String status;

    @Column(nullable = false)
    private Boolean isOpen;

    @Column(nullable = false)
    private Boolean isVerified;

    @Column(nullable = false)
    private Double deliveryRadius;

    @Column(nullable = false)
    private Double minimumOrderAmount;

    @Column(nullable = false)
    private Double deliveryCharge;

    @Column(nullable = false)
    private Double freeDeliveryThreshold;

    @Column(length = 500)
    private String cancellationPolicy;

    @Column(length = 500)
    private String returnPolicy;

    @Column(length = 500)
    private String termsAndConditions;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private Long totalRatings;

    @Column(nullable = false)
    private Long totalFollowers;

    @Column(nullable = false)
    private Boolean isFeatured;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isOpen = false; isVerified = false; isFeatured = false;
        rating = 0.0; totalRatings = 0L; totalFollowers = 0L;
        deliveryRadius = 5.0; minimumOrderAmount = 0.0;
        deliveryCharge = 0.0; freeDeliveryThreshold = 0.0;
        status = "INACTIVE";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
