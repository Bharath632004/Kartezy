package com.kartezy.authservice.dto;

import lombok.*;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private long expiresIn;
    // User info
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    // MFA fields
    private boolean mfaRequired;
    private String mfaSessionToken;
    // Roles
    @Builder.Default
    private Set<String> roles = new java.util.HashSet<>();
}