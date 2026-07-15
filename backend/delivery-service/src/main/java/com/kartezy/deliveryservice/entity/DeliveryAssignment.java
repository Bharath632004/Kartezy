package com.kartezy.deliveryservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "delivery_assignments", indexes = {
    @Index(name = "idx_da_order_id", columnList = "orderId"),
    @Index(name = "idx_da_partner_id", columnList = "partnerId"),
    @Index(name = "idx_da_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID orderId;

    @Column(nullable = false)
    private UUID partnerId;

    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private DeliveryType deliveryType;

    @Column(length = 255)
    private String pickupAddress;

    @Column(nullable = false)
    private Double pickupLatitude;

    @Column(nullable = false)
    private Double pickupLongitude;

    @Column(length = 255)
    private String deliveryAddress;

    @Column(nullable = false)
    private Double deliveryLatitude;

    @Column(nullable = false)
    private Double deliveryLongitude;

    @Column(nullable = false)
    private Double estimatedDistance;

    @Column(nullable = false)
    private Integer estimatedDuration;

    @Column(nullable = false)
    private Double actualDistance;

    private LocalDateTime acceptedAt;

    private LocalDateTime pickedUpAt;

    private LocalDateTime deliveredAt;

    @Column(length = 10)
    private String deliveryOtp;

    @Column(length = 255)
    private String proofPhotoUrl;

    @Column(length = 255)
    private String customerSignatureUrl;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = AssignmentStatus.PENDING;
        if (deliveryType == null) deliveryType = DeliveryType.INSTANT;
        if (estimatedDistance == null) estimatedDistance = 0.0;
        if (estimatedDuration == null) estimatedDuration = 0;
        if (actualDistance == null) actualDistance = 0.0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AssignmentStatus {
        PENDING, ACCEPTED, ARRIVED_AT_STORE, PICKED_UP, IN_TRANSIT,
        ARRIVED, DELIVERED, FAILED, CANCELLED
    }

    public enum DeliveryType {
        INSTANT, SCHEDULED, EXPRESS, BATCH
    }
}
