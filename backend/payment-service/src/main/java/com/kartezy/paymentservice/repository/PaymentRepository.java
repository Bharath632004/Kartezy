package com.kartezy.paymentservice.repository;

import com.kartezy.paymentservice.entity.Payment;
import com.kartezy.paymentservice.entity.Payment.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByGatewayReference(String gatewayReference);
    Optional<Payment> findByOrderId(UUID orderId);
    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
    List<Payment> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Payment> findByMerchantIdOrderByCreatedAtDesc(UUID merchantId);
    List<Payment> findByStatus(PaymentStatus status);
    List<Payment> findByPaymentMethod(Payment.PaymentMethod method);
    long countByStatus(PaymentStatus status);
    long countByPaymentMethod(Payment.PaymentMethod method);
}
