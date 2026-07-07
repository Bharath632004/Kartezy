package com.kartezy.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

/**
 * Data Transfer Object for UserPreference entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreferenceDto {

    private UUID id;

    @NotNull
    private UUID customerProfileId;

    private boolean notificationSound = true;

    private boolean vibrationEnabled = true;

    private boolean autoPlayVideos = true;

    private boolean dataSaverMode = false;

    private boolean autoUpdate = true;

    private boolean helpTipsEnabled = true;

    private boolean orderNotifications = true;

    private boolean promotionalNotifications = true;

    private boolean newsletterSubscription = false;
}
