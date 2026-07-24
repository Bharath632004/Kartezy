package com.kartezy.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public sealed interface MfaRequest {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    final class EnrollRequest implements MfaRequest {
        @NotBlank
        private String deviceName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    final class VerifyRequest implements MfaRequest {
        @NotBlank
        private java.util.UUID deviceId;

        @NotBlank
        @Size(min = 6, max = 6)
        private String code;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    final class ValidateRequest implements MfaRequest {
        @NotBlank
        @Size(min = 6, max = 6)
        private String code;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    final class BackupCodeRequest implements MfaRequest {
        @NotBlank
        @Size(min = 9, max = 11)
        private String backupCode;
    }
}
