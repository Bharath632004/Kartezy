package com.kartezy.loyaltyservice.repository;

import com.kartezy.loyaltyservice.entity.LoyaltyTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface LoyaltyTransactionRepository extends JpaRepository<LoyaltyTransaction, UUID> {
    List<LoyaltyTransaction> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
