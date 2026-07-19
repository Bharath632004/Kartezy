package com.kartezy.ops.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest {
    private String userId;
    private String email;
    private String phone;
    private String type;
    private String subject;
    private String body;
    private Map<String, String> templateVariables;
}
