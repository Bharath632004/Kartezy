package com.kartezy.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Data Transfer Object for Membership entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipDto {

    private UUID id;

    @NotNull
    private UUID customerProfileId;

    @NotBlank
    @Size(max = 20)
    private String plan; // e.g., BASIC, PREMIUM, ULTIMATE

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean isActive = false;

    private boolean autoRenew = false;

    private Double price;

    @Size(max = 3)
    private String currency; // e.g., USD, EUR, INR
}
