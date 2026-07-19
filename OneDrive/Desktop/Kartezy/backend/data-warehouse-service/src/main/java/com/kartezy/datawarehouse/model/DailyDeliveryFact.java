package com.kartezy.datawarehouse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dw_daily_delivery_fact", indexes = {@Index(name = "idx_dd_date", columnList = "activityDate"), @Index(name = "idx_dd_delivery", columnList = "deliveryPartnerId")})
public class DailyDeliveryFact {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private LocalDate activityDate;
    private String deliveryPartnerId; private String deliveryPartnerName;
    private String cityId; private String cityName;
    private long totalDeliveries; private long completedDeliveries; private long failedDeliveries;
    @Column(precision = 10, scale = 2) private BigDecimal totalEarnings;
    @Column(precision = 10, scale = 2) private BigDecimal averageDeliveryTime;
    @Column(precision = 10, scale = 2) private BigDecimal averageDistance;
    @Column(precision = 10, scale = 2) private BigDecimal acceptanceRate;
    @Column(precision = 10, scale = 2) private BigDecimal averageRating;
    private long totalTips; @Column(precision = 10, scale = 2) private BigDecimal tipAmount;
    private long otpVerifiedDeliveries; private long proofOfDeliveryCaptured;
    private long onTimeDeliveries; private long lateDeliveries;
    private long totalKilometers;
    @Column(precision = 10, scale = 2) private BigDecimal onTimeRate;
    private LocalDateTime lastUpdated;

    public DailyDeliveryFact() { this.lastUpdated = LocalDateTime.now(); }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public LocalDate getActivityDate() { return activityDate; } public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
    public String getDeliveryPartnerId() { return deliveryPartnerId; } public void setDeliveryPartnerId(String deliveryPartnerId) { this.deliveryPartnerId = deliveryPartnerId; }
    public String getDeliveryPartnerName() { return deliveryPartnerName; } public void setDeliveryPartnerName(String deliveryPartnerName) { this.deliveryPartnerName = deliveryPartnerName; }
    public String getCityId() { return cityId; } public void setCityId(String cityId) { this.cityId = cityId; }
    public String getCityName() { return cityName; } public void setCityName(String cityName) { this.cityName = cityName; }
    public long getTotalDeliveries() { return totalDeliveries; } public void setTotalDeliveries(long totalDeliveries) { this.totalDeliveries = totalDeliveries; }
    public long getCompletedDeliveries() { return completedDeliveries; } public void setCompletedDeliveries(long completedDeliveries) { this.completedDeliveries = completedDeliveries; }
    public long getFailedDeliveries() { return failedDeliveries; } public void setFailedDeliveries(long failedDeliveries) { this.failedDeliveries = failedDeliveries; }
    public BigDecimal getTotalEarnings() { return totalEarnings; } public void setTotalEarnings(BigDecimal totalEarnings) { this.totalEarnings = totalEarnings; }
    public BigDecimal getAverageDeliveryTime() { return averageDeliveryTime; } public void setAverageDeliveryTime(BigDecimal averageDeliveryTime) { this.averageDeliveryTime = averageDeliveryTime; }
    public BigDecimal getAverageDistance() { return averageDistance; } public void setAverageDistance(BigDecimal averageDistance) { this.averageDistance = averageDistance; }
    public BigDecimal getAcceptanceRate() { return acceptanceRate; } public void setAcceptanceRate(BigDecimal acceptanceRate) { this.acceptanceRate = acceptanceRate; }
    public BigDecimal getAverageRating() { return averageRating; } public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }
    public long getTotalTips() { return totalTips; } public void setTotalTips(long totalTips) { this.totalTips = totalTips; }
    public BigDecimal getTipAmount() { return tipAmount; } public void setTipAmount(BigDecimal tipAmount) { this.tipAmount = tipAmount; }
    public long getOtpVerifiedDeliveries() { return otpVerifiedDeliveries; } public void setOtpVerifiedDeliveries(long otpVerifiedDeliveries) { this.otpVerifiedDeliveries = otpVerifiedDeliveries; }
    public long getProofOfDeliveryCaptured() { return proofOfDeliveryCaptured; } public void setProofOfDeliveryCaptured(long proofOfDeliveryCaptured) { this.proofOfDeliveryCaptured = proofOfDeliveryCaptured; }
    public long getOnTimeDeliveries() { return onTimeDeliveries; } public void setOnTimeDeliveries(long onTimeDeliveries) { this.onTimeDeliveries = onTimeDeliveries; }
    public long getLateDeliveries() { return lateDeliveries; } public void setLateDeliveries(long lateDeliveries) { this.lateDeliveries = lateDeliveries; }
    public long getTotalKilometers() { return totalKilometers; } public void setTotalKilometers(long totalKilometers) { this.totalKilometers = totalKilometers; }
    public BigDecimal getOnTimeRate() { return onTimeRate; } public void setOnTimeRate(BigDecimal onTimeRate) { this.onTimeRate = onTimeRate; }
    public LocalDateTime getLastUpdated() { return lastUpdated; } public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
