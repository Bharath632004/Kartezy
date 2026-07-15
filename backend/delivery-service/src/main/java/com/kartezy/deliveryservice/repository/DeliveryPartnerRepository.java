package com.kartezy.deliveryservice.repository;

import com.kartezy.deliveryservice.entity.DeliveryPartner;
import com.kartezy.deliveryservice.entity.DeliveryPartner.PartnerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, UUID> {
    Optional<DeliveryPartner> findByPhoneNumber(String phoneNumber);
    List<DeliveryPartner> findByStatus(PartnerStatus status);
    List<DeliveryPartner> findByCityAndIsAvailableTrueAndIsOnlineTrue(String city);
    List<DeliveryPartner> findByIsOnlineTrueAndIsAvailableTrue();
    long countByStatus(PartnerStatus status);
}

