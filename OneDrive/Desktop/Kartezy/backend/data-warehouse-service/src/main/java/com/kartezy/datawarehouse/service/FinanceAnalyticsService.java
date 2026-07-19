package com.kartezy.datawarehouse.service;

import com.kartezy.datawarehouse.repository.DailyOrdersFactRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class FinanceAnalyticsService {
    private final DailyOrdersFactRepository ordersRepo;

    public FinanceAnalyticsService(DailyOrdersFactRepository ordersRepo) {
        this.ordersRepo = ordersRepo;
    }

    public Map<String, Object> getFinanceOverview(LocalDate start, LocalDate end) {
        Map<String, Object> result = new HashMap<>();
        result.put("period", Map.of("start", start.toString(), "end", end.toString()));
        result.put("totalRevenue", ordersRepo.sumRevenueBetween(start, end));
        result.put("totalGmv", ordersRepo.sumGmvBetween(start, end));
        result.put("totalOrders", ordersRepo.sumOrdersBetween(start, end));
        result.put("revenueByCategory", ordersRepo.getRevenueByCategory(start, end));

        // Revenue breakdown
        Double revenue = ordersRepo.sumRevenueBetween(start, end);
        result.put("revenueBreakdown", List.of(
            Map.of("source", "Platform Commission", "amount", revenue != null ? revenue * 0.15 : 0, "percentage", 15.0),
            Map.of("source", "Delivery Fees", "amount", revenue != null ? revenue * 0.08 : 0, "percentage", 8.0),
            Map.of("source", "Subscription", "amount", revenue != null ? revenue * 0.05 : 0, "percentage", 5.0),
            Map.of("source", "Advertising", "amount", revenue != null ? revenue * 0.03 : 0, "percentage", 3.0),
            Map.of("source", "Other", "amount", revenue != null ? revenue * 0.02 : 0, "percentage", 2.0)
        ));

        result.put("expenseBreakdown", List.of(
            Map.of("category", "Delivery Partner Payouts", "amount", revenue != null ? revenue * 0.45 : 0, "percentage", 45.0),
            Map.of("category", "Merchant Settlements", "amount", revenue != null ? revenue * 0.25 : 0, "percentage", 25.0),
            Map.of("category", "Marketing", "amount", revenue != null ? revenue * 0.08 : 0, "percentage", 8.0),
            Map.of("category", "Operations", "amount", revenue != null ? revenue * 0.06 : 0, "percentage", 6.0),
            Map.of("category", "Technology", "amount", revenue != null ? revenue * 0.04 : 0, "percentage", 4.0),
            Map.of("category", "Other", "amount", revenue != null ? revenue * 0.02 : 0, "percentage", 2.0)
        ));

        result.put("summary", Map.of(
            "netRevenue", revenue != null ? revenue * 0.67 : 0,
            "grossMargin", revenue != null ? 33.0 : 0,
            "operatingCost", revenue != null ? revenue * 0.15 : 0,
            "profit", revenue != null ? revenue * 0.18 : 0,
            "profitMargin", revenue != null ? 18.0 : 0
        ));
        return result;
    }
}
