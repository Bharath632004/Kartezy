package com.kartezy.auditservice.service;

import com.kartezy.auditservice.dto.AuditLogDto;
import com.kartezy.auditservice.entity.AuditLog;
import com.kartezy.auditservice.repository.AuditLogRepository;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public AuditLogDto createAuditLog(AuditLogDto request) {
        AuditLog auditLog = AuditLog.builder()
            .userId(request.getUserId())
            .action(request.getAction())
            .resourceType(request.getResourceType())
            .resourceId(request.getResourceId())
            .details(request.getDetails())
            .ipAddress(request.getIpAddress())
            .userAgent(request.getUserAgent())
            .status(request.getStatus() != null ? request.getStatus() : "SUCCESS")
            .build();
        auditLog = auditLogRepository.save(auditLog);
        return toDto(auditLog);
    }

    public List<AuditLogDto> getAuditLogs(UUID userId, String action, LocalDateTime from, LocalDateTime to) {
        if (userId != null) {
            return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
        }
        if (action != null) {
            return auditLogRepository.findByActionOrderByCreatedAtDesc(action)
                .stream().map(this::toDto).collect(Collectors.toList());
        }
        if (from != null && to != null) {
            return auditLogRepository.findByCreatedAtBetween(from, to)
                .stream().map(this::toDto).collect(Collectors.toList());
        }
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc()
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public AuditLogDto getAuditLog(UUID id) {
        return toDto(auditLogRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Audit log not found: " + id)));
    }

    private AuditLogDto toDto(AuditLog auditLog) {
        return AuditLogDto.builder()
            .id(auditLog.getId()).userId(auditLog.getUserId())
            .action(auditLog.getAction()).resourceType(auditLog.getResourceType())
            .resourceId(auditLog.getResourceId()).details(auditLog.getDetails())
            .ipAddress(auditLog.getIpAddress()).userAgent(auditLog.getUserAgent())
            .status(auditLog.getStatus()).createdAt(auditLog.getCreatedAt()).build();
    }
}
