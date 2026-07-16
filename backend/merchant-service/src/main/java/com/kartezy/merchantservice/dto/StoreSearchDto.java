package com.kartezy.merchantservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * Data Transfer Object for Store search results.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Store search result DTO")
public class StoreSearchDto {
    @Schema(description = "Store ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;
    @Schema(description = "Merchant ID", example = "123e4567-e89b-12d3-a456-426614174001")
    private UUID merchantId;
    @Schema(description = "Store name", example = "Corner Store")
    private String name;
    @Schema(description = "Store description")
    private String description;
    @Schema(description = "Store category", example = "Groceries")
    private String category;
    @Schema(description = "URL of store logo")
    private String logoUrl;
    @Schema(description = "URL of store banner")
    private String bannerUrl;
    @Schema(description = "City where store is located", example = "New York")
    private String city;
    @Schema(description = "State where store is located", example = "NY")
    private String state;
    @Schema(description = "Latitude coordinate", example = "40.7128")
    private Double latitude;
    @Schema(description = "Longitude coordinate", example = "-74.0060")
    private Double longitude;
    @Schema(description = "Distance from search point in kilometers", example = "5.2")
    private Double distance;
    @Schema(description = "Store status", example = "ACTIVE")
    private String status;
    @Schema(description = "Whether store is currently open")
    private Boolean isOpen;
    @Schema(description = "Average rating", example = "4.5")
    private Double rating;
    @Schema(description = "Total number of ratings")
    private Long totalRatings;
    @Schema(description = "Whether the current user is following this store")
    private boolean isFollowing;
}