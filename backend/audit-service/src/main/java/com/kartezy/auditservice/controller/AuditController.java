package com.kartezy.auditservice.controller;

import com.kartezy.auditservice.dto.AuditLogDto;
import com.kartezy.auditservice.service.AuditService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @PostMapping("/logs")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AuditLogDto>> createAuditLog(@RequestBody AuditLogDto request) {
        AuditLogDto log = auditService.createAuditLog(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(log, "Audit log created"));
    }

    @GetMapping("/logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAuditLogs(
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to) {
        return ResponseEntity.ok(ApiResponse.success(auditService.getAuditLogs(userId, action, from, to)));
    }

    @GetMapping("/logs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuditLogDto>> getAuditLog(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(auditService.getAuditLog(id)));
    }
}
