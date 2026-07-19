package com.kartezy.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "customer_segments", indexes = {
    @Index(name = "idx_cs_status", columnList = "isActive")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSegment extends BaseCrmEntity {

    @Column(name = "segment_name", nullable = false, length = 200)
    private String segmentName;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "criteria_json", columnDefinition = "JSONB")
    private String criteriaJson;

    @Column(name = "member_count")
    private Integer memberCount;

    @Column(name = "is_dynamic")
    private boolean isDynamic;

    @Column(name = "refresh_interval_minutes")
    private Integer refreshIntervalMinutes;

    @Column(name = "last_refreshed_at")
    private java.time.LocalDateTime lastRefreshedAt;

    @Column(name = "color", length = 20)
    private String color;

    @Column(name = "icon", length = 50)
    private String icon;

    @Column(name = "created_by_user", length = 100)
    private String createdByUser;
}
