package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cities", indexes = {
    @Index(name = "idx_city_status", columnList = "status"),
    @Index(name = "idx_city_region", columnList = "region")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class City extends BaseEntity {
    @NotBlank @Size(max = 100)
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank @Size(max = 100)
    @Column(nullable = false)
    private String state;

    @NotBlank @Size(max = 100)
    @Column(nullable = false)
    private String region;

    @Size(max = 10)
    private String countryCode;

    @Column(nullable = false)
    @Builder.Default
    private String status = "LAUNCHING";

    private LocalDate launchDate;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude;

    @Builder.Default
    private Integer serviceablePinCodes = 0;

    @Builder.Default
    private Integer activeMerchants = 0;

    @Builder.Default
    private Integer activeCustomers = 0;

    @Column(length = 500)
    private String notes;

    @Builder.Default
    private Boolean isActive = true;
}
