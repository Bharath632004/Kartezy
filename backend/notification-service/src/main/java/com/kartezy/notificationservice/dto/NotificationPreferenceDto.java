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
public class NotificationPreferenceDto {
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
