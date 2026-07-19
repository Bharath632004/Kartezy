package com.kartezy.ops.repository;

import com.kartezy.ops.entity.DeliveryOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DeliveryOperationRepository extends JpaRepository<DeliveryOperation, Long> {
    List<DeliveryOperation> findByOrderId(Long orderId);
    List<DeliveryOperation> findByDeliveryPartnerId(Long partnerId);
    List<DeliveryOperation> findByStatus(String status);
    List<DeliveryOperation> findByZoneId(Long zoneId);
    long countByStatus(String status);
    
    List<DeliveryOperation> findByAssignedAtBetween(LocalDateTime from, LocalDateTime to);
    
    @Query("SELECT d.status, COUNT(d) FROM DeliveryOperation d GROUP BY d.status")
    List<Object[]> countByStatus();
    
    @Query("SELECT COUNT(d) FROM DeliveryOperation d WHERE d.isOnTime = true AND d.assignedAt BETWEEN ?1 AND ?2")
    long countOnTimeDeliveries(LocalDateTime from, LocalDateTime to);
    
    @Query("SELECT COUNT(d) FROM DeliveryOperation d WHERE d.assignedAt BETWEEN ?1 AND ?2")
    long countDeliveriesInRange(LocalDateTime from, LocalDateTime to);
    
    @Query("SELECT COALESCE(AVG(d.actualMinutes), 0) FROM DeliveryOperation d WHERE d.deliveredAt IS NOT NULL AND d.assignedAt BETWEEN ?1 AND ?2")
    double avgDeliveryTime(LocalDateTime from, LocalDateTime to);
}
