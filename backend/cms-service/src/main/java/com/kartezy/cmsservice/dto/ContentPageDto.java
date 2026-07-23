package com.kartezy.cmsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentPageDto {
    private UUID id;
    private String slug;
    private String title;
    private String content;
    private String metaDescription;
    private String metaKeywords;
    private boolean active;
    private boolean published;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
}
