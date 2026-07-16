package com.kartezy.deliveryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPartnerDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String status;
    private boolean isOnline;
    private boolean isVerified;
    private String vehicleType;
    private String vehicleNumber;
    private String vehicleModel;
    private String vehicleColor;
    private Double currentLatitude;
    private Double currentLongitude;
    private String city;
    private String state;
    private String pincode;
    private String profilePhotoUrl;
    private String kycStatus;
    private Double rating;
    private Long totalDeliveries;
    private Long totalRatings;
    private Double totalEarnings;
    private Double todayEarnings;
    private Double walletBalance;
    private Boolean isAvailable;
    private Double maxDeliveryRadius;
    private LocalDateTime createdAt;
    private LocalDateTime lastOnlineAt;
}
