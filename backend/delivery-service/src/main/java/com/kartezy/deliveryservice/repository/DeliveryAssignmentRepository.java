package com.kartezy.deliveryservice.repository;

import com.kartezy.deliveryservice.entity.DeliveryAssignment;
import com.kartezy.deliveryservice.entity.DeliveryAssignment.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, UUID> {
    List<DeliveryAssignment> findByPartnerIdOrderByCreatedAtDesc(UUID partnerId);
    Optional<DeliveryAssignment> findByOrderId(UUID orderId);
    List<DeliveryAssignment> findByStatus(AssignmentStatus status);
    List<DeliveryAssignment> findByPartnerIdAndStatus(UUID partnerId, AssignmentStatus status);
    List<DeliveryAssignment> findByPartnerIdAndStatusOrderByCreatedAtDesc(UUID partnerId, AssignmentStatus status);
    long countByPartnerIdAndStatus(UUID partnerId, AssignmentStatus status);
}

