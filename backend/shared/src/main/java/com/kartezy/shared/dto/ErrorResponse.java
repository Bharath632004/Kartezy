package com.kartezy.shared.dto;

import java.time.Instant;
import java.util.List;

/**
 * Standardized error response for API errors.
 */
public class ErrorResponse {

    private String message;
    private String errorCode;
    private Instant timestamp;
    private List<String> details;
    private String traceId;

    public ErrorResponse() {
        this.timestamp = Instant.now();
    }

    public ErrorResponse(String message, String errorCode) {
        this.message = message;
        this.errorCode = errorCode;
        this.timestamp = Instant.now();
    }

    public ErrorResponse(String message, String errorCode, List<String> details) {
        this.message = message;
        this.errorCode = errorCode;
        this.details = details;
        this.timestamp = Instant.now();
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }
}