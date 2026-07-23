package com.kartezy.analyticsservice.dto;

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
public class AnalyticsEventDto {
    private UUID id;
    private String eventType;
    private UUID userId;
    private String sessionId;
    private String eventData;
    private String pageUrl;
    private LocalDateTime createdAt;
}
