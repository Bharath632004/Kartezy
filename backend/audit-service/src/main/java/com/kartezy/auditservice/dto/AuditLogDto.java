package com.kartezy.auditservice.dto;

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
    private UUID userId;
    private String action;
    private String resourceType;
    private UUID resourceId;
    private String details;
    private String ipAddress;
    private String userAgent;
    private String status;
    private LocalDateTime createdAt;
}
