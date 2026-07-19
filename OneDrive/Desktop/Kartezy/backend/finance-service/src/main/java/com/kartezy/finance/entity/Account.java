package com.kartezy.finance.entity;

import com.kartezy.finance.constants.AccountSubType;
import com.kartezy.finance.constants.AccountType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "accounts", indexes = {
    @Index(name = "idx_account_code", columnList = "accountCode", unique = true),
    @Index(name = "idx_account_type", columnList = "accountType"),
    @Index(name = "idx_account_parent", columnList = "parentAccountId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Account extends BaseEntity {

    @Column(name = "account_code", nullable = false, unique = true, length = 20)
    private String accountCode;

    @Column(name = "account_name", nullable = false, length = 200)
    private String accountName;

    @Column(name = "account_description", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 30)
    private AccountType accountType;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_sub_type", length = 30)
    private AccountSubType accountSubType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_account_id")
    private Account parentAccount;

    @Column(name = "is_control_account")
    private boolean isControlAccount;

    @Column(name = "opening_balance", precision = 20, scale = 4)
    private BigDecimal openingBalance;

    @Column(name = "current_balance", precision = 20, scale = 4)
    private BigDecimal currentBalance;

    @Column(name = "credit_limit", precision = 20, scale = 4)
    private BigDecimal creditLimit;

    @Column(name = "currency", length = 3)
    private String currency;

    @Column(name = "is_bank_account")
    private boolean isBankAccount;

    @Column(name = "bank_name", length = 200)
    private String bankName;

    @Column(name = "account_number_encrypted", length = 500)
    private String accountNumberEncrypted;

    @Column(name = "ifsc_code", length = 20)
    private String ifscCode;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "level")
    private Integer level;

    @Column(name = "path", length = 500)
    private String path;
}
