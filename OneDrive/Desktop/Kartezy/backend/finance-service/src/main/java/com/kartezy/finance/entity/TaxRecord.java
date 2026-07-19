package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tax_records", indexes = {
    @Index(name = "idx_tax_type", columnList = "taxType"),
    @Index(name = "idx_tax_entity", columnList = "entityType,entityId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TaxRecord extends BaseEntity {

    @Column(name = "tax_type", nullable = false, length = 30)
    private String taxType;

    @Column(name = "tax_name", length = 100)
    private String taxName;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "tax_rate", precision = 10, scale = 4)
    private BigDecimal taxRate;

    @Column(name = "entity_type", length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "entity_number", length = 50)
    private String entityNumber;

    @Column(name = "taxable_amount", precision = 20, scale = 4)
    private BigDecimal taxableAmount;

    @Column(name = "tax_amount", precision = 20, scale = 4)
    private BigDecimal taxAmount;

    @Column(name = "transaction_date")
    private LocalDate transactionDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "is_deducted_at_source")
    private boolean isDeductedAtSource;

    @Column(name = "tds_section", length = 20)
    private String tdsSection;

    @Column(name = "tds_rate", precision = 10, scale = 4)
    private BigDecimal tdsRate;

    @Column(name = "payment_reference", length = 200)
    private String paymentReference;

    @Column(name = "notes", length = 1000)
    private String notes;
}
