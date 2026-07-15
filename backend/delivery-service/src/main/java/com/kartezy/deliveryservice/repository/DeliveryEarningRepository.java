package com.kartezy.deliveryservice.repository;

import com.kartezy.deliveryservice.entity.DeliveryEarning;
import com.kartezy.deliveryservice.entity.DeliveryEarning.EarningStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DeliveryEarningRepository extends JpaRepository<DeliveryEarning, UUID> {
    List<DeliveryEarning> findByPartnerIdOrderByCreatedAtDesc(UUID partnerId);
    List<DeliveryEarning> findByPartnerIdAndStatus(UUID partnerId, EarningStatus status);
    List<DeliveryEarning> findByStatus(EarningStatus status);
}

