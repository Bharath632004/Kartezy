package com.kartezy.shared.enterprise.franchise;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Franchise management service for multi-franchise operations.
 * Handles franchise lifecycle, royalty calculations, and compliance.
 */
@Slf4j
@Service
public class FranchiseService {

    private final Map<String, Franchise> franchises = new ConcurrentHashMap<>();

    /**
     * Register a new franchise.
     */
    public Franchise registerFranchise(Franchise franchise) {
        franchise.setStatus(Franchise.FranchiseStatus.PENDING);
        franchises.put(franchise.getFranchiseId(), franchise);
        log.info("New franchise registered: {} ({})", franchise.getName(), franchise.getFranchiseId());
        return franchise;
    }

    /**
     * Activate a franchise after onboarding.
     */
    public void activateFranchise(String franchiseId) {
        Franchise franchise = franchises.get(franchiseId);
        if (franchise != null) {
            franchise.setStatus(Franchise.FranchiseStatus.ACTIVE);
            log.info("Franchise activated: {}", franchiseId);
        }
    }

    /**
     * Calculate commission for a franchise order.
     */
    public java.math.BigDecimal calculateCommission(String franchiseId, java.math.BigDecimal orderAmount) {
        Franchise franchise = franchises.get(franchiseId);
        if (franchise == null) return java.math.BigDecimal.ZERO;

        return orderAmount.multiply(franchise.getCommissionPercentage())
                .divide(java.math.BigDecimal.valueOf(100));
    }

    /**
     * Get all franchises for a tenant.
     */
    public Set<Map.Entry<String, Franchise>> getTenantFranchises(String tenantId) {
        return franchises.entrySet().stream()
                .filter(e -> e.getValue().getTenantId().equals(tenantId))
                .collect(java.util.stream.Collectors.toSet());
    }

    /**
     * Get serviceable cities across all active franchises.
     */
    public Set<String> getServiceableCities() {
        return franchises.values().stream()
                .filter(Franchise::isOperational)
                .flatMap(f -> f.getServiceableCities().stream())
                .collect(java.util.stream.Collectors.toSet());
    }

    /**
     * Check if a pincode is serviceable by any franchise.
     */
    public boolean isPincodeServiceable(String pincode) {
        return franchises.values().stream()
                .filter(Franchise::isOperational)
                .anyMatch(f -> f.getServiceablePincodes().contains(pincode));
    }
}
