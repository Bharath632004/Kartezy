package com.kartezy.finance.repository;

import com.kartezy.finance.entity.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    Page<WalletTransaction> findByMerchantIdOrderByCreatedAtDesc(Long merchantId, Pageable pageable);

    Page<WalletTransaction> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    Page<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId, Pageable pageable);

    List<WalletTransaction> findBySettlementId(Long settlementId);

    List<WalletTransaction> findByReferenceNumber(String referenceNumber);

    @Query("SELECT COALESCE(SUM(w.amount), 0) FROM WalletTransaction w WHERE w.merchantId = :merchantId AND w.transactionType IN ('CREDIT', 'DEPOSIT')")
    BigDecimal getTotalCreditsByMerchant(@Param("merchantId") Long merchantId);

    @Query("SELECT COALESCE(SUM(w.amount), 0) FROM WalletTransaction w WHERE w.merchantId = :merchantId AND w.transactionType IN ('DEBIT', 'WITHDRAWAL')")
    BigDecimal getTotalDebitsByMerchant(@Param("merchantId") Long merchantId);

    @Query("SELECT w FROM WalletTransaction w WHERE w.isReconciled = false")
    List<WalletTransaction> findUnreconciledTransactions();
}
