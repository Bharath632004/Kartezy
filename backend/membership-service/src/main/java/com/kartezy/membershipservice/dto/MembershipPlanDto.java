package com.kartezy.membershipservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class MembershipPlanDto {
    private UUID id;

    @NotBlank @Size(max = 200)
    private String name;

    @NotBlank
    private String tier;

    @NotNull @Positive
    private BigDecimal price;

    @Positive
    private int durationDays;

    private String description;

    private String benefits;

    private boolean active;
}
