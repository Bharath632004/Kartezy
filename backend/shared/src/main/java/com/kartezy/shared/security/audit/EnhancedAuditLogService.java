package com.kartezy.shared.security.audit;

import java.time.Instant;
import java.util.List;

/**
 * Service interface for logging security audit events with integrity protection.
 * <p>
 * This extended service provides tamper-evident audit logging through cryptographic hashing
 * and chain verification capabilities.
 * </p>
 */
public interface EnhancedAuditLogService extends AuditLogService {

    /**
     * Logs a security audit event and returns the persisted event with its integrity hash.
     * <p>
     * This method computes and stores a cryptographic hash of the event data for tamper evidence.
     * </p>
     *
     * @param eventType     the type of event
     * @param principal     the user identifier (if applicable)
     * @param ipAddress     the IP address of the client
     * @param description   a description of the event
     * @param outcome       the outcome (e.g., SUCCESS, FAILURE)
     * @param details       additional details in JSON format
     * @param eventTimestamp the timestamp of the event
     * @return the persisted audit event with integrity hash
     */
    EnhancedAuditEvent logEventWithIntegrity(String eventType, String principal, String ipAddress,
                                             String description, String outcome, String details, Instant eventTimestamp);

    /**
     * Verifies the integrity of a specific audit event.
     *
     * @param eventId the ID of the event to verify
     * @return true if the event's hash matches the recomputed hash, false otherwise
     */
    boolean verifyEventIntegrity(String eventId);

    /**
     * Verifies the integrity of a chain of audit events.
     * <p>
     * This checks that each event properly references the hash of the previous event
     * in the chain, providing tamper evidence across the entire sequence.
     * </p>
     *
     * @param eventIds the IDs of events to verify in chronological order
     * @return true if the chain is valid, false otherwise
     */
    boolean verifyChainIntegrity(List<String> eventIds);

    /**
     * Gets all audit events for integrity verification purposes.
     * <p>
     * This method bypasses any redaction filters to return all events for integrity checking.
     * </p>
     *
     * @return all audit events in chronological order
     */
    List<EnhancedAuditEvent> getAllEventsForIntegrityCheck();

    /**
     * Gets audit events within a time range for integrity verification.
     *
     * @param startTime start time (inclusive)
     * @param endTime   end time (exclusive)
     * @return audit events in the specified time range in chronological order
     */
    List<EnhancedAuditEvent> getEventsForIntegrityCheck(Instant startTime, Instant endTime);

    /**
     * Redacts an audit event for GDPR "right to be forgotten" compliance.
     * <p>
     * Note: This does not actually delete the data but marks it as redacted.
     * The actual data remains in the database for integrity verification purposes
     * but is masked for normal queries.
     * </p>
     *
     * @param eventId the ID of the event to redact
     */
    void redactEvent(String eventId);
}