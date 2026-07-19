package com.kartezy.datawarehouse.repository;

import com.kartezy.datawarehouse.model.CustomerCohort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CustomerCohortRepository extends JpaRepository<CustomerCohort, Long> {
    List<CustomerCohort> findByCohortTypeOrderByCohortDateAsc(String cohortType);
    List<CustomerCohort> findByCohortDateBetweenAndCohortType(LocalDate start, LocalDate end, String cohortType);

    @Query(value = "SELECT AVG(c.period0), AVG(c.period1), AVG(c.period2), AVG(c.period3), AVG(c.period4), AVG(c.period5), AVG(c.period6) FROM CustomerCohort c WHERE c.cohortType = :type", nativeQuery = true)
    Object[] getAverageRetentionRates(@Param("type") String type);
}
