package com.kartezy.deliveryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryEarningDto {
    private UUID id;
    private UUID partnerId;
    private UUID assignmentId;
    private Double deliveryFee;
    private Double tip;
    private Double incentive;
    private Double totalAmount;
    private Double platformCommission;
    private Double netAmount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime settledAt;
}
