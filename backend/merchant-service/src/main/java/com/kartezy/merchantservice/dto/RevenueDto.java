package com.kartezy.merchantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Data Transfer Object for Merchant Revenue
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueDto {
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private String currency;
}