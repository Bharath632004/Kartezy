package com.kartezy.authservice.dto;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    // User info
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
}