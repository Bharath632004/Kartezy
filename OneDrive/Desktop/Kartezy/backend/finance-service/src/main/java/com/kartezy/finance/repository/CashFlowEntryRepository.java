package com.kartezy.finance.repository;

import com.kartezy.finance.entity.CashFlowEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CashFlowEntryRepository extends JpaRepository<CashFlowEntry, Long> {

    List<CashFlowEntry> findByEntryDateBetween(LocalDate start, LocalDate end);

    List<CashFlowEntry> findByCategory(String category);

    List<CashFlowEntry> findByReportId(Long reportId);

    @Query("SELECT COALESCE(SUM(c.inflowAmount), 0) - COALESCE(SUM(c.outflowAmount), 0) FROM CashFlowEntry c WHERE c.entryDate BETWEEN :start AND :end")
    BigDecimal getNetCashFlowBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT c.category, COALESCE(SUM(c.inflowAmount), 0), COALESCE(SUM(c.outflowAmount), 0) FROM CashFlowEntry c WHERE c.entryDate BETWEEN :start AND :end GROUP BY c.category")
    List<Object[]> getCashFlowByCategory(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
