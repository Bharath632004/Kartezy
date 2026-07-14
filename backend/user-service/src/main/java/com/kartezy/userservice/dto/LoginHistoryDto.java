package com.kartezy.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * Data Transfer Object for Login History
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginHistoryDto {
    private UUID id;
    private UUID userId;
    private Instant loginTime;
    private String ipAddress;
    private String userAgent;
    private boolean success;
}