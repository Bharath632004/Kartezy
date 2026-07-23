package com.kartezy.reviewservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private UUID id;
    private UUID productId;
    private UUID userId;
    private UUID orderId;
    private int rating;
    private String title;
    private String comment;
    private String imageUrls;
    private String status;
    private boolean verified;
    private int helpfulCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
