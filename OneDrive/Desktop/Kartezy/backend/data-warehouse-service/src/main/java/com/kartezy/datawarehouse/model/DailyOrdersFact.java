package com.kartezy.datawarehouse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dw_daily_orders_fact", indexes = {
    @Index(name = "idx_do_date", columnList = "orderDate"),
    @Index(name = "idx_do_merchant", columnList = "merchantId"),
    @Index(name = "idx_do_city", columnList = "cityId")
})
public class DailyOrdersFact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate orderDate;

    @Column(nullable = false)
    private String merchantId;

    private String merchantName;
    private String merchantCategory;
    private String cityId;
    private String cityName;

    private long totalOrders;
    private long completedOrders;
    private long cancelledOrders;
    private long returnedOrders;
    private long pendingOrders;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalRevenue;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalGmv;

    @Column(precision = 10, scale = 2)
    private BigDecimal averageOrderValue;

    @Column(precision = 10, scale = 2)
    private BigDecimal platformCommission;

    @Column(precision = 10, scale = 2)
    private BigDecimal deliveryFee;

    @Column(precision = 10, scale = 2)
    private BigDecimal discountAmount;

    private long totalItems;
    private long uniqueCustomers;
    private long newCustomers;

    private LocalDateTime lastUpdated;

    public DailyOrdersFact() {
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }
    public String getMerchantId() { return merchantId; }
    public void setMerchantId(String merchantId) { this.merchantId = merchantId; }
    public String getMerchantName() { return merchantName; }
    public void setMerchantName(String merchantName) { this.merchantName = merchantName; }
    public String getMerchantCategory() { return merchantCategory; }
    public void setMerchantCategory(String merchantCategory) { this.merchantCategory = merchantCategory; }
    public String getCityId() { return cityId; }
    public void setCityId(String cityId) { this.cityId = cityId; }
    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public long getCompletedOrders() { return completedOrders; }
    public void setCompletedOrders(long completedOrders) { this.completedOrders = completedOrders; }
    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }
    public long getReturnedOrders() { return returnedOrders; }
    public void setReturnedOrders(long returnedOrders) { this.returnedOrders = returnedOrders; }
    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public BigDecimal getTotalGmv() { return totalGmv; }
    public void setTotalGmv(BigDecimal totalGmv) { this.totalGmv = totalGmv; }
    public BigDecimal getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; }
    public BigDecimal getPlatformCommission() { return platformCommission; }
    public void setPlatformCommission(BigDecimal platformCommission) { this.platformCommission = platformCommission; }
    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    public long getTotalItems() { return totalItems; }
    public void setTotalItems(long totalItems) { this.totalItems = totalItems; }
    public long getUniqueCustomers() { return uniqueCustomers; }
    public void setUniqueCustomers(long uniqueCustomers) { this.uniqueCustomers = uniqueCustomers; }
    public long getNewCustomers() { return newCustomers; }
    public void setNewCustomers(long newCustomers) { this.newCustomers = newCustomers; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
