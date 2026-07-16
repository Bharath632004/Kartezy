package com.kartezy.analyticsservice.dto;

import org.springframework.data.domain.Page;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class AnalyticsResponseDto<T> {
    private Page<T> content;
}
