package com.kartezy.walletservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletTopUpRequestDto {
    private UUID userId;
    private BigDecimal amount;
    private String paymentMethod;
    private String description;
}
