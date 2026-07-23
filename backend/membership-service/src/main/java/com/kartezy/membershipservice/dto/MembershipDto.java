package com.kartezy.membershipservice.dto;

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
    private UUID userId;
    private UUID planId;
    private String tier;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean autoRenew;
    private String paymentReference;
    private LocalDateTime createdAt;
}
