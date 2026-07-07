package com.kartezy.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

/**
 * Data Transfer Object for FavoriteStore entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteStoreDto {

    private UUID id;

    @NotNull
    private UUID customerProfileId;

    @NotBlank
    private String storeId; // Reference to catalog/service store

    @NotBlank
    @Size(max = 255)
    private String storeName;

    @Size(max = 500)
    private String storeLogoUrl;
}
