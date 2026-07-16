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
/**
 * Device history entity for tracking customer's device usage.
 */
@Entity
@Table(name = "device_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceHistory extends AuditableEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;
    @NotBlank
    @Size(max = 255)
    @Column(name = "device_id", length = 255)
    private String deviceId; // Unique device identifier
    @NotBlank
    @Size(max = 100)
    @Column(name = "device_type", length = 100)
    private String deviceType; // e.g., MOBILE, TABLET, DESKTOP
    @NotBlank
    @Size(max = 100)
    @Column(name = "operating_system", length = 100)
    private String operatingSystem; // e.g., ANDROID, IOS, WINDOWS, MACOS
    @NotBlank
    @Size(max = 100)
    @Column(name = "os_version", length = 100)
    private String osVersion;
    @NotBlank
    @Size(max = 100)
    @Column(name = "app_version", length = 100)
    private String appVersion;
    @Column(name = "last_used")
    private LocalDateTime lastUsed;
    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = false;
    @Column(name = "latitude")
    private Double latitude;
    @Column(name = "longitude")
    private Double longitude;
}
