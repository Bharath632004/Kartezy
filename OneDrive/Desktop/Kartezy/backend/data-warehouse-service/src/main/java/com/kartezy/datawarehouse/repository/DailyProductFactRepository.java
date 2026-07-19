package com.kartezy.datawarehouse.repository;

import com.kartezy.datawarehouse.model.DailyProductFact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyProductFactRepository extends JpaRepository<DailyProductFact, Long> {
    List<DailyProductFact> findByActivityDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT d.productName, COALESCE(SUM(d.unitsSold),0), COALESCE(SUM(d.revenue),0), AVG(d.averageRating), COALESCE(SUM(d.totalViews),0) FROM DailyProductFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.productName ORDER BY SUM(d.revenue) DESC")
    List<Object[]> getTopProducts(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.categoryName, COALESCE(SUM(d.unitsSold),0), COALESCE(SUM(d.revenue),0) FROM DailyProductFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.categoryName ORDER BY SUM(d.revenue) DESC")
    List<Object[]> getProductSalesByCategory(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT d.productName, AVG(d.conversionRate), COALESCE(SUM(d.unitsSold),0) FROM DailyProductFact d WHERE d.activityDate BETWEEN :start AND :end GROUP BY d.productName ORDER BY AVG(d.conversionRate) DESC")
    List<Object[]> getProductConversionRates(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT DISTINCT d.productName FROM DailyProductFact d WHERE d.stockQuantity <= d.lowStockThreshold")
    List<String> getLowStockProducts();
}
