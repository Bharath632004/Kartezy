package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "vendors", indexes = {
    @Index(name = "idx_vendor_code", columnList = "vendorCode", unique = true),
    @Index(name = "idx_vendor_status", columnList = "status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor extends BaseEntity {

    @Column(name = "vendor_code", nullable = false, unique = true, length = 50)
    private String vendorCode;

    @Column(name = "vendor_name", nullable = false, length = 200)
    private String vendorName;

    @Column(name = "contact_person", length = 200)
    private String contactPerson;

    @Column(name = "email", length = 200)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "gstin", length = 20)
    private String gstin;

    @Column(name = "pan", length = 20)
    private String pan;

    @Column(name = "address_line1", length = 500)
    private String addressLine1;

    @Column(name = "address_line2", length = 500)
    private String addressLine2;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "pincode", length = 10)
    private String pincode;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "bank_name", length = 200)
    private String bankName;

    @Column(name = "bank_account_number_encrypted", length = 500)
    private String bankAccountNumberEncrypted;

    @Column(name = "ifsc_code", length = 20)
    private String ifscCode;

    @Column(name = "payment_terms", length = 100)
    private String paymentTerms;

    @Column(name = "credit_days")
    private Integer creditDays;

    @Column(name = "credit_limit", precision = 20, scale = 4)
    private BigDecimal creditLimit;

    @Column(name = "outstanding_amount", precision = 20, scale = 4)
    private BigDecimal outstandingAmount;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "notes", length = 2000)
    private String notes;
}
