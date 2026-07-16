package com.kartezy.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelineEntryDto {
    private UUID id;
    private String status;
    private String description;
    private String updatedBy;
    private LocalDateTime createdAt;
}
