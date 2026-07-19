package com.kartezy.finance.repository;

import com.kartezy.finance.constants.SettlementStatus;
import com.kartezy.finance.entity.MerchantSettlement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantSettlementRepository extends JpaRepository<MerchantSettlement, Long> {

    Optional<MerchantSettlement> findBySettlementNumber(String settlementNumber);

    Page<MerchantSettlement> findByMerchantIdOrderByCreatedAtDesc(Long merchantId, Pageable pageable);

    List<MerchantSettlement> findByStatus(SettlementStatus status);

    List<MerchantSettlement> findBySettlementDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT m FROM MerchantSettlement m WHERE m.status = :status AND m.settlementDate <= :date ORDER BY m.settlementDate")
    List<MerchantSettlement> findPendingSettlementsDue(@Param("status") SettlementStatus status, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(m.netSettlementAmount), 0) FROM MerchantSettlement m WHERE m.merchantId = :merchantId AND m.status = :status")
    BigDecimal getTotalSettledAmount(@Param("merchantId") Long merchantId, @Param("status") SettlementStatus status);

    @Query("SELECT m FROM MerchantSettlement m WHERE m.merchantId = :merchantId AND m.status = :status ORDER BY m.createdAt DESC")
    List<MerchantSettlement> findByMerchantAndStatus(@Param("merchantId") Long merchantId, @Param("status") SettlementStatus status);

    long countByStatus(SettlementStatus status);
}
