package com.kartezy.datawarehouse.repository;

import com.kartezy.datawarehouse.model.DailyMerchantFact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyMerchantFactRepository extends JpaRepository<DailyMerchantFact, Long> {
    List<DailyMerchantFact> findByActivityDateBetween(LocalDate start, LocalDate end);
    List<DailyMerchantFact> findByMerchantIdAndActivityDateBetween(String merchantId, LocalDate start, LocalDate end);

    @Query("SELECT d.merchantName, COALESCE(SUM(d.totalRevenue),0), COALESCE(SUM(d.totalOrders),0), COALESCE(SUM(d.totalCommission),0), AVG(d.averageRating) FROM DailyMerchantFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.merchantName ORDER BY SUM(d.totalRevenue) DESC")
    List<Object[]> getTopMerchants(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.merchantCategory, COALESCE(SUM(d.totalRevenue),0), COALESCE(COUNT(DISTINCT d.merchantId),0) FROM DailyMerchantFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.merchantCategory ORDER BY SUM(d.totalRevenue) DESC")
    List<Object[]> getMerchantCategorySummary(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT AVG(d.acceptanceRate), AVG(d.fulfilmentRate), AVG(d.averagePreparationTime) FROM DailyMerchantFact d WHERE d.activityDate BETWEEN :start AND :end")
    Object[] getMerchantEfficiencyMetrics(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.activityDate, COALESCE(SUM(d.totalOrders),0), COALESCE(SUM(d.totalRevenue),0) FROM DailyMerchantFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.activityDate ORDER BY d.activityDate")
    List<Object[]> getMerchantTrend(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
