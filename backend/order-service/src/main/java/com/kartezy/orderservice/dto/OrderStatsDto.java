package com.kartezy.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatsDto {
    private long totalOrders;
    private long pendingOrders;
    private long activeOrders;
    private long deliveredOrders;
    private long cancelledOrders;
    private long returnedOrders;
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private double averageOrderValue;
    private long totalItemsSold;
}
