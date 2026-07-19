package com.kartezy.datawarehouse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dw_daily_customer_fact", indexes = {@Index(name = "idx_dc_date", columnList = "activityDate"), @Index(name = "idx_dc_city", columnList = "cityId")})
public class DailyCustomerFact {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private LocalDate activityDate;
    private String cityId; private String cityName;
    private long totalCustomers; private long newRegistrations; private long activeCustomers;
    private long totalOrders; private long repeatCustomers; private long churnedCustomers;
    private long returningCustomers;
    @Column(precision = 12, scale = 2) private BigDecimal totalSpend;
    @Column(precision = 10, scale = 2) private BigDecimal averageOrderValue;
    private LocalDateTime lastUpdated;

    public DailyCustomerFact() { this.lastUpdated = LocalDateTime.now(); }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public LocalDate getActivityDate() { return activityDate; } public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
    public String getCityId() { return cityId; } public void setCityId(String cityId) { this.cityId = cityId; }
    public String getCityName() { return cityName; } public void setCityName(String cityName) { this.cityName = cityName; }
    public long getTotalCustomers() { return totalCustomers; } public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }
    public long getNewRegistrations() { return newRegistrations; } public void setNewRegistrations(long newRegistrations) { this.newRegistrations = newRegistrations; }
    public long getActiveCustomers() { return activeCustomers; } public void setActiveCustomers(long activeCustomers) { this.activeCustomers = activeCustomers; }
    public long getTotalOrders() { return totalOrders; } public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public long getRepeatCustomers() { return repeatCustomers; } public void setRepeatCustomers(long repeatCustomers) { this.repeatCustomers = repeatCustomers; }
    public long getChurnedCustomers() { return churnedCustomers; } public void setChurnedCustomers(long churnedCustomers) { this.churnedCustomers = churnedCustomers; }
    public long getReturningCustomers() { return returningCustomers; } public void setReturningCustomers(long returningCustomers) { this.returningCustomers = returningCustomers; }
    public BigDecimal getTotalSpend() { return totalSpend; } public void setTotalSpend(BigDecimal totalSpend) { this.totalSpend = totalSpend; }
    public BigDecimal getAverageOrderValue() { return averageOrderValue; } public void setAverageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; }
    public LocalDateTime getLastUpdated() { return lastUpdated; } public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
