package com.kartezy.authservice.entity;

import com.kartezy.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * MFA Device for TOTP authenticator app integration.
 * Supports Google Authenticator, Authy, Microsoft Authenticator, etc.
 */
@Entity
@Table(name = "mfa_devices", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "device_name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MfaDevice extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "device_name", length = 100)
    private String deviceName;

    @Column(name = "secret_key", nullable = false, length = 64)
    private String secretKey; // Encrypted TOTP secret

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private boolean verified = false;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "last_used_at")
    private Instant lastUsedAt;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "method", nullable = false, length = 20)
    @Builder.Default
    private String method = "TOTP"; // TOTP, SMS, EMAIL
}
