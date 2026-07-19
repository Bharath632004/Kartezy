package com.kartezy.shared.security.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for EnhancedAuditEvent entities.
 * <p>
 * Provides methods for querying audit events with support for pagination,
 * filtering, and GDPR compliance operations.
 * </p>
 */
@Repository
public interface EnhancedAuditEventRepository extends JpaRepository<EnhancedAuditEvent, UUID> {

    /**
     * Find events by event type.
     */
    List<EnhancedAuditEvent> findByEventType(String eventType);

    /**
     * Find events by principal.
     */
    List<EnhancedAuditEvent> findByPrincipal(String principal);

    /**
     * Find events by IP address.
     */
    List<EnhancedAuditEvent> findByIpAddress(String ipAddress);

    /**
     * Find events by outcome.
     */
    List<EnhancedAuditEvent> findByOutcome(String outcome);

    /**
     * Find events within a time range ordered by timestamp ascending.
     */
    List<EnhancedAuditEvent> findByEventTimestampBetweenOrderByEventTimestampAsc(Instant startTime, Instant endTime);

    /**
     * Find events after a timestamp ordered by timestamp ascending.
     */
    List<EnhancedAuditEvent> findByEventTimestampAfterOrderByEventTimestampAsc(Instant startTime);

    /**
     * Find events before a timestamp ordered by timestamp ascending.
     */
    List<EnhancedAuditEvent> findByEventTimestampBeforeOrderByEventTimestampAsc(Instant endTime);

    /**
     * Find all events ordered by timestamp ascending.
     */
    List<EnhancedAuditEvent> findAllByOrderByEventTimestampAsc();

    /**
     * Find the most recent non-redacted event.
     */
    java.util.Optional<EnhancedAuditEvent> findTopByRedactedFalseOrderByEventTimestampDesc();

    /**
     * Find events by event type within a time range.
     */
    List<EnhancedAuditEvent> findByEventTypeAndEventTimestampBetween(String eventType, Instant startTime, Instant endTime);

    /**
     * Count events by event type.
     */
    long countByEventType(String eventType);

    /**
     * Get the most recent event hash for chaining.
     * @return the hash of the most recent non-redacted event, or null if none exist
     */
    @Query(value = "SELECT e.eventHash FROM EnhancedAuditEvent e WHERE e.redacted = false ORDER BY e.eventTimestamp DESC LIMIT 1")
    String findMostRecentEventHash();

    /**
     * Get events that need to be processed for hash chaining (those without a previous hash set).
     */
    @Query("SELECT e FROM EnhancedAuditEvent e WHERE e.previousHash IS NULL AND e.redacted = false ORDER BY e.eventTimestamp ASC")
    List<EnhancedAuditEvent> findEventsWithoutPreviousHash();

    /**
     * Soft delete events for GDPR compliance (right to be forgotten).
     * Instead of actually deleting, we mark them as redacted and optionally clear sensitive data.
     */
    @Modifying
    @Query("UPDATE EnhancedAuditEvent e SET e.redacted = true, e.description = '[REDACTED]', e.details = null WHERE e.id IN :ids")
    void redactEventsByIds(@Param("ids") List<UUID> ids);

    /**
     * Get count of non-redacted events.
     */
    @Query("SELECT COUNT(e) FROM EnhancedAuditEvent e WHERE e.redacted = false")
    long countActiveEvents();
}