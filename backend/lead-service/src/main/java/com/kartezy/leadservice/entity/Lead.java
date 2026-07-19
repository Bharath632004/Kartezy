package com.kartezy.leadservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "leads")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "source", nullable = false)
    private String source;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private LeadStatus status;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(length = 2000)
    private String notes;

    @Column(name = "converted_to_user_id")
    private UUID convertedToUserId;

    @Column(name = "score")
    private Integer score;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
