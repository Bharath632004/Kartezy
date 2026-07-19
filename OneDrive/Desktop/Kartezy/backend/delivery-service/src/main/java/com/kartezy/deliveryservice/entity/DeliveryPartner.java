package com.kartezy.deliveryservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "delivery_partners", indexes = {
    @Index(name = "idx_dp_status", columnList = "status"),
    @Index(name = "idx_dp_city", columnList = "city"),
    @Index(name = "idx_dp_phone", columnList = "phoneNumber", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPartner {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 15, unique = true)
    private String phoneNumber;

    @Column(length = 255)
    private String email;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private PartnerStatus status;

    @Column(nullable = false)
    private boolean isOnline;

    @Column(nullable = false)
    private boolean isVerified;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @Column(length = 50)
    private String vehicleNumber;

    @Column(length = 100)
    private String vehicleModel;

    @Column(length = 100)
    private String vehicleColor;

    @Column(nullable = false)
    private Double currentLatitude;

    @Column(nullable = false)
    private Double currentLongitude;

    @Column(nullable = false, length = 50)
    private String city;

    @Column(nullable = false, length = 50)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(length = 255)
    private String profilePhotoUrl;

    @Column(length = 255)
    private String aadharNumber;

    @Column(length = 255)
    private String drivingLicenseNumber;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private KycStatus kycStatus;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private Long totalDeliveries;

    @Column(nullable = false)
    private Long totalRatings;

    @Column(nullable = false)
    private Double totalEarnings;

    @Column(nullable = false)
    private Double todayEarnings;

    @Column(nullable = false)
    private Double walletBalance;

    @Column(nullable = false)
    private Boolean isAvailable;

    @Column(nullable = false)
    private Double maxDeliveryRadius;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastOnlineAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = PartnerStatus.PENDING;
        if (kycStatus == null) kycStatus = KycStatus.PENDING;
        if (rating == null) rating = 0.0;
        if (totalDeliveries == null) totalDeliveries = 0L;
        if (totalRatings == null) totalRatings = 0L;
        if (totalEarnings == null) totalEarnings = 0.0;
        if (todayEarnings == null) todayEarnings = 0.0;
        if (walletBalance == null) walletBalance = 0.0;
        if (isAvailable == null) isAvailable = true;
        if (maxDeliveryRadius == null) maxDeliveryRadius = 10.0;
        if (currentLatitude == null) currentLatitude = 0.0;
        if (currentLongitude == null) currentLongitude = 0.0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PartnerStatus { PENDING, APPROVED, REJECTED, SUSPENDED, INACTIVE }
    public enum VehicleType { BICYCLE, MOTORCYCLE, SCOOTER, CAR, VAN, TRUCK }
    public enum KycStatus { PENDING, SUBMITTED, VERIFIED, REJECTED }
}
