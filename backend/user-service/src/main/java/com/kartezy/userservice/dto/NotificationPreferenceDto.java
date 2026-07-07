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

    private boolean emailEnabled = true;

    private boolean smsEnabled = true;

    private boolean pushEnabled = true;

    private boolean marketingEmailsEnabled = true;

    private boolean marketingSmsEnabled = true;

    private boolean marketingPushEnabled = true;

    private boolean orderUpdatesEnabled = true;

    private boolean promotionalOffersEnabled = true;
}
