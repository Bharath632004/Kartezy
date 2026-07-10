package com.kartezy.authservice.entity;

import com.kartezy.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * User session (e.g., for tracking active logins).
 */
@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session extends AuditableEntity {

    @Column(name = "session_id", nullable = false, length = 255, unique = true)
    private String sessionId;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "last_accessed_at")
    private Instant lastAccessedAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    // Many-to-One with User
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Indicates if the session is valid
    @Column(name = "is_valid", nullable = false)
    @Builder.Default
    private boolean valid = true;
}