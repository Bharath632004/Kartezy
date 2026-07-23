package com.kartezy.adminservice.dto;

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
public class AdminActionDto {
    private UUID id;
    private UUID adminId;
    private String actionType;
    private String targetType;
    private UUID targetId;
    private String description;
    private String details;
    private String severity;
    private LocalDateTime timestamp;
}
