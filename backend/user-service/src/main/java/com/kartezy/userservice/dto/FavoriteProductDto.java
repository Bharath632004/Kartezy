package com.kartezy.userservice.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.UUID;
/**
 * Data Transfer Object for FavoriteProduct entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteProductDto {
    private UUID id;
    @NotNull
    private UUID customerProfileId;
    @NotBlank
    private String productId; // Reference to catalog service product
    @NotBlank
    @Size(max = 255)
    private String productName;
    @Size(max = 500)
    private String productImageUrl;
    private Long addedAt; // timestamp when added
}
