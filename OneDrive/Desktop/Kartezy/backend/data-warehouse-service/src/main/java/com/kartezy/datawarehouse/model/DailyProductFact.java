package com.kartezy.datawarehouse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dw_daily_product_fact", indexes = {@Index(name = "idx_dp_date", columnList = "activityDate"), @Index(name = "idx_dp_product", columnList = "productId")})
public class DailyProductFact {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private LocalDate activityDate;
    private String productId; private String productName; private String categoryId;
    private String categoryName; private String merchantId; private String merchantName;
    private long unitsSold; private long unitsReturned;
    @Column(precision = 12, scale = 2) private BigDecimal revenue;
    @Column(precision = 10, scale = 2) private BigDecimal unitPrice;
    private long totalViews; private long totalAddsToCart; private long totalWishlists;
    @Column(precision = 10, scale = 2) private BigDecimal conversionRate;
    private long stockQuantity; private long lowStockThreshold;
    @Column(precision = 10, scale = 2) private BigDecimal averageRating;
    private long totalReviews;
    @Column(precision = 10, scale = 2) private BigDecimal discountPercentage;
    private LocalDateTime lastUpdated;

    public DailyProductFact() { this.lastUpdated = LocalDateTime.now(); }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public LocalDate getActivityDate() { return activityDate; } public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
    public String getProductId() { return productId; } public void setProductId(String productId) { this.productId = productId; }
    public String getProductName() { return productName; } public void setProductName(String productName) { this.productName = productName; }
    public String getCategoryId() { return categoryId; } public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; } public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getMerchantId() { return merchantId; } public void setMerchantId(String merchantId) { this.merchantId = merchantId; }
    public String getMerchantName() { return merchantName; } public void setMerchantName(String merchantName) { this.merchantName = merchantName; }
    public long getUnitsSold() { return unitsSold; } public void setUnitsSold(long unitsSold) { this.unitsSold = unitsSold; }
    public long getUnitsReturned() { return unitsReturned; } public void setUnitsReturned(long unitsReturned) { this.unitsReturned = unitsReturned; }
    public BigDecimal getRevenue() { return revenue; } public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    public BigDecimal getUnitPrice() { return unitPrice; } public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public long getTotalViews() { return totalViews; } public void setTotalViews(long totalViews) { this.totalViews = totalViews; }
    public long getTotalAddsToCart() { return totalAddsToCart; } public void setTotalAddsToCart(long totalAddsToCart) { this.totalAddsToCart = totalAddsToCart; }
    public long getTotalWishlists() { return totalWishlists; } public void setTotalWishlists(long totalWishlists) { this.totalWishlists = totalWishlists; }
    public BigDecimal getConversionRate() { return conversionRate; } public void setConversionRate(BigDecimal conversionRate) { this.conversionRate = conversionRate; }
    public long getStockQuantity() { return stockQuantity; } public void setStockQuantity(long stockQuantity) { this.stockQuantity = stockQuantity; }
    public long getLowStockThreshold() { return lowStockThreshold; } public void setLowStockThreshold(long lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }
    public BigDecimal getAverageRating() { return averageRating; } public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }
    public long getTotalReviews() { return totalReviews; } public void setTotalReviews(long totalReviews) { this.totalReviews = totalReviews; }
    public BigDecimal getDiscountPercentage() { return discountPercentage; } public void setDiscountPercentage(BigDecimal discountPercentage) { this.discountPercentage = discountPercentage; }
    public LocalDateTime getLastUpdated() { return lastUpdated; } public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
