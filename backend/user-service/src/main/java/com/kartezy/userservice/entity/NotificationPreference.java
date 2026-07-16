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
 * Notification preference entity for customer's notification settings.
 */
@Entity
@Table(name = "notification_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreference extends AuditableEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;
    @Column(name = "email_enabled")
    @Builder.Default
    private boolean emailEnabled = true;
    @Column(name = "sms_enabled")
    @Builder.Default
    private boolean smsEnabled = true;
    @Column(name = "push_enabled")
    @Builder.Default
    private boolean pushEnabled = true;
    @Column(name = "marketing_emails_enabled")
    @Builder.Default
    private boolean marketingEmailsEnabled = true;
    @Column(name = "marketing_sms_enabled")
    @Builder.Default
    private boolean marketingSmsEnabled = true;
    @Column(name = "marketing_push_enabled")
    @Builder.Default
    private boolean marketingPushEnabled = true;
    @Column(name = "order_updates_enabled")
    @Builder.Default
    private boolean orderUpdatesEnabled = true;
    @Column(name = "promotional_offers_enabled")
    @Builder.Default
    private boolean promotionalOffersEnabled = true;
}