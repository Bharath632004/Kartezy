package com.kartezy.promotionservice.repository;

import com.kartezy.promotionservice.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, UUID> {
    Optional<Promotion> findByCode(String code);
    List<Promotion> findByActiveTrueAndStartDateBeforeAndEndDateAfter(LocalDateTime now, LocalDateTime now2);
    List<Promotion> findByMerchantIdAndActiveTrue(UUID merchantId);
    List<Promotion> findByTypeAndActiveTrue(String type);
    boolean existsByCode(String code);
}
