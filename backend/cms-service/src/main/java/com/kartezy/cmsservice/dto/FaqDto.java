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
public class FaqDto {
    private UUID id;
    private String question;
    private String answer;
    private String category;
    private int sortOrder;
    private boolean active;
    private LocalDateTime createdAt;
}
