package com.kartezy.authservice.entity;
import com.kartezy.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
/**
 * Association between User and Role with audit timestamps.
 */
@Entity
@Table(name = "user_roles", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "role_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRole extends AuditableEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
    // We can add assignedBy (user who assigned) if needed, but for now keep simple.
}