package com.kartezy.datawarehouse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dw_daily_merchant_fact", indexes = {@Index(name = "idx_dm_date", columnList = "activityDate"), @Index(name = "idx_dm_merchant", columnList = "merchantId")})
public class DailyMerchantFact {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private LocalDate activityDate;
    private String merchantId; private String merchantName; private String merchantCategory;
    private String cityId; private String cityName;
    private long totalOrders; private long completedOrders; private long cancelledOrders;
    @Column(precision = 14, scale = 2) private BigDecimal totalRevenue;
    @Column(precision = 14, scale = 2) private BigDecimal totalCommission;
    @Column(precision = 10, scale = 2) private BigDecimal averageRating;
    private long totalProducts; private long activeProducts; private long lowStockProducts;
    @Column(precision = 10, scale = 2) private BigDecimal acceptanceRate;
    @Column(precision = 10, scale = 2) private BigDecimal fulfilmentRate;
    private long totalCustomers; private long newCustomers;
    @Column(precision = 10, scale = 2) private BigDecimal averagePreparationTime;
    private LocalDateTime lastUpdated;

    public DailyMerchantFact() { this.lastUpdated = LocalDateTime.now(); }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public LocalDate getActivityDate() { return activityDate; } public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
    public String getMerchantId() { return merchantId; } public void setMerchantId(String merchantId) { this.merchantId = merchantId; }
    public String getMerchantName() { return merchantName; } public void setMerchantName(String merchantName) { this.merchantName = merchantName; }
    public String getMerchantCategory() { return merchantCategory; } public void setMerchantCategory(String merchantCategory) { this.merchantCategory = merchantCategory; }
    public String getCityId() { return cityId; } public void setCityId(String cityId) { this.cityId = cityId; }
    public String getCityName() { return cityName; } public void setCityName(String cityName) { this.cityName = cityName; }
    public long getTotalOrders() { return totalOrders; } public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public long getCompletedOrders() { return completedOrders; } public void setCompletedOrders(long completedOrders) { this.completedOrders = completedOrders; }
    public long getCancelledOrders() { return cancelledOrders; } public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }
    public BigDecimal getTotalRevenue() { return totalRevenue; } public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public BigDecimal getTotalCommission() { return totalCommission; } public void setTotalCommission(BigDecimal totalCommission) { this.totalCommission = totalCommission; }
    public BigDecimal getAverageRating() { return averageRating; } public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }
    public long getTotalProducts() { return totalProducts; } public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }
    public long getActiveProducts() { return activeProducts; } public void setActiveProducts(long activeProducts) { this.activeProducts = activeProducts; }
    public long getLowStockProducts() { return lowStockProducts; } public void setLowStockProducts(long lowStockProducts) { this.lowStockProducts = lowStockProducts; }
    public BigDecimal getAcceptanceRate() { return acceptanceRate; } public void setAcceptanceRate(BigDecimal acceptanceRate) { this.acceptanceRate = acceptanceRate; }
    public BigDecimal getFulfilmentRate() { return fulfilmentRate; } public void setFulfilmentRate(BigDecimal fulfilmentRate) { this.fulfilmentRate = fulfilmentRate; }
    public long getTotalCustomers() { return totalCustomers; } public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }
    public long getNewCustomers() { return newCustomers; } public void setNewCustomers(long newCustomers) { this.newCustomers = newCustomers; }
    public BigDecimal getAveragePreparationTime() { return averagePreparationTime; } public void setAveragePreparationTime(BigDecimal averagePreparationTime) { this.averagePreparationTime = averagePreparationTime; }
    public LocalDateTime getLastUpdated() { return lastUpdated; } public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
