package com.kartezy.reviewservice.repository;

import com.kartezy.reviewservice.entity.Review;
import com.kartezy.reviewservice.entity.Review.ReviewStatus;
import com.kartezy.reviewservice.entity.Review.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(TargetType targetType, UUID targetId);
    List<Review> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Review> findByStatus(ReviewStatus status);
    Optional<Review> findByUserIdAndTargetTypeAndTargetId(UUID userId, TargetType targetType, UUID targetId);
    long countByTargetTypeAndTargetId(TargetType targetType, UUID targetId);
    long countByStatus(ReviewStatus status);
}

