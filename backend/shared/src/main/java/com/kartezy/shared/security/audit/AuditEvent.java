package com.kartezy.shared.security.audit;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing an audit event for security-related activities.
 */
@Entity
@Table(name = "audit_events")
public class AuditEvent {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "event_type", length = 100, nullable = false)
    private String eventType;

    @Column(name = "principal", length = 255)
    private String principal;

    @Column(name = "ip_address", length = 45) // IPv6 max length
    private String ipAddress;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "outcome", length = 20)
    private String outcome;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "event_timestamp", nullable = false)
    private Instant eventTimestamp;

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
}