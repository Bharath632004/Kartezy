package com.kartezy.financeservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDto {
    private UUID id;

    @NotBlank @Size(max = 50)
    private String invoiceNumber;

    @NotNull
    private UUID orderId;

    @NotNull
    private UUID merchantId;

    @NotNull
    private UUID userId;

    @NotNull @Positive
    private BigDecimal amount;

    @NotNull @Positive
    private BigDecimal tax;

    @NotNull @Positive
    private BigDecimal totalAmount;

    @NotBlank
    private String status;

    @Size(max = 10)
    private String currency;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime paidAt;

    private LocalDateTime dueDate;
}
