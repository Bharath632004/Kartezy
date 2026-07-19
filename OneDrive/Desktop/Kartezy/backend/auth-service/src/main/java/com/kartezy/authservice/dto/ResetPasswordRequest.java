package com.kartezy.authservice.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordRequest {
    @NotBlank
    private String token; // OTP or reset token
    @NotBlank
    @Size(min = 8, max = 100)
    private String newPassword;
}