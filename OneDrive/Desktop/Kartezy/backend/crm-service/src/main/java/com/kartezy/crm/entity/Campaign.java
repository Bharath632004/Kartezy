package com.kartezy.crm.entity;

import com.kartezy.crm.constants.CampaignChannel;
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
@Table(name = "campaigns", indexes = {
    @Index(name = "idx_camp_status", columnList = "status"),
    @Index(name = "idx_camp_channel", columnList = "channel"),
    @Index(name = "idx_camp_type", columnList = "campaignType"),
    @Index(name = "idx_camp_schedule", columnList = "scheduledAt")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Campaign extends BaseCrmEntity {

    @Column(name = "campaign_name", nullable = false, length = 200)
    private String campaignName;

    @Column(name = "description", length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "channel", nullable = false, length = 30)
    private CampaignChannel channel;

    @Column(name = "campaign_type", length = 50)
    private String campaignType;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "segment_id")
    private Long segmentId;

    @Column(name = "segment_name", length = 200)
    private String segmentName;

    @Column(name = "target_audience_size")
    private Integer targetAudienceSize;

    @Column(name = "subject_line", length = 500)
    private String subjectLine;

    @Column(name = "preheader", length = 200)
    private String preheader;

    @Column(name = "sender_name", length = 200)
    private String senderName;

    @Column(name = "sender_email", length = 200)
    private String senderEmail;

    @Column(name = "template_id", length = 100)
    private String templateId;

    @Column(name = "content_html", columnDefinition = "TEXT")
    private String contentHtml;

    @Column(name = "content_text", columnDefinition = "TEXT")
    private String contentText;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "sent_count")
    private Integer sentCount;

    @Column(name = "delivered_count")
    private Integer deliveredCount;

    @Column(name = "opened_count")
    private Integer openedCount;

    @Column(name = "clicked_count")
    private Integer clickedCount;

    @Column(name = "conversion_count")
    private Integer conversionCount;

    @Column(name = "conversion_revenue", precision = 20, scale = 4)
    private BigDecimal conversionRevenue;

    @Column(name = "bounce_count")
    private Integer bounceCount;

    @Column(name = "unsubscribe_count")
    private Integer unsubscribeCount;

    @Column(name = "complaint_count")
    private Integer complaintCount;

    @Column(name = "budget", precision = 20, scale = 4)
    private BigDecimal budget;

    @Column(name = "actual_cost", precision = 20, scale = 4)
    private BigDecimal actualCost;

    @Column(name = "is_ab_test")
    private boolean isAbTest;

    @Column(name = "ab_test_winner", length = 50)
    private String abTestWinner;

    @Column(name = "created_by_user", length = 100)
    private String createdByUser;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "notes", length = 2000)
    private String notes;
}
