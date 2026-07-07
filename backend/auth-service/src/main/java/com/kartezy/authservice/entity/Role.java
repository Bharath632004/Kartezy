package com.kartezy.authservice.entity;

import com.kartezy.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Role entity representing a user's role (e.g., ADMIN, CUSTOMER).
 */
@Entity
@Table(name = "roles", uniqueConstraints = @UniqueConstraint(columnNames = {"name"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends AuditableEntity {

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    // Many-to-Many with Permission (via join table role_permissions)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    // Convenience methods
    public void addPermission(Permission permission) {
        this.permissions.add(permission);
        permission.getRoles().add(this);
    }

    public void removePermission(Permission permission) {
        this.permissions.remove(permission);
        permission.getRoles().remove(this);
    }
}