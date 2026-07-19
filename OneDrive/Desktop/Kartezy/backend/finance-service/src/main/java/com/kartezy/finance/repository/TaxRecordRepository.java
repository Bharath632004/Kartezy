package com.kartezy.finance.repository;

import com.kartezy.finance.entity.TaxRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaxRecordRepository extends JpaRepository<TaxRecord, Long> {

    List<TaxRecord> findByTaxType(String taxType);

    List<TaxRecord> findByEntityTypeAndEntityId(String entityType, Long entityId);

    List<TaxRecord> findByDueDateBeforeAndStatus(LocalDate date, String status);

    @Query("SELECT t FROM TaxRecord t WHERE t.isDeductedAtSource = true AND t.status = 'PENDING_DEPOSIT'")
    List<TaxRecord> findPendingTDSDeposits();

    @Query("SELECT COALESCE(SUM(t.taxAmount), 0) FROM TaxRecord t WHERE t.taxType = :taxType AND t.status = 'PAID'")
    BigDecimal getTotalTaxPaid(@Param("taxType") String taxType);

    @Query("SELECT COALESCE(SUM(t.taxAmount), 0) FROM TaxRecord t WHERE t.status NOT IN ('PAID', 'CANCELLED')")
    BigDecimal getTotalOutstandingTax();
}
