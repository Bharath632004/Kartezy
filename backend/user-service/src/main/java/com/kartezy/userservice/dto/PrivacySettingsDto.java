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
    @Builder.Default
    private boolean profileVisible = true;
    @Builder.Default
    private boolean activityVisible = true;
    @Builder.Default
    private boolean locationSharing = false;
    @Builder.Default
    private boolean dataPersonalization = true;
    @Builder.Default
    private boolean adPersonalization = true;
    @Builder.Default
    private boolean showOnlineStatus = true;
    @Builder.Default
    private boolean allowMessageFromEveryone = false;
    @Builder.Default
    private boolean allowFriendRequestFromEveryone = false;
}
