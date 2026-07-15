package com.kartezy.userservice.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.UUID;
/**
 * Data Transfer Object for LanguagePreference entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguagePreferenceDto {
    private UUID id;
    @NotNull
    private UUID customerProfileId;
    @NotBlank
    @Size(max = 10)
    private String languageCode; // e.g., en, es, fr
    @NotBlank
    @Size(max = 50)
    private String languageName; // e.g., English, Spanish, French
    @NotBlank
    @Size(max = 10)
    private String countryCode; // e.g., US, ES, FR
    @NotBlank
    @Size(max = 50)
    private String countryName; // e.g., United States, Spain, France
}
