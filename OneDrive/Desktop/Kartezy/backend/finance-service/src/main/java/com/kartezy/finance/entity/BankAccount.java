package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bank_accounts", indexes = {
    @Index(name = "idx_ba_merchant", columnList = "entityId"),
    @Index(name = "idx_ba_ifsc", columnList = "ifscCode"),
    @Index(name = "idx_ba_active", columnList = "isActive")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class BankAccount extends BaseEntity {

    @Column(name = "entity_type", nullable = false, length = 30)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "account_holder_name", length = 200)
    private String accountHolderName;

    @Column(name = "bank_name", nullable = false, length = 200)
    private String bankName;

    @Column(name = "branch_name", length = 200)
    private String branchName;

    @Column(name = "account_number_encrypted", nullable = false, length = 500)
    private String accountNumberEncrypted;

    @Column(name = "account_type", length = 30)
    private String accountType;

    @Column(name = "ifsc_code", nullable = false, length = 20)
    private String ifscCode;

    @Column(name = "micr_code", length = 20)
    private String micrCode;

    @Column(name = "upi_id", length = 100)
    private String upiId;

    @Column(name = "is_primary")
    private boolean isPrimary;

    @Column(name = "is_verified")
    private boolean isVerified;

    @Column(name = "verification_date")
    private LocalDate verificationDate;

    @Column(name = "current_balance", precision = 20, scale = 4)
    private BigDecimal currentBalance;

    @Column(name = "available_balance", precision = 20, scale = 4)
    private BigDecimal availableBalance;

    @Column(name = "currency", length = 3)
    private String currency;

    @Column(name = "last_synced_at")
    private java.time.LocalDateTime lastSyncedAt;

    @Column(name = "notes", length = 1000)
    private String notes;
}
