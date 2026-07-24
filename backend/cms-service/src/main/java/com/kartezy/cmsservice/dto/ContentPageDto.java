package com.kartezy.cmsservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    @NotBlank @Size(max = 200)
    private String slug;

    @NotBlank @Size(max = 200)
    private String title;

    @NotBlank
    private String content;

    @Size(max = 500)
    private String metaDescription;

    @Size(max = 500)
    private String metaKeywords;

    private boolean active;

    private boolean published;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime publishedAt;
}
