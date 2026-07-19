package com.kartezy.finance.dto.request;

import com.kartezy.finance.constants.JournalEntryType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class CreateJournalEntryRequest {

    private String entryNumber;

    @NotNull(message = "Entry date is required")
    private LocalDate entryDate;

    @NotNull(message = "Entry type is required")
    private JournalEntryType entryType;

    @NotBlank(message = "Description is required")
    private String description;

    private String referenceNumber;
    private String referenceType;

    @NotEmpty(message = "At least one line item is required")
    @Valid
    private List<JournalLineItem> lines;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JournalLineItem {
        @NotNull(message = "Account ID is required")
        private Long accountId;

        private String description;

        private BigDecimal debitAmount;
        private BigDecimal creditAmount;

        private String referenceId;
        private String referenceType;
    }
}
