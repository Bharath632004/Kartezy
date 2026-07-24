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
public class BannerDto {
    private UUID id;

    @NotBlank @Size(max = 200)
    private String title;

    @Size(max = 500)
    private String description;

    @NotBlank @Size(max = 500)
    private String imageUrl;

    @Size(max = 500)
    private String linkUrl;

    @NotBlank @Size(max = 50)
    private String position;

    private int sortOrder;

    private boolean active;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private LocalDateTime createdAt;
}
