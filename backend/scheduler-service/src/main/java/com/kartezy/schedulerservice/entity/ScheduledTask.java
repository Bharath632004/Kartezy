package com.kartezy.schedulerservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "scheduled_tasks", indexes = {
    @Index(name = "idx_sched_type", columnList = "taskType"),
    @Index(name = "idx_sched_status", columnList = "status"),
    @Index(name = "idx_sched_next_run", columnList = "nextRunAt")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledTask {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String taskName;

    @Column(nullable = false, length = 50)
    private String taskType;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(length = 100)
    private String cronExpression;

    @Column(length = 500)
    private String taskConfig;

    @Column(nullable = false)
    private LocalDateTime nextRunAt;

    @Column(nullable = false)
    @Builder.Default
    private int retryCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private int maxRetries = 3;

    private LocalDateTime lastRunAt;

    private LocalDateTime lastSuccessAt;

    @Column(length = 500)
    private String lastError;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
