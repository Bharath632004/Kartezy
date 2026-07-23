package com.kartezy.analyticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsDto {
    private long totalPageViews;
    private long uniqueVisitors;
    private long totalSessions;
    private double averageSessionDuration;
    private double bounceRate;
    private Map<String, Long> pageViewsByUrl;
    private Map<String, Long> eventsByType;
    private Map<String, Long> usersByHour;
}
