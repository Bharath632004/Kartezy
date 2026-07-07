package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.CustomerProfile;
import com.kartezy.userservice.entity.ReferralReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for managing ReferralReward entities.
 */
@Repository
public interface ReferralRewardRepository extends JpaRepository<ReferralReward, UUID>, JpaSpecificationExecutor<ReferralReward> {

    Optional<ReferralReward> findByCustomerProfileId(UUID customerProfileId);
}
