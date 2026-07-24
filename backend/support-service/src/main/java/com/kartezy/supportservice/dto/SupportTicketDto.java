package com.kartezy.supportservice.dto;

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
public class SupportTicketDto {
    private UUID id;

    @NotNull
    private UUID userId;

    @NotBlank @Size(max = 300)
    private String subject;

    @NotBlank
    private String description;

    @NotBlank @Size(max = 100)
    private String category;

    @NotBlank
    private String priority;

    @NotBlank
    private String status;

    @Size(max = 50)
    private String source;

    private UUID orderId;

    private String orderNumber;

    private String resolution;

    private String assignedTo;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime resolvedAt;
}
