package com.kartezy.shared.security.rbac;

import java.util.Set;

/**
 * Repository interface for fetching user roles.
 * Implementations can fetch from database, cache, or external service.
 * This replaces the hardcoded stub in PolicyEngine for production use.
 */
public interface UserRoleRepository {

    /**
     * Get all roles assigned to a user.
     */
    Set<String> getUserRoles(String userId);

    /**
     * Get all permissions assigned to a user (direct + via roles).
     */
    Set<String> getUserPermissions(String userId);

    /**
     * Check if a user has a specific role.
     */
    default boolean hasRole(String userId, String role) {
        return getUserRoles(userId).contains(role);
    }

    /**
     * Check if a user has a specific permission.
     */
    default boolean hasPermission(String userId, String permission) {
        return getUserPermissions(userId).contains(permission);
    }
}
