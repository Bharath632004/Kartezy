package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Login history entity for tracking customer's login attempts.
 */
@Entity
@Table(name = "login_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginHistory extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "login_time")
    private LocalDateTime loginTime;

    @Column(name = "logout_time")
    private LocalDateTime logoutTime;

    @Column(name = "duration_seconds")
    private Long durationSeconds;

    @NotBlank
    @Size(max = 45)
    @Column(name = "ip_address", length = 45)
    private String ipAddress; // IPv4 or IPv6

    @Column(name = "user_agent")
    @Size(max = 255)
    private String userAgent;

    @Column(name = "is_successful")
    private boolean isSuccessful = false;

    @Column(name = "failure_reason")
    @Size(max = 255)
    private String failureReason; // e.g., INVALID_CREDENTIALS, ACCOUNT_LOCKED

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;
}
