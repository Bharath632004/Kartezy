package com.kartezy.analyticsservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @NotBlank @Size(max = 100)
    private String eventType;

    @NotNull
    private UUID userId;

    @NotBlank @Size(max = 100)
    private String sessionId;

    private String eventData;

    @Size(max = 500)
    private String pageUrl;

    private LocalDateTime createdAt;
}
