package com.kartezy.datawarehouse.repository;

import com.kartezy.datawarehouse.model.DailyCustomerFact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyCustomerFactRepository extends JpaRepository<DailyCustomerFact, Long> {
    List<DailyCustomerFact> findByActivityDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(d.newRegistrations),0) FROM DailyCustomerFact d WHERE d.activityDate BETWEEN :start AND :end")
    Long sumNewRegistrations(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(d.activeCustomers),0) FROM DailyCustomerFact d WHERE d.activityDate BETWEEN :start AND :end")
    Long sumActiveCustomers(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(d.churnedCustomers),0) FROM DailyCustomerFact d WHERE d.activityDate BETWEEN :start AND :end")
    Long sumChurnedCustomers(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.activityDate, COALESCE(SUM(d.newRegistrations),0), COALESCE(SUM(d.activeCustomers),0), COALESCE(SUM(d.totalCustomers),0) FROM DailyCustomerFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.activityDate ORDER BY d.activityDate")
    List<Object[]> getCustomerGrowthTrend(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.cityName, COALESCE(SUM(d.activeCustomers),0), COALESCE(SUM(d.totalOrders),0) FROM DailyCustomerFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.cityName ORDER BY SUM(d.activeCustomers) DESC")
    List<Object[]> getCustomersByCity(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
