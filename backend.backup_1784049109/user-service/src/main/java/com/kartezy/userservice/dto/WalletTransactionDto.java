package com.kartezy.userservice.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;
/**
 * Data Transfer Object for Wallet Transaction
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransactionDto {
    private Long id;
    private Long walletReferenceId;
    private String type; // e.g., DEBIT, CREDIT, REFUND
    private BigDecimal amount;
    private String currency;
    private String description;
    private Instant timestamp;
    private String referenceId; // e.g., order id, payment id
}