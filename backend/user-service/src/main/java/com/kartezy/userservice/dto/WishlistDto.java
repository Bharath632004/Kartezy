package com.kartezy.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Set;
import java.util.UUID;

/**
 * Data Transfer Object for Wishlist entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistDto {

    private UUID id;

    @NotNull
    private UUID customerProfileId;

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @Builder.Default
    private Set<WishlistItemDto> items = java.util.Set.of();
}
