package com.kartezy.reviewservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDto {
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
