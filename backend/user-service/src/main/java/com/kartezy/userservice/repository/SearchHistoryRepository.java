package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.CustomerProfile;
import com.kartezy.userservice.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for managing SearchHistory entities.
 */
@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, UUID>, JpaSpecificationExecutor<SearchHistory> {

    java.util.List<SearchHistory> findByCustomerProfileId(UUID customerProfileId);
}
