package com.kartezy.adminservice.dto;

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
public class AdminActionDto {
    private UUID id;

    @NotNull
    private UUID adminId;

    @NotBlank @Size(max = 100)
    private String actionType;

    @NotBlank @Size(max = 100)
    private String targetType;

    @NotNull
    private UUID targetId;

    @NotBlank @Size(max = 500)
    private String description;

    private String details;

    @NotBlank
    private String severity;

    private LocalDateTime timestamp;
}
