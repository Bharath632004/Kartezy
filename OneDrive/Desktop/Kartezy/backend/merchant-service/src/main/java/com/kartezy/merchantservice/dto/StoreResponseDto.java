package com.kartezy.merchantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreResponseDto {
    private UUID id;
    private UUID merchantId;
    private String merchantName;
    private String name;
    private String description;
    private String category;
    private String logoUrl;
    private String bannerUrl;
    private String tagline;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private String phoneNumber;
    private String email;
    private String website;
    private String status;
    private Boolean isOpen;
    private Boolean isVerified;
    private Double deliveryRadius;
    private Double minimumOrderAmount;
    private Double deliveryCharge;
    private Double freeDeliveryThreshold;
    private String cancellationPolicy;
    private String returnPolicy;
    private String termsAndConditions;
    private Double rating;
    private Long totalRatings;
    private Long totalFollowers;
    private Boolean isFeatured;
    private boolean isFollowing;
    private List<StoreBusinessHoursDto> businessHours;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class StoreCreateRequestDto {
    private UUID merchantId;
    private String name;
    private String description;
    private String category;
    private String logoUrl;
    private String bannerUrl;
    private String tagline;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private String phoneNumber;
    private String email;
    private String website;
    private Double deliveryRadius;
    private Double minimumOrderAmount;
    private Double deliveryCharge;
    private Double freeDeliveryThreshold;
    private String cancellationPolicy;
    private String returnPolicy;
    private String termsAndConditions;
    private List<StoreBusinessHoursDto> businessHours;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class MerchantProfileResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String status;
    private Boolean isVerified;
    private StoreResponseDto store;
    private Double totalRevenue;
    private Double totalOrders;
    private Double averageRating;
    private Long totalProducts;
}
