package com.kartezy.reviewservice.repository;

import com.kartezy.reviewservice.entity.RatingSummary;
import com.kartezy.reviewservice.entity.Review.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RatingSummaryRepository extends JpaRepository<RatingSummary, UUID> {
    Optional<RatingSummary> findByTargetTypeAndTargetId(TargetType targetType, UUID targetId);
}
