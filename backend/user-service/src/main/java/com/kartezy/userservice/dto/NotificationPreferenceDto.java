package com.kartezy.userservice.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.UUID;
/**
 * Data Transfer Object for NotificationPreference entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreferenceDto {
    private UUID id;
    @NotNull
    private UUID customerProfileId;
    @Builder.Default
    private boolean emailEnabled = true;
    @Builder.Default
    private boolean smsEnabled = true;
    @Builder.Default
    private boolean pushEnabled = true;
    @Builder.Default
    private boolean marketingEmailsEnabled = true;
    @Builder.Default
    private boolean marketingSmsEnabled = true;
    @Builder.Default
    private boolean marketingPushEnabled = true;
    @Builder.Default
    private boolean orderUpdatesEnabled = true;
    @Builder.Default
    private boolean promotionalOffersEnabled = true;
}
