package com.kartezy.paymentservice.repository;

import com.kartezy.paymentservice.entity.Settlement;
import com.kartezy.paymentservice.entity.Settlement.SettlementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, UUID> {
    List<Settlement> findByMerchantIdOrderByCreatedAtDesc(UUID merchantId);
    List<Settlement> findByStatus(SettlementStatus status);
    long countByStatus(SettlementStatus status);
}
