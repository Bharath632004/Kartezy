package com.kartezy.finance.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kartezy.finance.constants.AuditAction;
import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.entity.AuditLog;
import com.kartezy.finance.event.KafkaEventPublisher;
import com.kartezy.finance.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;
    private final KafkaEventPublisher eventPublisher;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AuditLog log(AuditAction action, String entityType, Long entityId,
                        String entityNumber, String performedBy,
                        String oldValue, String newValue) {
        return logWithDetails(action, entityType, entityId, entityNumber, performedBy,
            oldValue, newValue, null, null, null, null);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AuditLog logWithDetails(AuditAction action, String entityType, Long entityId,
                                    String entityNumber, String performedBy,
                                    String oldValue, String newValue,
                                    String ipAddress, String userAgent,
                                    String requestId, String sessionId) {

        String changesSummary = generateChangesSummary(oldValue, newValue);

        AuditLog auditLog = AuditLog.builder()
            .action(action)
            .entityType(entityType)
            .entityId(entityId)
            .entityNumber(entityNumber)
            .performedBy(performedBy)
            .performedAt(LocalDateTime.now())
            .ipAddress(ipAddress)
            .userAgent(userAgent)
            .oldValue(truncate(oldValue, 5000))
            .newValue(truncate(newValue, 5000))
            .changesSummary(changesSummary)
            .description(action.name() + " on " + entityType + " #" + (entityNumber != null ? entityNumber : entityId))
            .isSystemGenerated(performedBy == null || "SYSTEM".equalsIgnoreCase(performedBy))
            .requestId(requestId)
            .sessionId(sessionId)
            .build();

        AuditLog saved = auditLogRepository.save(auditLog);

        // Publish audit event to Kafka for real-time monitoring
        eventPublisher.publishAuditEvent(saved);

        return saved;
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getEntityAuditLogs(String entityType, Long entityId, Pageable pageable) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByPerformedAtDesc(entityType, entityId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getUserAuditLogs(String username, Pageable pageable) {
        return auditLogRepository.findByPerformedByOrderByPerformedAtDesc(username, pageable);
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByAction(AuditAction action, Pageable pageable) {
        return auditLogRepository.findByActionOrderByPerformedAtDesc(action, pageable);
    }

    private String generateChangesSummary(String oldValue, String newValue) {
        if (oldValue == null && newValue == null) return null;
        if (oldValue == null) return "Created new record";
        if (newValue == null) return "Deleted record";

        try {
            Map<String, Object> oldMap = objectMapper.readValue(oldValue, Map.class);
            Map<String, Object> newMap = objectMapper.readValue(newValue, Map.class);

            StringBuilder summary = new StringBuilder();
            for (Map.Entry<String, Object> entry : newMap.entrySet()) {
                Object oldVal = oldMap.get(entry.getKey());
                Object newVal = entry.getValue();
                if (oldVal != null && !oldVal.equals(newVal)) {
                    if (summary.length() > 0) summary.append("; ");
                    summary.append(entry.getKey()).append(": ").append(oldVal).append(" -> ").append(newVal);
                } else if (oldVal == null && newVal != null) {
                    if (summary.length() > 0) summary.append("; ");
                    summary.append(entry.getKey()).append(": [null] -> ").append(newVal);
                }
            }
            return summary.isEmpty() ? "No changes detected" : summary.toString();
        } catch (Exception e) {
            return "Changes detected";
        }
    }

    private String truncate(String value, int maxLength) {
        if (value == null) return null;
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }
}
