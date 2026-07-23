package com.kartezy.financeservice.repository;

import com.kartezy.financeservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Transaction> findByMerchantIdOrderByCreatedAtDesc(UUID merchantId);
    List<Transaction> findByOrderId(UUID orderId);
    List<Transaction> findByStatusOrderByCreatedAtDesc(String status);
    Optional<Transaction> findByTransactionNumber(String transactionNumber);
}
