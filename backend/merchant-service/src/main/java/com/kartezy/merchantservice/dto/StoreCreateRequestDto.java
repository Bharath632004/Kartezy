package com.kartezy.merchantservice.dto;

import jakarta.validation.constraints.*;
import jakarta.validation.Valid;
import java.util.UUID;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for creating a new store.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreCreateRequestDto {

    @NotNull
    private UUID merchantId;

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 1000)
    private String description;

    @Size(max = 100)
    private String category;

    @Size(max = 500)
    private String logoUrl;

    @Size(max = 500)
    private String bannerUrl;

    @Size(max = 100)
    private String tagline;

    @NotBlank
    @Size(max = 500)
    private String addressLine1;

    @Size(max = 500)
    private String addressLine2;

    @NotBlank
    @Size(max = 100)
    private String city;

    @NotBlank
    @Size(max = 100)
    private String state;

    @Size(max = 20)
    private String pincode;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @NotBlank
    @Size(max = 15)
    private String phoneNumber;

    @Email
    @Size(max = 255)
    private String email;

    @Size(max = 255)
    private String website;

    @NotNull
    @PositiveOrZero
    private Double deliveryRadius;

    @NotNull
    @PositiveOrZero
    private Double minimumOrderAmount;

    @NotNull
    @PositiveOrZero
    private Double deliveryCharge;

    @NotNull
    @PositiveOrZero
    private Double freeDeliveryThreshold;

    @Size(max = 500)
    private String cancellationPolicy;

    @Size(max = 500)
    private String returnPolicy;

    @Size(max = 500)
    private String termsAndConditions;

    @Valid
    @NotEmpty
    private List<StoreBusinessHoursDto> businessHours;
}