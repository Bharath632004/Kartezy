package com.kartezy.analyticsservice.repository;

import com.kartezy.analyticsservice.entity.AnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, UUID> {
    List<AnalyticsEvent> findByEventTypeOrderByCreatedAtDesc(String eventType);
    List<AnalyticsEvent> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<AnalyticsEvent> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    long countByEventTypeAndCreatedAtBetween(String eventType, LocalDateTime start, LocalDateTime end);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
