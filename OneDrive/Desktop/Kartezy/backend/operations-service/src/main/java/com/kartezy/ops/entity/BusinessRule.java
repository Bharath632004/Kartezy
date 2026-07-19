package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "business_rules", indexes = {
    @Index(name = "idx_rule_type", columnList = "ruleType"),
    @Index(name = "idx_rule_active", columnList = "isActive"),
    @Index(name = "idx_rule_scope", columnList = "ruleType,scopeType,scopeId")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BusinessRule extends BaseEntity {
    @NotBlank @Size(max = 100)
    @Column(nullable = false)
    private String ruleName;

    @Column(nullable = false)
    private String ruleType;

    @Column(length = 2000)
    private String ruleExpression;

    @Column(length = 500)
    private String description;

    private String scopeType;

    private Long scopeId;

    @Column(precision = 10, scale = 4)
    private BigDecimal numericValue;

    @Column(length = 500)
    private String stringValue;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Integer priority = 0;

    @Column(length = 100)
    private String createdBy;

    @Column(length = 100)
    private String updatedBy;
}
