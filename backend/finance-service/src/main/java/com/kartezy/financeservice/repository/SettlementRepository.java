package com.kartezy.financeservice.repository;

import com.kartezy.financeservice.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, UUID> {
    List<Settlement> findByMerchantIdOrderByCreatedAtDesc(UUID merchantId);
    List<Settlement> findByStatusOrderByCreatedAtDesc(String status);
}
