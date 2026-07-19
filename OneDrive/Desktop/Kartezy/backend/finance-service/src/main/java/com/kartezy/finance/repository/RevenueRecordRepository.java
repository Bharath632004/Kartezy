package com.kartezy.finance.repository;

import com.kartezy.finance.entity.RevenueRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RevenueRecordRepository extends JpaRepository<RevenueRecord, Long> {

    Page<RevenueRecord> findByRevenueDateBetweenOrderByRevenueDateDesc(LocalDate start, LocalDate end, Pageable pageable);

    Page<RevenueRecord> findByMerchantIdOrderByRevenueDateDesc(Long merchantId, Pageable pageable);

    Page<RevenueRecord> findByRevenueType(String revenueType, Pageable pageable);

    List<RevenueRecord> findByOrderId(Long orderId);

    @Query("SELECT COALESCE(SUM(r.netRevenue), 0) FROM RevenueRecord r WHERE r.revenueDate BETWEEN :start AND :end AND r.isRecognized = true")
    BigDecimal getRecognizedRevenueBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(r.netRevenue), 0) FROM RevenueRecord r WHERE r.revenueDate BETWEEN :start AND :end")
    BigDecimal getGrossRevenueBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(r.commissionAmount), 0) FROM RevenueRecord r WHERE r.revenueDate BETWEEN :start AND :end")
    BigDecimal getTotalCommissionBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT r.revenueType, COALESCE(SUM(r.netRevenue), 0) FROM RevenueRecord r WHERE r.revenueDate BETWEEN :start AND :end GROUP BY r.revenueType")
    List<Object[]> getRevenueBreakdown(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
