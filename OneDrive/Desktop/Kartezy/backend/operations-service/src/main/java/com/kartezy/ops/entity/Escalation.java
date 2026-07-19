package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "escalations", indexes = {
    @Index(name = "idx_esc_ticket", columnList = "ticket_id"),
    @Index(name = "idx_esc_level", columnList = "escalationLevel"),
    @Index(name = "idx_esc_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Escalation extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private SupportTicket ticket;

    private Long incidentId;

    @Column(nullable = false)
    private String escalationLevel;

    @Size(max = 100)
    private String escalatedBy;

    @Size(max = 100)
    private String escalatedTo;

    private LocalDateTime escalatedAt;

    @Column(length = 2000)
    private String reason;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING";

    private LocalDateTime acknowledgedAt;

    @Column(length = 2000)
    private String resolution;

    private LocalDateTime resolvedAt;

    @Builder.Default
    private Boolean isActive = true;
}
