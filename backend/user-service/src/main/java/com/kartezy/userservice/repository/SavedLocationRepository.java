package com.kartezy/userservice.repository;

import com.kartezy.userservice.entity.CustomerProfile;
import com.kartezy/userservice.entity.SavedLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for managing SavedLocation entities.
 */
@Repository
public interface SavedLocationRepository extends JpaRepository<SavedLocation, UUID>, JpaSpecificationExecutor<SavedLocation> {

    java.util.List<SavedLocation> findByCustomerProfileId(UUID customerProfileId);
}
