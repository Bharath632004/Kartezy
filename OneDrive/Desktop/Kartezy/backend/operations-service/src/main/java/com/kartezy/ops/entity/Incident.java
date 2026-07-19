package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents", indexes = {
    @Index(name = "idx_inc_severity", columnList = "severity"),
    @Index(name = "idx_inc_status", columnList = "status"),
    @Index(name = "idx_inc_category", columnList = "category"),
    @Index(name = "idx_inc_reported", columnList = "reportedAt")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Incident extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String incidentNumber;

    @NotBlank @Size(max = 200)
    @Column(nullable = false)
    private String title;

    @NotBlank @Column(nullable = false, length = 5000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String severity;

    @Column(nullable = false)
    private String status;

    @Size(max = 100)
    private String reportedBy;

    private LocalDateTime reportedAt;

    @Size(max = 100)
    private String assignedTo;

    private LocalDateTime acknowledgedAt;

    @Builder.Default
    private Integer affectedCustomers = 0;

    @Builder.Default
    private Integer affectedOrders = 0;

    @Column(length = 5000)
    private String rootCause;

    @Column(length = 5000)
    private String resolution;

    private LocalDateTime resolvedAt;

    @Column(length = 2000)
    private String lessons;

    @Builder.Default
    private Boolean isActive = true;
}
