package com.kartezy.checkoutservice.repository;

import com.kartezy.checkoutservice.entity.CheckoutCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CheckoutCartItemRepository extends JpaRepository<CheckoutCartItem, UUID> {
    List<CheckoutCartItem> findByCartId(UUID cartId);
    void deleteByCartId(UUID cartId);
}
