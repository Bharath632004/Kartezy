package com.kartezy.supportservice.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "support_tickets", indexes = {
    @Index(name = "idx_ticket_user", columnList = "userId"),
    @Index(name = "idx_ticket_status", columnList = "status"),
    @Index(name = "idx_ticket_priority", columnList = "priority"),
    @Index(name = "idx_ticket_assigned", columnList = "assignedTo")
})
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Ticket {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, unique = true, length = 50)
    private String ticketNumber;
    @Column(nullable = false)
    private UUID userId;
    @Column(length = 100)
    private String userEmail;
    @Column(length = 100)
    private String userName;
    @Column(nullable = false, length = 200)
    private String subject;
    @Column(nullable = false, length = 5000)
    private String description;
    @Column(length = 30)
    private String category;
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TicketPriority priority;
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TicketStatus status;
    private UUID assignedTo;
    @Column(length = 100)
    private String assignedToName;
    private LocalDateTime assignedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    @Column(length = 500)
    private String resolution;
    @Column(nullable = false)
    private int satisfactionRating;
    private LocalDateTime slaDeadline;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now();
        status = TicketStatus.OPEN; priority = TicketPriority.MEDIUM;
        ticketNumber = "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum TicketPriority { LOW, MEDIUM, HIGH, URGENT }
    public enum TicketStatus { OPEN, IN_PROGRESS, PENDING, RESOLVED, CLOSED }
}
