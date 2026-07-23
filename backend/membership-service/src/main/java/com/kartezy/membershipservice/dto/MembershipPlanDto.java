package com.kartezy.membershipservice.dto;

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
    private String name;
    private String tier;
    private BigDecimal price;
    private int durationDays;
    private String description;
    private String benefits;
    private boolean active;
}
