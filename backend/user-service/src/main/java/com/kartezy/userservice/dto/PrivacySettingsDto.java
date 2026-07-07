package com.kartezy.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

/**
 * Data Transfer Object for PrivacySettings entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivacySettingsDto {

    private UUID id;

    @NotNull
    private UUID customerProfileId;

    private boolean profileVisible = true;

    private boolean activityVisible = true;

    private boolean locationSharing = false;

    private boolean dataPersonalization = true;

    private boolean adPersonalization = true;

    private boolean showOnlineStatus = true;

    private boolean allowMessageFromEveryone = false;

    private boolean allowFriendRequestFromEveryone = false;
}
