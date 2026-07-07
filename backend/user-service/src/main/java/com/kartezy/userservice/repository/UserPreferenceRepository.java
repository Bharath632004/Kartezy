package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.CustomerProfile;
import com.kartezy.userservice.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for managing UserPreference entities.
 */
@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, UUID>, JpaSpecificationExecutor<UserPreference> {

    Optional<UserPreference> findByCustomerProfileId(UUID customerProfileId);
}
