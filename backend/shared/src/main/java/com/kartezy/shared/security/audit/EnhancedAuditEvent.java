package com.kartezy.shared.security.audit;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Enhanced entity representing an audit event for security-related activities with immutability and integrity features.
 * <p>
 * This extends the basic AuditEvent with cryptographic hash chaining for tamper evidence and additional
 * compliance-related fields.
 * </p>
 */
@Entity
@Table(name = "enhanced_audit_events",
       indexes = {
           @Index(name = "idx_enhanced_audit_event_type", columnList = "eventType"),
           @Index(name = "idx_enhanced_audit_principal", columnList = "principal"),
           @Index(name = "idx_enhanced_audit_timestamp", columnList = "eventTimestamp"),
           @Index(name = "idx_enhanced_audit_outcome", columnList = "outcome")
       })
public class EnhancedAuditEvent {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "event_type", length = 100, nullable = false)
    private String eventType;

    @Column(name = "principal", length = 255)
    private String principal;

    @Column(name = "ip_address", length = 45) // IPv6 max length
    private String ipAddress;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "outcome", length = 20)
    private String outcome;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "event_timestamp", nullable = false)
    private Instant eventTimestamp;

    /** Cryptographic hash of the previous event in the chain for tamper evidence */
    @Column(name = "previous_hash", length = 64)
    private String previousHash;

    /** Cryptographic hash of this event's content */
    @Column(name = "event_hash", length = 64, nullable = false)
    private String eventHash;

    /** Version for handling schema changes */
    @Column(name = "schema_version", nullable = false)
    private int schemaVersion = 1;

    /** Indicates if this record has been marked for deletion (for GDPR right to be forgotten) */
    @Column(name = "is_redacted", nullable = false)
    private boolean redacted = false;

    /** Timestamp when this record was created in the database */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    /** Timestamp when this record was last updated */
    @Column(name = "updated_at")
    private Instant updatedAt;

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getPrincipal() {
        return principal;
    }

    public void setPrincipal(String principal) {
        this.principal = principal;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Instant getEventTimestamp() {
        return eventTimestamp;
    }

    public void setEventTimestamp(Instant eventTimestamp) {
        this.eventTimestamp = eventTimestamp;
    }

    public String getPreviousHash() {
        return previousHash;
    }

    public void setPreviousHash(String previousHash) {
        this.previousHash = previousHash;
    }

    public String getEventHash() {
        return eventHash;
    }

    public void setEventHash(String eventHash) {
        this.eventHash = eventHash;
    }

    public int getSchemaVersion() {
        return schemaVersion;
    }

    public void setSchemaVersion(int schemaVersion) {
        this.schemaVersion = schemaVersion;
    }

    public boolean isRedacted() {
        return redacted;
    }

    public void setRedacted(boolean redacted) {
        this.redacted = redacted;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}