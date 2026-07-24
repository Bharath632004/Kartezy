package com.kartezy.adminservice.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    @Min(0)
    private long totalUsers;

    @Min(0)
    private long totalMerchants;

    @Min(0)
    private long totalOrders;

    @Min(0)
    private long totalRevenue;

    @Min(0)
    private long pendingApprovals;

    @Min(0)
    private long activeDeliveries;

    private Map<String, Long> orderStatusBreakdown;

    private Map<String, Double> revenueByDay;
}
