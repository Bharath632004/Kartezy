package com.kartezy.merchantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

/**
 * Data Transfer Object for Store Business Hours.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreBusinessHoursDto {
    private UUID id;
    private UUID storeId;
    private String dayOfWeek;
    private LocalTime openTime;
    private LocalTime closeTime;
    private Boolean isOpen;
}
