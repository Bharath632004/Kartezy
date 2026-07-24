package com.kartezy.analyticsservice.dto;

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
public class DashboardMetricsDto {

    @Min(0)
    private long totalPageViews;

    @Min(0)
    private long uniqueVisitors;

    @Min(0)
    private long totalSessions;

    @Min(0)
    private double averageSessionDuration;

    @Min(0)
    private double bounceRate;

    private Map<String, Long> pageViewsByUrl;

    private Map<String, Long> eventsByType;

    private Map<String, Long> usersByHour;
}
