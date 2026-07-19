package com.kartezy.notificationservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification_preferences", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private boolean pushEnabled;

    @Column(nullable = false)
    private boolean emailEnabled;

    @Column(nullable = false)
    private boolean smsEnabled;

    @Column(nullable = false)
    private boolean orderNotifications;

    @Column(nullable = false)
    private boolean paymentNotifications;

    @Column(nullable = false)
    private boolean walletNotifications;

    @Column(nullable = false)
    private boolean promotionalNotifications;

    @Column(nullable = false)
    private boolean systemNotifications;

    @Column(length = 500)
    private String pushToken;

    @Column(length = 500)
    private String deviceId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private boolean doNotDisturb;

    private LocalDateTime dndStartTime;

    private LocalDateTime dndEndTime;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        pushEnabled = true; emailEnabled = true; smsEnabled = true;
        orderNotifications = true; paymentNotifications = true;
        walletNotifications = true; promotionalNotifications = true;
        systemNotifications = true;
        doNotDisturb = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
