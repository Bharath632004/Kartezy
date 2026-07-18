package com.kartezy.securitydashboard.controller;

import com.kartezy.shared.security.audit.AuditEvent;
import com.kartezy.shared.security.audit.AuditEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST controller for the Security Dashboard.
 * Provides endpoints for viewing security events, metrics, and dashboard data.
 */
@RestController
@RequestMapping("/api/security/dashboard")
public class SecurityDashboardController {

    @Autowired
    private AuditEventRepository auditEventRepository;

    /**
     * Get security events for the dashboard.
     * @param startTime Optional start time for filtering (ISO 8601 format)
     * @param endTime Optional end time for filtering (ISO 8601 format)
     * @param eventType Optional event type for filtering
     * @param limit Maximum number of events to return
     * @return List of security events
     */
    @GetMapping("/events")
    public ResponseEntity<List<AuditEvent>> getSecurityEvents(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endTime,
            @RequestParam(required = false) String eventType,
            @RequestParam(defaultValue = "100") int limit) {

        List<AuditEvent> events;
        if (startTime != null && endTime != null) {
            if (eventType != null) {
                events = auditEventRepository.findByEventTypeAndEventTimestampBetweenOrderByEventTimestampDesc(
                        eventType, startTime, endTime);
            } else {
                events = auditEventRepository.findByEventTimestampBetweenOrderByEventTimestampDesc(startTime, endTime);
            }
        } else if (eventType != null) {
            events = auditEventRepository.findTop100ByEventTypeOrderByEventTimestampDesc(eventType);
        } else {
            events = auditEventRepository.findTop100ByOrderByEventTimestampDesc();
        }

        // Limit results if needed
        if (events.size() > limit) {
            events = events.subList(0, limit);
        }

        return ResponseEntity.ok(events);
    }

    /**
     * Get security metrics for the dashboard.
     * @return Map containing various security metrics
     */
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getSecurityMetrics() {
        // Get counts for different event types
        long totalEvents = auditEventRepository.count();
        long loginSuccessCount = auditEventRepository.countByEventType("LOGIN_SUCCESS");
        long loginFailureCount = auditEventRepository.countByEventType("LOGIN_FAILURE");
        long accessDeniedCount = auditEventRepository.countByEventType("ACCESS_DENIED");

        // Calculate success rate
        double loginSuccessRate = 0.0;
        long totalLoginAttempts = loginSuccessCount + loginFailureCount;
        if (totalLoginAttempts > 0) {
            loginSuccessRate = ((double) loginSuccessCount / totalLoginAttempts) * 100;
        }

        // Get recent events (last 24 hours)
        long recentEvents = auditEventRepository.countByEventTimestampAfter(Instant.now().minusSeconds(86400));

        // Build response
        Map<String, Object> metrics = java.util.Map.of(
                "totalEvents", totalEvents,
                "loginSuccessCount", loginSuccessCount,
                "loginFailureCount", loginFailureCount,
                "accessDeniedCount", accessDeniedCount,
                "loginSuccessRate", String.format("%.2f%%", loginSuccessRate),
                "recentEvents24h", recentEvents,
                "timestamp", Instant.now().toString()
        );

        return ResponseEntity.ok(metrics);
    }

    /**
     * Get event type distribution for charts.
     * @return Map of event types to their counts
     */
    @GetMapping("/events/distribution")
    public ResponseEntity<Map<String, Long>> getEventTypeDistribution() {
        // Get all events and group by event type
        List<AuditEvent> allEvents = auditEventRepository.findAll();

        Map<String, Long> distribution = allEvents.stream()
                .collect(Collectors.groupingBy(AuditEvent::getEventType, Collectors.counting()));

        return ResponseEntity.ok(distribution);
    }
}