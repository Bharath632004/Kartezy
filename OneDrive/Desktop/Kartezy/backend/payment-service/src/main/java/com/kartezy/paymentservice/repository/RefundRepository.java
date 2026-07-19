package com.kartezy.paymentservice.repository;

import com.kartezy.paymentservice.entity.Refund;
import com.kartezy.paymentservice.entity.Refund.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface RefundRepository extends JpaRepository<Refund, UUID> {
    List<Refund> findByPaymentId(UUID paymentId);
    List<Refund> findByOrderId(UUID orderId);
    List<Refund> findByStatus(RefundStatus status);
    long countByStatus(RefundStatus status);
}
