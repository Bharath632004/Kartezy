package com.kartezy.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "campaign_variants", indexes = {
    @Index(name = "idx_cv_campaign", columnList = "campaignId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignVariant extends BaseCrmEntity {

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "variant_name", length = 200)
    private String variantName;

    @Column(name = "variant_type", length = 30)
    private String variantType;

    @Column(name = "subject_line", length = 500)
    private String subjectLine;

    @Column(name = "content_html", columnDefinition = "TEXT")
    private String contentHtml;

    @Column(name = "content_text", columnDefinition = "TEXT")
    private String contentText;

    @Column(name = "audience_percentage")
    private Integer audiencePercentage;

    @Column(name = "sent_count")
    private Integer sentCount;

    @Column(name = "opened_count")
    private Integer openedCount;

    @Column(name = "clicked_count")
    private Integer clickedCount;

    @Column(name = "conversion_count")
    private Integer conversionCount;

    @Column(name = "is_winner")
    private boolean isWinner;

    @Column(name = "status", length = 30)
    private String status;
}
