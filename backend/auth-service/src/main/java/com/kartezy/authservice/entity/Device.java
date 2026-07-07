package com.kartezy.authservice.entity;

import com.kartezy.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * User device (for device fingerprinting / trust).
 */
@Entity
@Table(name = "devices", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"device_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device extends AuditableEntity {

    @Column(name = "device_id", nullable = false, length = 255)
    private String deviceId;

    @Column(name = "device_name", length = 255)
    private String deviceName;

    @Column(name = "device_type", length = 100)
    private String deviceType; // e.g., MOBILE, DESKTOP, TABLET

    @Column(name = "os", length = 100)
    private String os;

    @Column(name = "browser", length = 100)
    private String browser;

    @Column(name = "last_used_at")
    private Instant lastUsedAt;

    @Column(name = "is_trusted")
    private boolean trusted = false;

    // Many-to-One with User
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}