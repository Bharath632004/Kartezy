package com.kartezy.catalogservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductEnhancedDto {
    private Long id;
    private String name;
    private String description;
    private String shortDescription;
    private String sku;
    private String barcode;
    private Long categoryId;
    private String categoryName;
    private Long merchantId;
    private String merchantName;
    private Long brandId;
    private String brandName;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;
    private Double taxRate;
    private BigDecimal weight;
    private String weightUnit;
    private String unit;
    private Integer stock;
    private Integer minStockLevel;
    private String status;
    private String images;
    private String videoUrl;
    private String seoTitle;
    private String seoDescription;
    private String metaKeywords;
    private boolean hasVariants;
    private boolean isReturnable;
    private boolean isCancellable;
    private String tags;
    private Integer sortOrder;
    private List<ProductVariantDto> variants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductVariantDto {
        private Long id;
        private String sku;
        private String name;
        private BigDecimal price;
        private BigDecimal compareAtPrice;
        private String option1Name;
        private String option1Value;
        private String option2Name;
        private String option2Value;
        private String option3Name;
        private String option3Value;
        private Integer stock;
        private boolean isActive;
        private String imageUrl;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BrandDto {
        private Long id;
        private String name;
        private String description;
        private String logoUrl;
        private String website;
        private boolean isActive;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductSearchDto {
        private Long id;
        private String name;
        private String sku;
        private String categoryName;
        private String merchantName;
        private String brandName;
        private BigDecimal price;
        private BigDecimal compareAtPrice;
        private Integer stock;
        private String status;
        private String imageUrl;
        private String unit;
        private Double rating;
        private boolean hasVariants;
    }
}
