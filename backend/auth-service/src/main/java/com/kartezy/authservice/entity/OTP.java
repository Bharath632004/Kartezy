package com.kartezy.authservice.entity;

import com.kartezy.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * One-Time Password for verification (email, phone).
 */
@Entity
@Table(name = "otps", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"otp"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OTP extends AuditableEntity {

    @Column(name = "otp", nullable = false, length = 10)
    private String otp;

    @Column(name = "purpose", nullable = false, length = 50)
    private String purpose; // e.g., EMAIL_VERIFICATION, PHONE_VERIFICATION, PASSWORD_RESET

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "is_used", nullable = false)
    private boolean used = false;

    // Many-to-One with User (optional, as OTP may be sent before user exists)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}