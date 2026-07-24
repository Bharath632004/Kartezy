package com.kartezy.authservice.entity;

import com.kartezy.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Single-use backup codes for MFA recovery.
 * Generated when user enrolls in MFA, allowing access if authenticator app is unavailable.
 */
@Entity
@Table(name = "mfa_backup_codes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"code_hash", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MfaBackupCode extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "code_hash", nullable = false, length = 128)
    private String codeHash; // BCrypt hash of the backup code

    @Column(name = "code_prefix", length = 4)
    private String codePrefix; // First 4 chars for display purposes only

    @Column(name = "is_used", nullable = false)
    @Builder.Default
    private boolean used = false;

    @Column(name = "used_at")
    private Instant usedAt;

    @Column(name = "expires_at")
    private Instant expiresAt;
}
