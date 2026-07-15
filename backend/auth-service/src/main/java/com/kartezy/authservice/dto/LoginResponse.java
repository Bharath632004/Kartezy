package com.kartezy.authservice.dto;
import lombok.*;
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
}