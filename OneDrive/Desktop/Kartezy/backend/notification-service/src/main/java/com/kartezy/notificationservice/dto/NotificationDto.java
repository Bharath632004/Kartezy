package com.kartezy.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private UUID id;
    private UUID userId;
    private String type;
    private String channel;
    private String title;
    private String body;
    private String imageUrl;
    private String actionUrl;
    private boolean isRead;
    private LocalDateTime readAt;
    private String status;
    private LocalDateTime createdAt;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class NotificationPreferenceDto {
    private UUID id;
    private UUID userId;
    private boolean pushEnabled;
    private boolean emailEnabled;
    private boolean smsEnabled;
    private boolean orderNotifications;
    private boolean paymentNotifications;
    private boolean walletNotifications;
    private boolean promotionalNotifications;
    private boolean systemNotifications;
    private boolean doNotDisturb;
    private LocalDateTime dndStartTime;
    private LocalDateTime dndEndTime;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class SendNotificationRequestDto {
    private UUID userId;
    private String type;
    private String channel;
    private String title;
    private String body;
    private String imageUrl;
    private String actionUrl;
    private String dataPayload;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class NotificationTemplateDto {
    private UUID id;
    private String type;
    private String channel;
    private String titleTemplate;
    private String bodyTemplate;
    private boolean isActive;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class UnreadCountDto {
    private long count;
}
