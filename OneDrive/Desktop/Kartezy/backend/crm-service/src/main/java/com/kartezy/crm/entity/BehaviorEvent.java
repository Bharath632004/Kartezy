package com.kartezy.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "behavior_events", indexes = {
    @Index(name = "idx_be_customer", columnList = "customerId"),
    @Index(name = "idx_be_type", columnList = "eventType"),
    @Index(name = "idx_be_timestamp", columnList = "eventTime"),
    @Index(name = "idx_be_session", columnList = "sessionId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class BehaviorEvent extends BaseCrmEntity {

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(name = "event_name", length = 200)
    private String eventName;

    @Column(name = "event_time", nullable = false)
    private LocalDateTime eventTime;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(name = "page_url", length = 500)
    private String pageUrl;

    @Column(name = "page_title", length = 500)
    private String pageTitle;

    @Column(name = "referrer_url", length = 500)
    private String referrerUrl;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "properties_json", columnDefinition = "JSONB")
    private String propertiesJson;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "value", length = 500)
    private String value;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "device_type", length = 30)
    private String deviceType;

    @Column(name = "platform", length = 30)
    private String platform;
}
