package com.kartezy.adminservice.dto;

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
    private long totalUsers;
    private long totalMerchants;
    private long totalOrders;
    private long totalRevenue;
    private long pendingApprovals;
    private long activeDeliveries;
    private Map<String, Long> orderStatusBreakdown;
    private Map<String, Double> revenueByDay;
}
