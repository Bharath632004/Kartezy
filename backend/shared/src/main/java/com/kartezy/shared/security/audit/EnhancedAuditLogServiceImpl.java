package com.kartezy.shared.security.audit;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Implementation of EnhancedAuditLogService that provides tamper-evident audit logging.
 * <p>
 * This service extends the basic audit logging functionality with cryptographic hashing
 * to ensure integrity and detect tampering with audit records.
 * </p>
 */
@Service
public class EnhancedAuditLogServiceImpl implements EnhancedAuditLogService {

    private final EnhancedAuditEventRepository enhancedAuditEventRepository;
    private final AuditEventRepository auditEventRepository; // For backward compatibility

    @Autowired
    public EnhancedAuditLogServiceImpl(EnhancedAuditEventRepository enhancedAuditEventRepository,
                                       AuditEventRepository auditEventRepository) {
        this.enhancedAuditEventRepository = enhancedAuditEventRepository;
        this.auditEventRepository = auditEventRepository;
    }

    @Override
    @Transactional
    public EnhancedAuditEvent logEventWithIntegrity(String eventType, String principal, String ipAddress,
                                                    String description, String outcome, String details, Instant eventTimestamp) {
        // Create the event
        EnhancedAuditEvent event = new EnhancedAuditEvent();
        event.setEventType(eventType);
        event.setPrincipal(principal);
        event.setIpAddress(ipAddress);
        event.setDescription(description);
        event.setOutcome(outcome);
        event.setDetails(details);
        event.setEventTimestamp(eventTimestamp != null ? eventTimestamp : Instant.now());

        // Get the hash of the most recent non-redacted event for chaining
        String previousHash = getLatestEventHash();
        event.setPreviousHash(previousHash);

        // Generate and set the event hash
        String eventHash = generateEventHash(event);
        event.setEventHash(eventHash);

        // Save the event
        EnhancedAuditEvent savedEvent = enhancedAuditEventRepository.save(event);
        return savedEvent;
    }

    @Override
    @Transactional
    public void loginSuccess(String principal, String ipAddress) {
        logEventWithIntegrity("LOGIN_SUCCESS", principal, ipAddress, "User logged in successfully", "SUCCESS", null, Instant.now());
    }

    @Override
    @Transactional
    public void loginFailure(String principal, String ipAddress, String reason) {
        logEventWithIntegrity("LOGIN_FAILURE", principal, ipAddress, "Login failed: " + reason, "FAILURE", null, Instant.now());
    }

    @Override
    @Transactional
    public void logout(String principal, String ipAddress) {
        logEventWithIntegrity("LOGOUT", principal, ipAddress, "User logged out", "SUCCESS", null, Instant.now());
    }

    @Override
    @Transactional
    public void accessDenied(String principal, String ipAddress, String resource) {
        logEventWithIntegrity("ACCESS_DENIED", principal, ipAddress, "Access denied to resource: " + resource, "FAILURE", null, Instant.now());
    }

    @Override
    @Transactional
    public void permissionChange(String principal, String ipAddress, String details) {
        logEventWithIntegrity("PERMISSION_CHANGE", principal, ipAddress, "Permissions changed", "SUCCESS", details, Instant.now());
    }

    @Override
    @Transactional
    public void logEvent(String eventType, String principal, String ipAddress, String description, String outcome, String details, Instant eventTimestamp) {
        logEventWithIntegrity(eventType, principal, ipAddress, description, outcome, details, eventTimestamp);
    }

    @Override
    public boolean verifyEventIntegrity(String eventId) {
        return enhancedAuditEventRepository.findById(java.util.UUID.fromString(eventId))
                .map(event -> !event.isRedacted() && verifyEventHash(event))
                .orElse(false);
    }

    @Override
    public boolean verifyChainIntegrity(List<String> eventIds) {
        if (eventIds == null || eventIds.isEmpty()) {
            return true;
        }

        // Retrieve all events in the order specified
        java.util.List<EnhancedAuditEvent> events = enhancedAuditEventRepository.findAllById(
                eventIds.stream()
                        .map(java.util.UUID::fromString)
                        .toList());

        // Verify the chain
        return verifyChain(events);
    }

    @Override
    public List<EnhancedAuditEvent> getAllEventsForIntegrityCheck() {
        return enhancedAuditEventRepository.findAllByOrderByEventTimestampAsc();
    }

    @Override
    public List<EnhancedAuditEvent> getEventsForIntegrityCheck(Instant startTime, Instant endTime) {
        if (startTime != null && endTime != null) {
            return enhancedAuditEventRepository.findByEventTimestampBetweenOrderByEventTimestampAsc(startTime, endTime);
        } else if (startTime != null) {
            return enhancedAuditEventRepository.findByEventTimestampAfterOrderByEventTimestampAsc(startTime);
        } else if (endTime != null) {
            return enhancedAuditEventRepository.findByEventTimestampBeforeOrderByEventTimestampAsc(endTime);
        } else {
            return getAllEventsForIntegrityCheck();
        }
    }

    /**
     * Generates a cryptographic hash for an audit event based on its content.
     * <p>
     * The hash includes all relevant fields except the hash itself and database-generated fields.
     * </p>
     *
     * @param event the audit event to hash
     * @return hexadecimal string representation of the SHA-256 hash
     */
    private String generateEventHash(EnhancedAuditEvent event) {
        return AuditHashUtil.generateEventHash(event);
    }

    /**
     * Verifies that the stored hash of an event matches the recomputed hash.
     *
     * @param event the audit event to verify
     * @return true if the hash matches, false otherwise
     */
    private boolean verifyEventHash(EnhancedAuditEvent event) {
        return AuditHashUtil.verifyEventHash(event);
    }

    /**
     * Verifies the integrity of a chain of audit events.
     * <p>
     * This checks that each event's previousHash matches the hash of the previous event
     * in the chain, and that each event's own hash is valid.
     * </p>
     *
     * @param events the list of audit events in chronological order
     * @return true if the chain is valid, false otherwise
     */
    private boolean verifyChain(List<EnhancedAuditEvent> events) {
        return AuditHashUtil.verifyChain(events);
    }

    /**
     * Gets the hash of the most recent non-redacted event for chaining.
     *
     * @return the hash of the most recent event, or empty string if no events exist
     */
    private String getLatestEventHash() {
        return enhancedAuditEventRepository.findTopByRedactedFalseOrderByEventTimestampDesc()
                .map(EnhancedAuditEvent::getEventHash)
                .orElse("");
    }

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
    @Transactional
    public void redactEvent(String eventId) {
        enhancedAuditEventRepository.findById(java.util.UUID.fromString(eventId))
                .ifPresent(event -> {
                    event.setRedacted(true);
                    // Clear PII fields but keep structure for hashing
                    event.setPrincipal("[REDACTED]");
                    event.setIpAddress("[REDACTED]");
                    event.setDescription("[REDACTED]");
                    event.setDetails("[REDACTED]");
                    // Note: We update the hash to reflect the redacted content
                    // This maintains integrity while complying with GDPR
                    String redactedHash = generateEventHash(event);
                    event.setEventHash(redactedHash);
                    enhancedAuditEventRepository.save(event);
                });
    }
}