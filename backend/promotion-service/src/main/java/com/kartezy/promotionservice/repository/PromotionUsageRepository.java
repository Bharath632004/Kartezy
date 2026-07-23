package com.kartezy.promotionservice.repository;

import com.kartezy.promotionservice.entity.PromotionUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PromotionUsageRepository extends JpaRepository<PromotionUsage, UUID> {
    long countByPromotionIdAndUserId(UUID promotionId, UUID userId);
    long countByPromotionId(UUID promotionId);
    boolean existsByPromotionIdAndOrderId(UUID promotionId, UUID orderId);
}
