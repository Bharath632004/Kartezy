package com.kartezy.auditservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDto {
    private UUID id;

    @NotNull
    private UUID userId;

    @NotBlank @Size(max = 100)
    private String action;

    @NotBlank @Size(max = 100)
    private String resourceType;

    @NotNull
    private UUID resourceId;

    private String details;

    @Size(max = 50)
    private String ipAddress;

    private String userAgent;

    @NotBlank
    private String status;

    private LocalDateTime createdAt;
}
