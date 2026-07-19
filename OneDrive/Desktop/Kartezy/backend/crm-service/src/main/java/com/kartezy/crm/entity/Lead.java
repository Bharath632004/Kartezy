package com.kartezy.crm.entity;

import com.kartezy.crm.constants.LeadSource;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads", indexes = {
    @Index(name = "idx_lead_email", columnList = "email"),
    @Index(name = "idx_lead_status", columnList = "status"),
    @Index(name = "idx_lead_source", columnList = "source"),
    @Index(name = "idx_lead_owner", columnList = "assignedTo"),
    @Index(name = "idx_lead_score", columnList = "leadScore")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Lead extends BaseCrmEntity {

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "email", length = 200)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "company", length = 200)
    private String company;

    @Column(name = "designation", length = 200)
    private String designation;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", length = 30)
    private LeadSource source;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "lead_score")
    private Integer leadScore;

    @Column(name = "budget", precision = 20, scale = 4)
    private BigDecimal budget;

    @Column(name = "interest_category", length = 200)
    private String interestCategory;

    @Column(name = "message", length = 2000)
    private String message;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "expected_close_date")
    private LocalDate expectedCloseDate;

    @Column(name = "converted_to_user_id")
    private Long convertedToUserId;

    @Column(name = "converted_at")
    private LocalDateTime convertedAt;

    @Column(name = "conversion_value", precision = 20, scale = 4)
    private BigDecimal conversionValue;

    @Column(name = "last_contacted_at")
    private LocalDateTime lastContactedAt;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "campaign_id")
    private Long campaignId;

    @Column(name = "utm_source", length = 100)
    private String utmSource;

    @Column(name = "utm_medium", length = 100)
    private String utmMedium;

    @Column(name = "utm_campaign", length = 100)
    private String utmCampaign;
}
