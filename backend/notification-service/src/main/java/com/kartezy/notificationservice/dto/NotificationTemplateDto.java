package com.kartezy.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTemplateDto {
    private UUID id;
    private String type;
    private String channel;
    private String titleTemplate;
    private String bodyTemplate;
    private boolean isActive;
}
