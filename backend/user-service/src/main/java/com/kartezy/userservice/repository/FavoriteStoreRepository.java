package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.FavoriteStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for managing FavoriteStore entities.
 */
@Repository
public interface FavoriteStoreRepository extends JpaRepository<FavoriteStore, UUID>, JpaSpecificationExecutor<FavoriteStore> {
}