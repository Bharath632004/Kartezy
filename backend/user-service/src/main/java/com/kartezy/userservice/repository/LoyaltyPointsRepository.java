package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.LoyaltyPoints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for managing LoyaltyPoints entities.
 */
@Repository
public interface LoyaltyPointsRepository extends JpaRepository<LoyaltyPoints, UUID>, JpaSpecificationExecutor<LoyaltyPoints> {
}