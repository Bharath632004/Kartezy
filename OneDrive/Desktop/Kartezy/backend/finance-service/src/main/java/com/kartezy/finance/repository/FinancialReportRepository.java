package com.kartezy.finance.repository;

import com.kartezy.finance.entity.FinancialReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialReportRepository extends JpaRepository<FinancialReport, Long> {

    List<FinancialReport> findByReportTypeOrderByPeriodEndDesc(String reportType);

    List<FinancialReport> findByEntityTypeAndEntityIdOrderByPeriodEndDesc(String entityType, Long entityId);

    @Query("SELECT f FROM FinancialReport f WHERE f.reportType = :type AND f.periodStart = :start AND f.periodEnd = :end")
    Optional<FinancialReport> findByReportTypeAndPeriod(@Param("type") String type, @Param("start") java.time.LocalDate start, @Param("end") java.time.LocalDate end);

    @Query("SELECT f FROM FinancialReport f WHERE f.reportType = :type AND f.entityType = :entityType AND f.entityId = :entityId ORDER BY f.periodEnd DESC")
    List<FinancialReport> findEntityReports(@Param("type") String type, @Param("entityType") String entityType, @Param("entityId") Long entityId);
}
