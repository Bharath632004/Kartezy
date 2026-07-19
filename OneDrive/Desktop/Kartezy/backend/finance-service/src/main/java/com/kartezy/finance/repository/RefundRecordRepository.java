package com.kartezy.finance.repository;

import com.kartezy.finance.entity.RefundRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RefundRecordRepository extends JpaRepository<RefundRecord, Long> {

    Page<RefundRecord> findByOrderIdOrderByCreatedAtDesc(Long orderId, Pageable pageable);

    Page<RefundRecord> findByMerchantIdOrderByCreatedAtDesc(Long merchantId, Pageable pageable);

    List<RefundRecord> findByStatus(String status);

    @Query("SELECT COALESCE(SUM(r.refundAmount), 0) FROM RefundRecord r WHERE r.status = 'COMPLETED'")
    BigDecimal getTotalRefundedAmount();

    @Query("SELECT COALESCE(SUM(r.refundAmount), 0) FROM RefundRecord r WHERE r.merchantId = :merchantId AND r.status = 'COMPLETED'")
    BigDecimal getMerchantTotalRefunds(@Param("merchantId") Long merchantId);

    long countByStatus(String status);
}
