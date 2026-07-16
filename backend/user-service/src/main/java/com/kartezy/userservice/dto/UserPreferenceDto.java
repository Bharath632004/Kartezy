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
    @Builder.Default
    private boolean notificationSound = true;
    @Builder.Default
    private boolean vibrationEnabled = true;
    @Builder.Default
    private boolean autoPlayVideos = true;
    @Builder.Default
    private boolean dataSaverMode = false;
    @Builder.Default
    private boolean autoUpdate = true;
    @Builder.Default
    private boolean helpTipsEnabled = true;
    @Builder.Default
    private boolean orderNotifications = true;
    @Builder.Default
    private boolean promotionalNotifications = true;
    @Builder.Default
    private boolean newsletterSubscription = false;
}
