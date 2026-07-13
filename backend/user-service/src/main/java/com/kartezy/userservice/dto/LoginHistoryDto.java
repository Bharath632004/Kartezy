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
    private String ipAddress;
    private String userAgent;
    private String deviceInfo: The correct. Let's rewrite properly.

We need to produce a proper DTO. Let's restart.

We'll write a simple LoginHistoryDto with fields: id, userId, loginTime, ipAddress, userAgent, success.

Let's do<tool_call>
<function=Write>
<parameter=content>
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