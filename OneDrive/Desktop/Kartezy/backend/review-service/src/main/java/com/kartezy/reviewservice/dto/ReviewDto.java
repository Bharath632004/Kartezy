package com.kartezy.reviewservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private UUID id;
    private UUID userId;
    private String targetType;
    private UUID targetId;
    private Integer rating;
    private String title;
    private String comment;
    private String merchantResponse;
    private LocalDateTime merchantRespondedAt;
    private String status;
    private boolean verifiedPurchase;
    private boolean isHelpful;
    private Long helpfulCount;
    private Long unhelpfulCount;
    private Set<String> imageUrls;
    private String videoUrl;
    private String orderId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class ReviewRequestDto {
    private UUID userId;
    private String targetType;
    private UUID targetId;
    private Integer rating;
    private String title;
    private String comment;
    private Set<String> imageUrls;
    private String videoUrl;
    private String orderId;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class RatingSummaryDto {
    private UUID id;
    private String targetType;
    private UUID targetId;
    private Double averageRating;
    private Long totalReviews;
    private Long fiveStarCount;
    private Long fourStarCount;
    private Long threeStarCount;
    private Long twoStarCount;
    private Long oneStarCount;
    private LocalDateTime lastUpdated;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class MerchantResponseDto {
    private String merchantResponse;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class ReviewModerationDto {
    private String status;
    private String adminNote;
    private String moderatedBy;
}
