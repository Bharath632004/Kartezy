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
public class FaqDto {
    private UUID id;

    @NotBlank @Size(max = 500)
    private String question;

    @NotBlank
    private String answer;

    @NotBlank @Size(max = 100)
    private String category;

    private int sortOrder;

    private boolean active;

    private LocalDateTime createdAt;
}
