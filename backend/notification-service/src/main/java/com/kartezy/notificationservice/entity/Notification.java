package com.kartezy.notificationservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notif_user_id", columnList = "userId"),
    @Index(name = "idx_notif_type", columnList = "type"),
    @Index(name = "idx_notif_status", columnList = "status"),
    @Index(name = "idx_notif_read", columnList = "isRead"),
    @Index(name = "idx_notif_created", columnList = "createdAt")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private NotificationChannel channel;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 2000)
    private String body;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String actionUrl;

    @Column(length = 2000)
    private String dataPayload;

    @Column(nullable = false)
    private boolean isRead;

    private LocalDateTime readAt;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    @Column(length = 500)
    private String failureReason;

    private LocalDateTime sentAt;

    private LocalDateTime deliveredAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = NotificationStatus.PENDING;
        if (isRead == false) isRead = false;
    }

    public enum NotificationType {
        ORDER_CONFIRMED, ORDER_PICKED_UP, ORDER_OUT_FOR_DELIVERY, ORDER_DELIVERED,
        ORDER_CANCELLED, ORDER_REFUNDED,
        PAYMENT_SUCCESS, PAYMENT_FAILED, PAYMENT_REFUNDED,
        WALLET_CREDIT, WALLET_DEBIT, WALLET_LOW_BALANCE,
        PROMOTIONAL, COUPON_RECEIVED, COUPON_EXPIRING,
        CASHBACK_EARNED, REFERRAL_REWARD,
        DELIVERY_ASSIGNED, DELIVERY_UPDATE,
        SYSTEM_ALERT, SECURITY_ALERT,
        MERCHANT_APPROVED, MERCHANT_REJECTED,
        DRIVER_APPROVED, DRIVER_REJECTED,
        INVENTORY_LOW_STOCK, INVENTORY_OUT_OF_STOCK
    }

    public enum NotificationChannel { IN_APP, PUSH, EMAIL, SMS }
    public enum NotificationStatus { PENDING, SENT, DELIVERED, READ, FAILED }
}
