package com.kartezy.merchantservice.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
/**
 * Data Transfer Object for Merchant Commission
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionDto {
    private BigDecimal commissionRate; // percentage
    private BigDecimal earnedCommission;
    private String currency;
}