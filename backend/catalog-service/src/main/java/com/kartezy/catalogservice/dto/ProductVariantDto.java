package com.kartezy.catalogservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDto {
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
