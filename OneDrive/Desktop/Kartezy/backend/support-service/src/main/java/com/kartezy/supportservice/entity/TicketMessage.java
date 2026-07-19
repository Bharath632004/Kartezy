package com.kartezy.supportservice.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ticket_messages", indexes = @Index(name = "idx_msg_ticket", columnList = "ticketId"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TicketMessage {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private UUID ticketId;
    @Column(nullable = false)
    private UUID senderId;
    @Column(length = 100)
    private String senderName;
    @Column(length = 20)
    private String senderType;
    @Column(nullable = false, length = 5000)
    private String message;
    @Column(length = 500)
    private String attachmentUrl;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}
