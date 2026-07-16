package com.kartezy.supportservice.dto;
import lombok.*;
import java.util.UUID;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateTicketRequest {
    private UUID userId; private String userEmail; private String userName;
    private String subject; private String description; private String category;
    private String priority;
}
