package com.kartezy.authservice.entity;

import com.kartezy.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Permission entity representing an authority (e.g., READ_USER, WRITE_ORDER).
 */
@Entity
@Table(name = "permissions", uniqueConstraints = @UniqueConstraint(columnNames = {"name"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission extends AuditableEntity {

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    // Many-to-Many with Role (mappedBy)
    @ManyToMany(mappedBy = "permissions", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    // Convenience methods
    public void addRole(Role role) {
        this.roles.add(role);
        role.getPermissions().add(this);
    }

    public void removeRole(Role role) {
        this.roles.remove(role);
        role.getPermissions().remove(this);
    }
}