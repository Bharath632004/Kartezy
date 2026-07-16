package com.kartezy.supportservice.dto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TicketDto {
    private UUID id; private String ticketNumber; private UUID userId;
    private String userEmail; private String userName; private String subject;
    private String description; private String category; private String priority;
    private String status; private UUID assignedTo; private String assignedToName;
    private LocalDateTime assignedAt; private LocalDateTime resolvedAt;
    private String resolution; private int satisfactionRating;
    private LocalDateTime slaDeadline; private LocalDateTime createdAt;
    private List<TicketMessageDto> messages;
}
