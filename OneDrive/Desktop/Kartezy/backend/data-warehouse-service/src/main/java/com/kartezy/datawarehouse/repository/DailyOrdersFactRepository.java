package com.kartezy.datawarehouse.repository;

import com.kartezy.datawarehouse.model.DailyOrdersFact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyOrdersFactRepository extends JpaRepository<DailyOrdersFact, Long> {
    List<DailyOrdersFact> findByOrderDateBetween(LocalDate start, LocalDate end);
    List<DailyOrdersFact> findByOrderDateBetweenAndMerchantId(LocalDate start, LocalDate end, String merchantId);
    List<DailyOrdersFact> findByOrderDateBetweenAndCityId(LocalDate start, LocalDate end, String cityId);

    @Query("SELECT COALESCE(SUM(d.totalRevenue), 0) FROM DailyOrdersFact d WHERE d.orderDate BETWEEN :start AND :end")
    Double sumRevenueBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(d.totalOrders), 0) FROM DailyOrdersFact d WHERE d.orderDate BETWEEN :start AND :end")
    Long sumOrdersBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.orderDate, COALESCE(SUM(d.totalRevenue),0) as revenue, COALESCE(SUM(d.totalOrders),0) as orders FROM DailyOrdersFact d WHERE d.orderDate BETWEEN :start AND :end GROUP BY d.orderDate ORDER BY d.orderDate")
    List<Object[]> getDailyRevenueTrend(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(d.totalGmv),0) FROM DailyOrdersFact d WHERE d.orderDate BETWEEN :start AND :end")
    Double sumGmvBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.merchantCategory, COALESCE(SUM(d.totalRevenue),0) FROM DailyOrdersFact d WHERE d.orderDate BETWEEN :start AND :end GROUP BY d.merchantCategory ORDER BY SUM(d.totalRevenue) DESC")
    List<Object[]> getRevenueByCategory(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.cityName, COALESCE(SUM(d.totalOrders),0), COALESCE(SUM(d.totalRevenue),0) FROM DailyOrdersFact d WHERE d.orderDate BETWEEN :start AND :end GROUP BY d.cityName ORDER BY SUM(d.totalRevenue) DESC")
    List<Object[]> getCityPerformance(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
