package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

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

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "email_enabled")
    private boolean emailEnabled = true;

    @Column(name = "sms_enabled")
    private boolean smsEnabled = true;

    @Column(name = "push_enabled")
    private boolean pushEnabled = true;

    @Column(name = "marketing_emails_enabled")
    private boolean marketingEmailsEnabled = true;

    @Column(name = "marketing_sms_enabled")
    private boolean marketingSmsEnabled = true;

    @Column(name = "marketing_push_enabled")
    private boolean marketingPushEnabled = true;

    @Column(name = "order_updates_enabled")
    private boolean orderUpdatesEnabled = true;

    @Column(name = "promotional_offers_enabled")
    private boolean promotionalOffersEnabled = true;
}