package com.kartezy.finance.entity;

import com.kartezy.finance.constants.AuditAction;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_al_entity", columnList = "entityType,entityId"),
    @Index(name = "idx_al_action", columnList = "action"),
    @Index(name = "idx_al_user", columnList = "performedBy"),
    @Index(name = "idx_al_timestamp", columnList = "performedAt")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 30)
    private AuditAction action;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "entity_number", length = 100)
    private String entityNumber;

    @Column(name = "performed_by", nullable = false, length = 100)
    private String performedBy;

    @Column(name = "performed_at", nullable = false)
    private java.time.LocalDateTime performedAt;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "changes_summary", length = 2000)
    private String changesSummary;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "is_system_generated")
    private boolean isSystemGenerated;

    @Column(name = "request_id", length = 100)
    private String requestId;

    @Column(name = "session_id", length = 100)
    private String sessionId;
}
