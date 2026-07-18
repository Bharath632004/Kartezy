package com.kartezy.shared.security.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Implementation of AuditLogService that persists audit events using JPA.
 */
@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditEventRepository auditEventRepository;

    @Autowired
    public AuditLogServiceImpl(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    @Override
    public void loginSuccess(String principal, String ipAddress) {
        logEvent("LOGIN_SUCCESS", principal, ipAddress, "User logged in successfully", "SUCCESS", null, Instant.now());
    }

    @Override
    public void loginFailure(String principal, String ipAddress, String reason) {
        logEvent("LOGIN_FAILURE", principal, ipAddress, "Login failed: " + reason, "FAILURE", null, Instant.now());
    }

    @Override
    public void logout(String principal, String ipAddress) {
        logEvent("LOGOUT", principal, ipAddress, "User logged out", "SUCCESS", null, Instant.now());
    }

    @Override
    public void accessDenied(String principal, String ipAddress, String resource) {
        logEvent("ACCESS_DENIED", principal, ipAddress, "Access denied to resource: " + resource, "FAILURE", null, Instant.now());
    }

    @Override
    public void permissionChange(String principal, String ipAddress, String details) {
        logEvent("PERMISSION_CHANGE", principal, ipAddress, "Permissions changed", "SUCCESS", details, Instant.now());
    }

    @Override
    public void logEvent(String eventType, String principal, String ipAddress, String description, String outcome, String details, Instant eventTimestamp) {
        AuditEvent event = new AuditEvent();
        event.setEventType(eventType);
        event.setPrincipal(principal);
        event.setIpAddress(ipAddress);
        event.setDescription(description);
        event.setOutcome(outcome);
        event.setDetails(details);
        event.setEventTimestamp(eventTimestamp);
        auditEventRepository.save(event);
    }
}