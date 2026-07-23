package com.kartezy.supportservice.dto;

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
    private UUID userId;
    private String subject;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String source;
    private UUID orderId;
    private String orderNumber;
    private String resolution;
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}
