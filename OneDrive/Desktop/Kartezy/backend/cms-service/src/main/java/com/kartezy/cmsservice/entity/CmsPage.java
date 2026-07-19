package com.kartezy.cmsservice.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "cms_pages", indexes = {
    @Index(name = "idx_cms_slug", columnList = "slug", unique = true),
    @Index(name = "idx_cms_status", columnList = "status")
})
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CmsPage {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, unique = true, length = 200)
    private String slug;
    @Column(nullable = false, length = 200)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(length = 500)
    private String metaTitle;
    @Column(length = 1000)
    private String metaDescription;
    @Column(length = 500)
    private String metaKeywords;
    @Column(length = 50)
    private String status;
    @Column(length = 200)
    private String template;
    private UUID featuredImageId;
    @Column(nullable = false)
    private int sortOrder;
    @Column(nullable = false)
    private boolean isPublished;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    @Column(length = 100)
    private String createdBy;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); status = "DRAFT"; }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
