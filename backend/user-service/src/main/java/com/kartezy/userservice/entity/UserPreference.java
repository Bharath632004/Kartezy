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
/**
 * User preference entity for general application preferences.
 */
@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference extends AuditableEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;
    @Column(name = "notification_sound")
    @Builder.Default
    private boolean notificationSound = true;
    @Column(name = "vibration_enabled")
    @Builder.Default
    private boolean vibrationEnabled = true;
    @Column(name = "auto_play_videos")
    @Builder.Default
    private boolean autoPlayVideos = true;
    @Column(name = "data_saver_mode")
    @Builder.Default
    private boolean dataSaverMode = false;
    @Column(name = "auto_update")
    @Builder.Default
    private boolean autoUpdate = true;
    @Column(name = "help_tips_enabled")
    @Builder.Default
    private boolean helpTipsEnabled = true;
    @Column(name = "order_notifications")
    @Builder.Default
    private boolean orderNotifications = true;
    @Column(name = "promotional_notifications")
    @Builder.Default
    private boolean promotionalNotifications = true;
    @Column(name = "newsletter_subscription")
    @Builder.Default
    private boolean newsletterSubscription = false;
}
