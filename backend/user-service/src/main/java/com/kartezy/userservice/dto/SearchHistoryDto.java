package com.kartezy.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Object for SearchHistory entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchHistoryDto {

    private UUID id;

    @NotNull
    private UUID customerProfileId;

    @NotBlank
    @Size(max = 255)
    private String query;

    private LocalDateTime searchTime;

    private Integer resultsCount;

    private String clickedResultId; // ID of the clicked result (product, store, etc.)

    @Size(max = 50)
    private String clickedResultType; // e.g., PRODUCT, STORE, CATEGORY
}
