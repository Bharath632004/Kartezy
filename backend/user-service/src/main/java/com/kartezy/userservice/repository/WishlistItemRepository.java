package com.kartezy.userservice.repository;
import com.kartezy.userservice.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;
/**
 * Repository for managing WishlistItem entities.
 */
@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID>, JpaSpecificationExecutor<WishlistItem> {
    java.util.List<WishlistItem> findByWishlistId(UUID wishlistId);
}
