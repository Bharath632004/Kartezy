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
