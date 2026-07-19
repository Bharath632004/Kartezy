package com.kartezy.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "notification_templates", indexes = {
    @Index(name = "idx_nt_channel", columnList = "channel"),
    @Index(name = "idx_nt_name", columnList = "templateName")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTemplate extends BaseCrmEntity {

    @Column(name = "template_name", nullable = false, length = 200)
    private String templateName;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "channel", nullable = false, length = 30)
    private String channel;

    @Column(name = "subject_line", length = 500)
    private String subjectLine;

    @Column(name = "content_html", columnDefinition = "TEXT")
    private String contentHtml;

    @Column(name = "content_text", columnDefinition = "TEXT")
    private String contentText;

    @Column(name = "variables_json", columnDefinition = "JSONB")
    private String variablesJson;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "is_draft")
    private boolean isDraft;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "created_by_user", length = 100)
    private String createdByUser;
}
