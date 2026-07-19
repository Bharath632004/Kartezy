package com.kartezy.cmsservice.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "cms_banners")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CmsBanner {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, length = 200)
    private String title;
    @Column(length = 500)
    private String subtitle;
    @Column(nullable = false, length = 500)
    private String imageUrl;
    @Column(length = 500)
    private String linkUrl;
    @Column(length = 50)
    private String position;
    @Column(nullable = false)
    private int sortOrder;
    @Column(nullable = false)
    private boolean isActive;
    @Column(nullable = false)
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); isActive = true; }
}
