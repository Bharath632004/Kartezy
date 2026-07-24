package com.kartezy.fraudservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing a fraud detection event.
 */
@Entity
@Table(name = "fraud_events", indexes = {
        @Index(name = "idx_fraud_events_user", columnList = "userId"),
        @Index(name = "idx_fraud_events_type", columnList = "eventType"),
        @Index(name = "idx_fraud_events_timestamp", columnList = "timestamp"),
        @Index(name = "idx_fraud_events_risk", columnList = "riskScore")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudEvent {

    @Id
    private UUID id;

    @Column(name = "user_id", length = 100)
    private String userId;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType; // LOGIN, PAYMENT, ORDER, COUPON, WALLET, DELIVERY, MERCHANT

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "device_fingerprint", length = 255)
    private String deviceFingerprint;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "risk_score")
    private int riskScore;

    @Column(name = "action_required")
    private boolean actionRequired;

    @Column(name = "action_taken", length = 255)
    private String actionTaken;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata; // JSON with additional context
}
