package com.kartezy.analyticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchHistoryDto {
    private UUID id;
    private UUID customerProfileId;
    private String query;
    private LocalDateTime searchTime;
    private Integer resultsCount;
    private String clickedResultId;
    private String clickedResultType;
}
