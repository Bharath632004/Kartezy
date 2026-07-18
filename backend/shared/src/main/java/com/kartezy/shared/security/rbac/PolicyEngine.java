package com.kartezy.shared.security.rbac;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BiPredicate;
import java.util.stream.Collectors;


/**
 * Attribute-Based Access Control (ABAC) Policy Engine.
 * Supports fine-grained access policies based on:
 * - Subject attributes (user role, department, clearance)
 * - Resource attributes (type, classification, owner)
 * - Action attributes (read, write, delete, admin)
 * - Environment attributes (time, location, device)
 * - Context attributes (tenant, IP range, auth method)
 */
@Slf4j
@Service
public class PolicyEngine {

    private final Map<String, Policy> policies = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> roleHierarchy = new ConcurrentHashMap<>();

    // Role repository for production use - inject via constructor
    private UserRoleRepository roleRepository;

    public PolicyEngine() {
        this(null);
    }

    public PolicyEngine(UserRoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Set the role repository (for dependency injection).
     */
    public void setRoleRepository(UserRoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @PostConstruct
    public void init() {
        initializeDefaultPolicies();
        initializeRoleHierarchy();
        log.info("PolicyEngine initialized with {} policies", policies.size());
    }

    /**
     * Evaluate if access should be granted based on context.
     */
    public boolean evaluate(AccessContext context) {
        // Find matching policies
        List<Policy> matchingPolicies = findMatchingPolicies(context);

        if (matchingPolicies.isEmpty()) {
            log.debug("No matching policies for: {} -> {}:{}",
                    context.getSubject(), context.getResource(), context.getAction());
            return false; // Default deny
        }

        // Evaluate policies in priority order
        for (Policy policy : matchingPolicies) {
            boolean result = evaluatePolicy(policy, context);
            if (policy.getEffect() == Effect.DENY && result) {
                log.debug("Access DENIED by policy: {} for subject: {}",
                        policy.getPolicyId(), context.getSubject());
                return false; // Explicit deny overrides allow
            }
            if (policy.getEffect() == Effect.ALLOW && result) {
                log.debug("Access ALLOWED by policy: {} for subject: {}",
                        policy.getPolicyId(), context.getSubject());
                return true;
            }
        }

        return false; // Default deny
    }

    /**
     * Check if a user has a specific role (including inherited).
     */
    public boolean hasRole(String userId, String role) {
        Set<String> userRoles = getUserRoles(userId);

        // Direct role check
        if (userRoles.contains(role)) return true;

        // Check inherited roles
        return userRoles.stream()
                .anyMatch(r -> roleHierarchy.getOrDefault(r, Collections.emptySet())
                        .contains(role));
    }

    /**
     * Get all permissions for a user.
     */
    public Set<String> getUserPermissions(String userId) {
        Set<String> userRoles = getUserRoles(userId);
        return policies.values().stream()
                .filter(p -> p.getEffect() == Effect.ALLOW)
                .filter(p -> {
                    Set<String> requiredRoles = p.getConditions().getRoles();
                    return requiredRoles == null || requiredRoles.isEmpty() ||
                            userRoles.stream().anyMatch(requiredRoles::contains);
                })
                .map(Policy::getPermission)
                .collect(Collectors.toSet());
    }

    /**
     * Register a new policy.
     */
    public void addPolicy(Policy policy) {
        policies.put(policy.getPolicyId(), policy);
        log.info("Policy added: {} - {}", policy.getPolicyId(), policy.getDescription());
    }

    /**
     * Evaluate if a policy matches and returns the expected effect.
     */
    private boolean evaluatePolicy(Policy policy, AccessContext context) {
        PolicyConditions conditions = policy.getConditions();

        // Check resource type
        if (conditions.getResourceType() != null &&
                !conditions.getResourceType().equals(context.getResourceType())) {
            return false;
        }

        // Check action
        if (conditions.getActions() != null && !conditions.getActions().isEmpty() &&
                !conditions.getActions().contains(context.getAction())) {
            return false;
        }

        // Check roles
        if (conditions.getRoles() != null && !conditions.getRoles().isEmpty()) {
            Set<String> userRoles = getUserRoles(context.getSubject());
            if (userRoles.stream().noneMatch(conditions.getRoles()::contains)) {
                return false;
            }
        }

        // Check environment conditions
        if (conditions.getRequireMfa() && !context.isMfaEnabled()) {
            return false;
        }

        if (conditions.getMaxIpRiskScore() != null &&
                context.getIpRiskScore() != null &&
                context.getIpRiskScore() > conditions.getMaxIpRiskScore()) {
            return false;
        }

        if (conditions.getAllowedTenants() != null &&
                !conditions.getAllowedTenants().isEmpty() &&
                !conditions.getAllowedTenants().contains(context.getTenantId())) {
            return false;
        }

        // Check custom conditions
        if (conditions.getCustomEvaluator() != null) {
            return conditions.getCustomEvaluator().test(null, context);
        }

        return true;
    }

    private List<Policy> findMatchingPolicies(AccessContext context) {
        // Find policies that could match this resource/action
        return policies.values().stream()
                .filter(p -> p.getResource() == null ||
                        p.getResource().equals(context.getResource()) ||
                        (context.getResource() != null && context.getResource().startsWith(p.getResource())))
                .sorted(Comparator.comparingInt(Policy::getPriority).reversed())
                .collect(Collectors.toList());
    }

    private Set<String> getUserRoles(String userId) {
        if (roleRepository != null) {
            return roleRepository.getUserRoles(userId);
        }
        // Fallback: return default role when no repository configured
        return Set.of("CUSTOMER");
    }

    private void initializeDefaultPolicies() {
        // Admin full access
        addPolicy(Policy.builder()
                .policyId("ADMIN_FULL_ACCESS")
                .description("Administrators have full system access")
                .resource("**")
                .effect(Effect.ALLOW)
                .priority(100)
                .permission("ADMIN")
                .conditions(PolicyConditions.builder()
                        .roles(Set.of("SUPER_ADMIN", "ADMIN"))
                        .build())
                .build());

        // Customer access to own data
        addPolicy(Policy.builder()
                .policyId("CUSTOMER_OWN_DATA")
                .description("Customers can access their own data")
                .effect(Effect.ALLOW)
                .priority(50)
                .permission("READ_OWN")
                .conditions(PolicyConditions.builder()
                        .roles(Set.of("CUSTOMER"))
                        .actions(Set.of("READ", "UPDATE"))
                        .build())
                .build());

        // Merchant access to own business
        addPolicy(Policy.builder()
                .policyId("MERCHANT_OWN_BUSINESS")
                .description("Merchants can manage their own business")
                .effect(Effect.ALLOW)
                .priority(50)
                .permission("MANAGE_OWN")
                .conditions(PolicyConditions.builder()
                        .roles(Set.of("MERCHANT"))
                        .build())
                .build());

        // Sensitive operations require MFA
        addPolicy(Policy.builder()
                .policyId("SENSITIVE_OPS_MFA")
                .description("Sensitive operations require MFA")
                .resource("**")
                .effect(Effect.DENY)
                .priority(75)
                .permission("SENSITIVE")
                .conditions(PolicyConditions.builder()
                        .actions(Set.of("DELETE", "TRANSFER", "PAYOUT"))
                        .requireMfa(true)
                        .build())
                .build());
    }

    private void initializeRoleHierarchy() {
        roleHierarchy.put("SUPER_ADMIN", Set.of("ADMIN", "MANAGER", "USER"));
        roleHierarchy.put("ADMIN", Set.of("MANAGER", "USER"));
        roleHierarchy.put("MANAGER", Set.of("USER"));
        roleHierarchy.put("MERCHANT", Set.of("USER"));
        roleHierarchy.put("DELIVERY_PARTNER", Set.of("USER"));
        roleHierarchy.put("CUSTOMER", Set.of("USER"));
    }

    // ================================================================
    // Data Models
    // ================================================================

    @Data
    @Builder
    public static class Policy {
        private String policyId;
        private String description;
        private String resource;
        private String resourceType;
        private Effect effect;
        private int priority;
        private String permission;
        private PolicyConditions conditions;
    }

    @Data
    @Builder
    public static class PolicyConditions {
        private Set<String> roles;
        private Set<String> actions;
        private String resourceType;
        private Boolean requireMfa;
        private Integer maxIpRiskScore;
        private Set<String> allowedTenants;
        private Map<String, Object> customAttributes;
        private BiPredicate<Void, AccessContext> customEvaluator;
    }

    public enum Effect {
        ALLOW, DENY
    }

    @Data
    @Builder
    public static class AccessContext {
        private String subject;       // User ID
        private String resource;      // Resource path
        private String resourceType;  // Resource type (ORDER, PAYMENT, etc.)
        private String action;        // Action (READ, WRITE, DELETE, ADMIN)
        private String tenantId;      // Tenant context
        private boolean mfaEnabled;   // Whether MFA was used
        private Integer ipRiskScore;  // Risk score of IP (0-100)
        private String deviceId;      // Device identifier
        private String location;      // Geo-location
        private Map<String, Object> attributes; // Custom attributes
    }
}
