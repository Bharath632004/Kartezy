package com.kartezy.schedulerservice.dto;

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
public class ScheduledTaskDto {
    private UUID id;
    private String taskName;
    private String taskType;
    private String status;
    private String cronExpression;
    private String taskConfig;
    private LocalDateTime nextRunAt;
    private int retryCount;
    private int maxRetries;
    private LocalDateTime lastRunAt;
    private LocalDateTime lastSuccessAt;
    private String lastError;
    private boolean active;
    private LocalDateTime createdAt;
}
