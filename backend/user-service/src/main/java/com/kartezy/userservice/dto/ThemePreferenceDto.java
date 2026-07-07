package com.kartezy.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

/**
 * Data Transfer Object for ThemePreference entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThemePreferenceDto {

    private UUID id;

    @NotNull
    private UUID customerProfileId;

    @NotBlank
    @Size(max = 20)
    private String theme; // e.g., LIGHT, DARK, SYSTEM

    @NotBlank
    @Size(max = 20)
    private String accentColor; // e.g., BLUE, GREEN, RED, PURPLE

    private boolean systemThemeEnabled = false;

    private boolean autoDarkMode = false;
}
