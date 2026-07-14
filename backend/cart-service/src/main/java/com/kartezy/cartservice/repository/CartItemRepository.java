package com.kartezy.cartservice.repository;
import com.kartezy.cartservice.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
}
