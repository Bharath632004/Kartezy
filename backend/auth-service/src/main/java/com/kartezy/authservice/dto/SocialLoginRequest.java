package com.kartezy.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialLoginRequest {
    @NotBlank
    private String provider; // "google", "apple", "facebook"

    @NotBlank
    private String providerToken; // OAuth access token or ID token

    private String email;
    private String firstName;
    private String lastName;

    @NotBlank
    private String providerUserId; // User ID from the provider
}
