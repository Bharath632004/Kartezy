package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.FavoriteProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for managing FavoriteProduct entities.
 */
@Repository
public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, UUID>, JpaSpecificationExecutor<FavoriteProduct> {
}