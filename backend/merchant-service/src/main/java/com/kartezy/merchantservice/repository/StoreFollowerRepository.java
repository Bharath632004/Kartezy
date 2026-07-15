package com.kartezy.merchantservice.repository;

import com.kartezy.merchantservice.entity.StoreFollower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreFollowerRepository extends JpaRepository<StoreFollower, UUID> {
    List<StoreFollower> findByStoreId(UUID storeId);
    List<StoreFollower> findByUserId(UUID userId);
    Optional<StoreFollower> findByStoreIdAndUserId(UUID storeId, UUID userId);
    long countByStoreId(UUID storeId);
}
