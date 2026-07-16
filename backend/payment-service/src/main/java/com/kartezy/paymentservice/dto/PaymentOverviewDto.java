package com.kartezy.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOverviewDto {
    private long totalPayments;
    private long successfulPayments;
    private long failedPayments;
    private long refundedPayments;
    private long pendingRefunds;
    private long pendingSettlements;
    private long upiPayments;
    private long codPayments;
    private long cardPayments;
    private long walletPayments;
}
