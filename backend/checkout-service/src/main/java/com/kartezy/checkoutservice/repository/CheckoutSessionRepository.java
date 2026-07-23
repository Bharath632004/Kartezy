package com.kartezy.checkoutservice.repository;

import com.kartezy.checkoutservice.entity.CheckoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CheckoutSessionRepository extends JpaRepository<CheckoutSession, UUID> {
    Optional<CheckoutSession> findByUserIdAndStatus(UUID userId, String status);
    Optional<CheckoutSession> findByCartId(UUID cartId);
    Optional<CheckoutSession> findByOrderId(UUID orderId);
    long countByUserIdAndStatus(UUID userId, String status);
}
