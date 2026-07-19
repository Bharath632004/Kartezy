package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sla_records", indexes = {
    @Index(name = "idx_sla_entity", columnList = "entityType,entityId"),
    @Index(name = "idx_sla_status", columnList = "slaStatus"),
    @Index(name = "idx_sla_type", columnList = "slaType"),
    @Index(name = "idx_sla_deadline", columnList = "deadlineAt")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SlaRecord extends BaseEntity {
    @Column(nullable = false)
    private String slaType;

    @Column(nullable = false)
    private String entityType;

    @Column(nullable = false)
    private Long entityId;

    @Column(nullable = false)
    private Integer thresholdMinutes;

    private LocalDateTime startedAt;
    private LocalDateTime deadlineAt;
    private LocalDateTime completedAt;

    @Column(nullable = false)
    private String slaStatus;

    @Builder.Default
    private Integer breachedMinutes = 0;

    @Size(max = 500)
    private String notes;

    @Builder.Default
    private Boolean isActive = true;
}
