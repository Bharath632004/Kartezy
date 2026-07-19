package com.kartezy.merchantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreBusinessHoursDto {
    private UUID id;
    private UUID storeId;
    private String dayOfWeek;
    private LocalTime openTime;
    private LocalTime closeTime;
    private Boolean isOpen;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class StoreFollowDto {
    private UUID storeId;
    private UUID userId;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class StoreSearchDto {
    private UUID id;
    private UUID merchantId;
    private String name;
    private String description;
    private String category;
    private String logoUrl;
    private String bannerUrl;
    private String city;
    private String state;
    private Double latitude;
    private Double longitude;
    private Double distance;
    private String status;
    private Boolean isOpen;
    private Double rating;
    private Long totalRatings;
    private boolean isFollowing;
}
