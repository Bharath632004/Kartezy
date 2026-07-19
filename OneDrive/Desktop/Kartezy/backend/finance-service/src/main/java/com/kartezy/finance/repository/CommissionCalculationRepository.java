package com.kartezy.finance.repository;

import com.kartezy.finance.entity.CommissionCalculation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CommissionCalculationRepository extends JpaRepository<CommissionCalculation, Long> {

    List<CommissionCalculation> findByOrderId(Long orderId);

    List<CommissionCalculation> findByMerchantId(Long merchantId);

    List<CommissionCalculation> findBySettlementId(Long settlementId);

    @Query("SELECT c FROM CommissionCalculation c WHERE c.isSettled = false AND c.status = 'CALCULATED'")
    List<CommissionCalculation> findUnsettledCommissions();

    @Query("SELECT COALESCE(SUM(c.calculatedAmount), 0) FROM CommissionCalculation c WHERE c.merchantId = :merchantId AND c.isSettled = false")
    BigDecimal getPendingCommissionByMerchant(@Param("merchantId") Long merchantId);

    long countByIsSettledFalse();
}
