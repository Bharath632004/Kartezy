package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.CustomerProfile;
import com.kartezy.userservice.entity.ThemePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for managing ThemePreference entities.
 */
@Repository
public interface ThemePreferenceRepository extends JpaRepository<ThemePreference, UUID>, JpaSpecificationExecutor<ThemePreference> {

    Optional<ThemePreference> findByCustomerProfileId(UUID customerProfileId);
}
