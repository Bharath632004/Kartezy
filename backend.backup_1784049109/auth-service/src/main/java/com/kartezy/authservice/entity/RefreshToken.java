package com.kartezy.authservice.entity;
import com.kartezy.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
/**
 * Refresh token for JWT token renewal.
 */
@Entity
@Table(name = "refresh_tokens", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"token"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken extends AuditableEntity {
    @Column(name = "token", nullable = false, length = 500)
    private String token;
    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;
    // Many-to-One with User
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    // Indicates if the token has been revoked
    @Builder.Default
    @Column(name = "revoked", nullable = false)
    private boolean revoked = false;
}