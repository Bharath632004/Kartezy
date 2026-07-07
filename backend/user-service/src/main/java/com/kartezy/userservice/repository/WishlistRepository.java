package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.CustomerProfile;
import com.kartezy.userservice.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for managing Wishlist entities.
 */
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID>, JpaSpecificationExecutor<Wishlist> {

    List<Wishlist> findByCustomerProfileId(UUID customerProfileId);
}
