package com.kartezy.authservice.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyOtpRequest {
    @NotBlank
    private String otp;
    @NotBlank
    private String purpose; // e.g., EMAIL_VERIFICATION, PHONE_VERIFICATION, PASSWORD_RESET
}