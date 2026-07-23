package com.kartezy.reviewservice.repository;

import com.kartezy.reviewservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByProductIdAndStatusOrderByCreatedAtDesc(UUID productId, String status);
    List<Review> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Review> findByStatusOrderByCreatedAtDesc(String status);
    Optional<Review> findByUserIdAndProductIdAndOrderId(UUID userId, UUID productId, UUID orderId);
    boolean existsByUserIdAndProductIdAndOrderId(UUID userId, UUID productId, UUID orderId);
    double averageRatingByProductIdAndStatus(UUID productId, String status);
    long countByProductIdAndStatus(UUID productId, String status);
}
