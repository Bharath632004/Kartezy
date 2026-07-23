package com.kartezy.analyticsservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "analytics_events", indexes = {
    @Index(name = "idx_analytics_event_type", columnList = "eventType"),
    @Index(name = "idx_analytics_user_id", columnList = "userId"),
    @Index(name = "idx_analytics_created_at", columnList = "createdAt")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String eventType;

    private UUID userId;

    @Column(length = 100)
    private String sessionId;

    @Column(columnDefinition = "TEXT")
    private String eventData;

    @Column(length = 45)
    private String ipAddress;

    @Column(length = 500)
    private String userAgent;

    @Column(length = 255)
    private String pageUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
