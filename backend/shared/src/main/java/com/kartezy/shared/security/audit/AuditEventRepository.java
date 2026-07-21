package com.kartezy.shared.security.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for AuditEvent entities.
 */
@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {

    /**
     * Find events by event type within a time range, ordered by timestamp descending.
     */
    List<AuditEvent> findByEventTypeAndEventTimestampBetweenOrderByEventTimestampDesc(
            String eventType, Instant startTime, Instant endTime);

    /**
     * Find events within a time range, ordered by timestamp descending.
     */
    List<AuditEvent> findByEventTimestampBetweenOrderByEventTimestampDesc(Instant startTime, Instant endTime);

    /**
     * Find top 100 events by event type, ordered by timestamp descending.
     */
    List<AuditEvent> findTop100ByEventTypeOrderByEventTimestampDesc(String eventType);

    /**
     * Find top 100 events ordered by timestamp descending.
     */
    List<AuditEvent> findTop100ByOrderByEventTimestampDesc();

    /**
     * Count events by event type.
     */
    long countByEventType(String eventType);

    /**
     * Count events after a specific timestamp.
     */
    long countByEventTimestampAfter(Instant timestamp);
}