package com.kartezy.supportservice.dto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TicketMessageDto {
    private UUID id; private UUID senderId; private String senderName;
    private String senderType; private String message; private String attachmentUrl;
    private LocalDateTime createdAt;
}
