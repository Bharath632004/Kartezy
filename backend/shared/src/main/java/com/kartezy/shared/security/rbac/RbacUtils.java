package com.kartezy.shared.security.rbac;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collection;

/**
 * Utility class for checking roles and permissions using Spring Security.
 */
public class RbacUtils {

    private RbacUtils() {
        // Prevent instantiation
    }

    /**
     * Checks if the current authenticated user has the given role.
     *
     * @param role the role to check (e.g., "ADMIN", "USER")
     * @return true if the user has the role, false otherwise
     */
    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String roleWithPrefix = "ROLE_" + role;
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(roleWithPrefix));
    }

    /**
     * Checks if the current authenticated user has the given permission.
     * <p>
     * This method checks for an authority that exactly matches the permission string.
     * It does not add the "ROLE_" prefix.
     * </p>
     *
     * @param permission the permission to check (e.g., "READ_USER", "WRITE_ORDER")
     * @return true if the user has the permission, false otherwise
     */
    public static boolean hasPermission(String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(permission));
    }

    /**
     * Checks if the current authenticated user has any of the given roles.
     *
     * @param roles the roles to check
     * @return true if the user has at least one of the roles, false otherwise
     */
    public static boolean hasAnyRole(String... roles) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        for (String role : roles) {
            String roleWithPrefix = "ROLE_" + role;
            if (authentication.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(roleWithPrefix))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the current authenticated user has any of the given permissions.
     *
     * @param permissions the permissions to check
     * @return true if the user has at least one of the permissions, false otherwise
     */
    public static boolean hasAnyPermission(String... permissions) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        for (String permission : permissions) {
            if (authentication.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(permission))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the current authenticated user's principal (username or user ID).
     *
     * @return the principal, or null if not authenticated
     */
    public static Object getPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return authentication.getPrincipal();
    }

    /**
     * Gets the authorities of the current authenticated user.
     *
     * @return a collection of granted authorities, or empty if not authenticated
     */
    public static Collection<? extends GrantedAuthority> getAuthorities() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return java.util.Collections.emptyList();
        }
        return authentication.getAuthorities();
    }
}