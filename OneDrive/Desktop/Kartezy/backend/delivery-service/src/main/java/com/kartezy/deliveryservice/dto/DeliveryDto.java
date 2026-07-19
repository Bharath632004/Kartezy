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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class DeliveryAssignmentDto {
    private UUID id;
    private UUID orderId;
    private UUID partnerId;
    private String status;
    private String deliveryType;
    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String deliveryAddress;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private Double estimatedDistance;
    private Integer estimatedDuration;
    private Double actualDistance;
    private LocalDateTime acceptedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private String deliveryOtp;
    private String proofPhotoUrl;
    private String customerSignatureUrl;
    private String notes;
    private LocalDateTime createdAt;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class DeliveryEarningDto {
    private UUID id;
    private UUID partnerId;
    private UUID assignmentId;
    private Double deliveryFee;
    private Double tip;
    private Double incentive;
    private Double totalAmount;
    private Double platformCommission;
    private Double netAmount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime settledAt;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class DeliveryPartnerRequestDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String vehicleType;
    private String vehicleNumber;
    private String vehicleModel;
    private String vehicleColor;
    private String city;
    private String state;
    private String pincode;
    private Double currentLatitude;
    private Double currentLongitude;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class DeliveryAssignmentRequestDto {
    private UUID orderId;
    private UUID partnerId;
    private String deliveryType;
    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String deliveryAddress;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private Double estimatedDistance;
    private Integer estimatedDuration;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class DeliveryLocationUpdateDto {
    private Double latitude;
    private Double longitude;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class DeliveryProofDto {
    private String proofPhotoUrl;
    private String customerSignatureUrl;
    private String notes;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class DeliveryPerformanceDto {
    private long totalDeliveries;
    private long completedDeliveries;
    private long cancelledDeliveries;
    private double averageRating;
    private double totalEarnings;
    private double averageDeliveryTime;
    private double acceptanceRate;
    private double completionRate;
}
