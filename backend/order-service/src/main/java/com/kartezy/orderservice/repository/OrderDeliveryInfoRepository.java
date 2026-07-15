package com.kartezy.orderservice.repository;

import com.kartezy.orderservice.entity.OrderDeliveryInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderDeliveryInfoRepository extends JpaRepository<OrderDeliveryInfo, UUID> {
    Optional<OrderDeliveryInfo> findByOrderId(UUID orderId);
}
