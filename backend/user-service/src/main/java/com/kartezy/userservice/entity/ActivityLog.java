package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Email;
import lombok.*;
import com.kartezy.shared.audit.AuditableEntity;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Activity log entity for tracking customer's activities.
 */
@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog extends AuditableEntity {


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @NotBlank
    @Size(max = 255)
    @Column(name = "activity_type", length = 255)
    private String activityType; // e.g., LOGIN, PROFILE_UPDATE, ADDRESS_ADD

    @NotBlank
    @Size(max = 500)
    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "activity_time")
    private LocalDateTime activityTime;

    @Column(name = "ip_address")
    @Size(max = 45)
    private String ipAddress; // IPv4 or IPv6

    @Column(name = "user_agent")
    @Size(max = 255)
    private String userAgent;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;
}
