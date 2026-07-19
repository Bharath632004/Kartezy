package com.kartezy.finance.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSettlementRequest {

    @NotNull(message = "Merchant ID is required")
    private Long merchantId;

    @NotBlank(message = "Merchant name is required")
    private String merchantName;

    @NotNull(message = "Cycle start date is required")
    private LocalDate cycleStart;

    @NotNull(message = "Cycle end date is required")
    private LocalDate cycleEnd;

    @NotEmpty(message = "At least one transaction is required")
    @Valid
    private List<SettlementTransactionItem> transactions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SettlementTransactionItem {
        @NotNull private Long orderId;
        private String orderNumber;
        @Positive private BigDecimal orderAmount;
        private BigDecimal commissionAmount;
        private BigDecimal deliveryFee;
        private BigDecimal platformFee;
        private BigDecimal gstAmount;
        private BigDecimal tdsAmount;
        private BigDecimal adjustmentAmount;
    }

    // Custom annotation placeholder
    public @interface NotEmpty {
        String message() default "List must not be empty";
    }
    public @interface Valid {}
}
