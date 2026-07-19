package com.kartezy.finance.entity;

import com.kartezy.finance.constants.GSTType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "gst_records", indexes = {
    @Index(name = "idx_gst_return", columnList = "returnPeriod"),
    @Index(name = "idx_gst_gstin", columnList = "gstin"),
    @Index(name = "idx_gst_type", columnList = "gstType")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class GSTRecord extends BaseEntity {

    @Column(name = "gstin", length = 20)
    private String gstin;

    @Column(name = "gst_type", length = 10)
    @Enumerated(EnumType.STRING)
    private GSTType gstType;

    @Column(name = "return_period", length = 10)
    private String returnPeriod;

    @Column(name = "filing_date")
    private LocalDate filingDate;

    @Column(name = "transaction_date")
    private LocalDate transactionDate;

    @Column(name = "transaction_type", length = 30)
    private String transactionType;

    @Column(name = "invoice_reference", length = 100)
    private String invoiceReference;

    @Column(name = "invoice_id")
    private Long invoiceId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "party_name", length = 200)
    private String partyName;

    @Column(name = "party_gstin", length = 20)
    private String partyGstin;

    @Column(name = "taxable_value", precision = 20, scale = 4)
    private BigDecimal taxableValue;

    @Column(name = "tax_rate", precision = 10, scale = 4)
    private BigDecimal taxRate;

    @Column(name = "tax_amount", precision = 20, scale = 4)
    private BigDecimal taxAmount;

    @Column(name = "cess_amount", precision = 20, scale = 4)
    private BigDecimal cessAmount;

    @Column(name = "total_tax", precision = 20, scale = 4)
    private BigDecimal totalTax;

    @Column(name = "is_input_credit")
    private boolean isInputCredit;

    @Column(name = "is_output_liability")
    private boolean isOutputLiability;

    @Column(name = "return_filed")
    private boolean returnFiled;

    @Column(name = "return_type", length = 20)
    private String returnType;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "notes", length = 1000)
    private String notes;
}
