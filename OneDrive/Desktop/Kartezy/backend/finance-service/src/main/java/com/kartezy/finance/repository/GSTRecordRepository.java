package com.kartezy.finance.repository;

import com.kartezy.finance.constants.GSTType;
import com.kartezy.finance.entity.GSTRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface GSTRecordRepository extends JpaRepository<GSTRecord, Long> {

    List<GSTRecord> findByReturnPeriod(String returnPeriod);

    List<GSTRecord> findByGstin(String gstin);

    List<GSTRecord> findByGstType(GSTType gstType);

    List<GSTRecord> findByIsInputCreditTrue();

    List<GSTRecord> findByIsOutputLiabilityTrue();

    @Query("SELECT COALESCE(SUM(g.taxAmount), 0) FROM GSTRecord g WHERE g.isInputCredit = true AND g.returnPeriod = :period")
    BigDecimal getTotalInputCredit(@Param("period") String period);

    @Query("SELECT COALESCE(SUM(g.taxAmount), 0) FROM GSTRecord g WHERE g.isOutputLiability = true AND g.returnPeriod = :period")
    BigDecimal getTotalOutputLiability(@Param("period") String period);

    @Query("SELECT COALESCE(SUM(g.taxAmount), 0) FROM GSTRecord g WHERE g.returnPeriod = :period AND g.status = 'FILED'")
    BigDecimal getTotalFiledTax(@Param("period") String period);
}
