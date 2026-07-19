package com.kartezy.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "marketing_automation_rules", indexes = {
    @Index(name = "idx_mar_status", columnList = "isActive")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class MarketingAutomationRule extends BaseCrmEntity {

    @Column(name = "rule_name", nullable = false, length = 200)
    private String ruleName;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "trigger_event", length = 50)
    private String triggerEvent;

    @Column(name = "trigger_conditions_json", columnDefinition = "JSONB")
    private String triggerConditionsJson;

    @Column(name = "action_type", length = 50)
    private String actionType;

    @Column(name = "action_config_json", columnDefinition = "JSONB")
    private String actionConfigJson;

    @Column(name = "campaign_id")
    private Long campaignId;

    @Column(name = "segment_id")
    private Long segmentId;

    @Column(name = "delay_minutes")
    private Integer delayMinutes;

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "execution_count")
    private Integer executionCount;

    @Column(name = "last_executed_at")
    private java.time.LocalDateTime lastExecutedAt;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "created_by_user", length = 100)
    private String createdByUser;
}
