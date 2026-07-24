package com.kartezy.authservice.entity;

import com.kartezy.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Tracks login attempts for brute force and suspicious activity detection.
 */
@Entity
@Table(name = "login_attempts", indexes = {
        @Index(name = "idx_login_attempts_identifier", columnList = "identifier"),
        @Index(name = "idx_login_attempts_ip", columnList = "ipAddress"),
        @Index(name = "idx_login_attempts_timestamp", columnList = "attemptedAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginAttempt extends AuditableEntity {

    @Column(name = "identifier", nullable = false, length = 255)
    private String identifier; // Email or phone number

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "attempted_at", nullable = false)
    private Instant attemptedAt;

    @Column(name = "success", nullable = false)
    private boolean success;

    @Column(name = "failure_reason", length = 255)
    private String failureReason;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "device_fingerprint", length = 255)
    private String deviceFingerprint;

    @Column(name = "is_suspicious", nullable = false)
    @Builder.Default
    private boolean suspicious = false;

    @Column(name = "risk_score")
    @Builder.Default
    private int riskScore = 0;
}
