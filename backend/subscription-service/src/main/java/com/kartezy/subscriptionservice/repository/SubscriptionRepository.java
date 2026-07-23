package com.kartezy.subscriptionservice.repository;

import com.kartezy.subscriptionservice.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    Optional<Subscription> findByUserIdAndStatus(UUID userId, String status);
    List<Subscription> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Subscription> findByMerchantIdOrderByCreatedAtDesc(UUID merchantId);
    List<Subscription> findByStatusAndNextBillingDateBefore(String status, LocalDateTime date);
}
