package com.kartezy.datawarehouse.repository;

import com.kartezy.datawarehouse.model.DailyDeliveryFact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyDeliveryFactRepository extends JpaRepository<DailyDeliveryFact, Long> {
    List<DailyDeliveryFact> findByActivityDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(d.completedDeliveries),0), COALESCE(SUM(d.failedDeliveries),0), COALESCE(SUM(d.totalEarnings),0), AVG(d.onTimeRate) FROM DailyDeliveryFact d WHERE d.activityDate BETWEEN :start AND :end")
    Object[] getDeliverySummary(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.deliveryPartnerName, COALESCE(SUM(d.completedDeliveries),0), COALESCE(SUM(d.totalEarnings),0), AVG(d.averageRating), AVG(d.onTimeRate) FROM DailyDeliveryFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.deliveryPartnerName ORDER BY SUM(d.completedDeliveries) DESC")
    List<Object[]> getTopDeliveryPartners(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.cityName, COALESCE(SUM(d.completedDeliveries),0), AVG(d.averageDeliveryTime), AVG(d.onTimeRate) FROM DailyDeliveryFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.cityName ORDER BY SUM(d.completedDeliveries) DESC")
    List<Object[]> getDeliveryByCity(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.activityDate, COALESCE(SUM(d.completedDeliveries),0), COALESCE(SUM(d.totalEarnings),0) FROM DailyDeliveryFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.activityDate ORDER BY d.activityDate")
    List<Object[]> getDeliveryTrend(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
