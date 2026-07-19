package com.kartezy.authservice.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendOtpRequest {
    @NotBlank
    private String contact; // email or phone number
    @NotBlank
    private String purpose; // e.g., EMAIL_VERIFICATION, PHONE_VERIFICATION, PASSWORD_RESET
}