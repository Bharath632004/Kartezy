package com.kartezy.schedulerservice.dto;

import jakarta.validation.constraints.NotBlank;
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
public class ScheduledTaskDto {
    private UUID id;

    @NotBlank @Size(max = 200)
    private String taskName;

    @NotBlank @Size(max = 100)
    private String taskType;

    @NotBlank
    private String status;

    @Size(max = 100)
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
