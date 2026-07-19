package com.kartezy.finance.controller;

import com.kartezy.finance.constants.AuditAction;
import com.kartezy.finance.entity.AuditLog;
import com.kartezy.finance.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/audit")
@RequiredArgsConstructor
@Tag(name = "Audit Trail", description = "Comprehensive audit logging and tracking")
public class AuditController {

    private final AuditService auditService;

    @GetMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "Get audit logs for an entity")
    public ResponseEntity<Map<String, Object>> getEntityAuditLogs(
        @PathVariable String entityType,
        @PathVariable Long entityId,
        Pageable pageable) {
        Page<AuditLog> logs = auditService.getEntityAuditLogs(entityType, entityId, pageable);
        return ResponseEntity.ok(wrapResponse(logs, "Audit logs retrieved"));
    }

    @GetMapping("/user/{username}")
    @Operation(summary = "Get audit logs by user")
    public ResponseEntity<Map<String, Object>> getUserAuditLogs(
        @PathVariable String username,
        Pageable pageable) {
        Page<AuditLog> logs = auditService.getUserAuditLogs(username, pageable);
        return ResponseEntity.ok(wrapResponse(logs, "User audit logs retrieved"));
    }

    @GetMapping("/action/{action}")
    @Operation(summary = "Get audit logs by action type")
    public ResponseEntity<Map<String, Object>> getAuditLogsByAction(
        @PathVariable AuditAction action,
        Pageable pageable) {
        Page<AuditLog> logs = auditService.getAuditLogsByAction(action, pageable);
        return ResponseEntity.ok(wrapResponse(logs, "Audit logs by action retrieved"));
    }

    private Map<String, Object> wrapResponse(Object data, String message) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
