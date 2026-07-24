package com.kartezy.membershipservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembershipDto {
    private UUID id;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID planId;

    @NotBlank
    private String tier;

    @NotBlank
    private String status;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private boolean autoRenew;

    private String paymentReference;

    private LocalDateTime createdAt;
}
