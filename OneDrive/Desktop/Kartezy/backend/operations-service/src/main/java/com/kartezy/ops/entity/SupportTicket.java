package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets", indexes = {
    @Index(name = "idx_ticket_customer", columnList = "customerId"),
    @Index(name = "idx_ticket_merchant", columnList = "merchantId"),
    @Index(name = "idx_ticket_status", columnList = "status"),
    @Index(name = "idx_ticket_priority", columnList = "priority"),
    @Index(name = "idx_ticket_assigned", columnList = "assignedTo")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SupportTicket extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String ticketNumber;

    private Long customerId;
    private Long merchantId;
    private Long orderId;

    @NotBlank @Size(max = 200)
    @Column(nullable = false)
    private String subject;

    @NotBlank @Column(nullable = false, length = 5000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private String status;

    @Size(max = 100)
    private String assignedTo;

    private LocalDateTime assignedAt;
    private LocalDateTime firstResponseAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime slaDeadline;

    @Builder.Default
    private Boolean slaBreached = false;

    @Column(length = 5000)
    private String resolution;

    @Builder.Default
    private Integer customerSatisfactionScore = 0;

    @Column(length = 1000)
    private String customerFeedback;

    @Builder.Default
    private Integer escalationCount = 0;

    @Builder.Default
    private Boolean isActive = true;
}
