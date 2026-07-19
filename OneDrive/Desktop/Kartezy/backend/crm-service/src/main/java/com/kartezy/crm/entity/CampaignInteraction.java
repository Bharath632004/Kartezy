package com.kartezy.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "campaign_interactions", indexes = {
    @Index(name = "idx_ci_campaign", columnList = "campaignId"),
    @Index(name = "idx_ci_customer", columnList = "customerId"),
    @Index(name = "idx_ci_type", columnList = "interactionType"),
    @Index(name = "idx_ci_time", columnList = "interactionTime")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignInteraction extends BaseCrmEntity {

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "campaign_variant_id")
    private Long campaignVariantId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "recipient_email", length = 200)
    private String recipientEmail;

    @Column(name = "recipient_phone", length = 20)
    private String recipientPhone;

    @Column(name = "interaction_type", nullable = false, length = 30)
    private String interactionType;

    @Column(name = "interaction_time", nullable = false)
    private LocalDateTime interactionTime;

    @Column(name = "message_id", length = 200)
    private String messageId;

    @Column(name = "device_type", length = 30)
    private String deviceType;

    @Column(name = "platform", length = 30)
    private String platform;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "url_clicked", length = 500)
    private String urlClicked;

    @Column(name = "conversion_value")
    private Double conversionValue;

    @Column(name = "properties_json", columnDefinition = "JSONB")
    private String propertiesJson;
}
