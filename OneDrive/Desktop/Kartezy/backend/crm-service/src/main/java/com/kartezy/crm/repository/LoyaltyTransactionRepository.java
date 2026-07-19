package com.kartezy.crm.repository;

import com.kartezy.crm.entity.LoyaltyTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoyaltyTransactionRepository extends JpaRepository<LoyaltyTransaction, Long> {

    Page<LoyaltyTransaction> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    List<LoyaltyTransaction> findByCustomerIdAndTransactionType(Long customerId, String transactionType);

    @Query("SELECT COALESCE(SUM(l.points), 0) FROM LoyaltyTransaction l WHERE l.customerId = :customerId AND l.transactionType = 'EARNED'")
    Integer getTotalEarnedPoints(@Param("customerId") Long customerId);

    @Query("SELECT COALESCE(SUM(l.points), 0) FROM LoyaltyTransaction l WHERE l.customerId = :customerId AND l.transactionType = 'REDEEMED'")
    Integer getTotalRedeemedPoints(@Param("customerId") Long customerId);

    @Query("SELECT l FROM LoyaltyTransaction l WHERE l.expiryDate <= :date AND l.status = 'ACTIVE'")
    List<LoyaltyTransaction> findExpiringPoints(@Param("date") LocalDate date);

    List<LoyaltyTransaction> findByReferralId(Long referralId);
}
