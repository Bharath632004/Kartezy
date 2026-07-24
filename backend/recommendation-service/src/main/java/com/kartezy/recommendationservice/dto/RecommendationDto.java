package com.kartezy.recommendationservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDto {
    private UUID id;

    @NotNull
    private UUID productId;

    @NotBlank @Size(max = 200)
    private String productName;

    @Size(max = 500)
    private String productImage;

    private BigDecimal price;

    private BigDecimal rating;

    @NotBlank
    private String category;

    private double score;

    private String reason;
}
