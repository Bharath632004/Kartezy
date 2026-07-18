package com.kartezy.shared.security.audit;

import java.time.Instant;

/**
 * Service interface for logging security audit events.
 * Services can implement this interface to log audit events to their respective storage.
 */
public interface AuditLogService {

    /**
     * Logs a login success event.
     *
     * @param principal the user identifier (e.g., email, username)
     * @param ipAddress the IP address of the client
     */
    void loginSuccess(String principal, String ipAddress);

    /**
     * Logs a login failure event.
     *
     * @param principal the user identifier (e.g., email, username)
     * @param ipAddress the IP address of the client
     * @param reason    the reason for the failure (e.g., invalid credentials)
     */
    void loginFailure(String principal, String ipAddress, String reason);

    /**
     * Logs a logout event.
     *
     * @param principal the user identifier
     * @param ipAddress the IP address of the client
     */
    void logout(String principal, String ipAddress);

    /**
     * Logs an access denied event.
     *
     * @param principal the user identifier (if known, otherwise null)
     * @param ipAddress the IP address of the client
     * @param resource  the resource that was attempted to be accessed
     */
    void accessDenied(String principal, String ipAddress, String resource);

    /**
     * Logs a permission change event.
     *
     * @param principal the user identifier (the user whose permissions changed)
     * @param ipAddress the IP address of the client
     * @param details   details of the permission change
     */
    void permissionChange(String principal, String ipAddress, String details);

    /**
     * Logs a custom audit event.
     *
     * @param eventType     the type of event
     * @param principal     the user identifier (if applicable)
     * @param ipAddress     the IP address of the client
     * @param description   a description of the event
     * @param outcome       the outcome (e.g., SUCCESS, FAILURE)
     * @param details       additional details in JSON format
     * @param eventTimestamp the timestamp of the event (if not provided, current time is used)
     */
    void logEvent(String eventType, String principal, String ipAddress, String description, String outcome, String details, Instant eventTimestamp);
}