package com.kartezy.adminservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "admin_actions", indexes = {
    @Index(name = "idx_admin_action_admin_id", columnList = "adminId"),
    @Index(name = "idx_admin_action_type", columnList = "actionType"),
    @Index(name = "idx_admin_action_target", columnList = "targetType")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID adminId;

    @Column(nullable = false, length = 50)
    private String actionType;

    @Column(length = 100)
    private String targetType;

    private UUID targetId;

    @Column(length = 500)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(length = 50)
    private String severity;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 45)
    private String ipAddress;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (severity == null) severity = "INFO";
    }
}
