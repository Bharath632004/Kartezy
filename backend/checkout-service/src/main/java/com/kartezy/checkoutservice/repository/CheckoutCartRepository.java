package com.kartezy.checkoutservice.repository;

import com.kartezy.checkoutservice.entity.CheckoutCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CheckoutCartRepository extends JpaRepository<CheckoutCart, UUID> {
    Optional<CheckoutCart> findByUserIdAndStatus(UUID userId, String status);
    Optional<CheckoutCart> findBySessionId(String sessionId);
    long countByUserIdAndStatus(UUID userId, String status);
}
