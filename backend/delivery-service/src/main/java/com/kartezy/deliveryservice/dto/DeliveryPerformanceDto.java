package com.kartezy.deliveryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPerformanceDto {
    private long totalDeliveries;
    private long completedDeliveries;
    private long cancelledDeliveries;
    private double averageRating;
    private double totalEarnings;
    private double averageDeliveryTime;
    private double acceptanceRate;
    private double completionRate;
}
