package com.kartezy.shared.dto;

import java.time.Instant;
import java.util.List;

public class ErrorResponse {
    private boolean success;
    private String message;
    private List<String> errors;
    private String traceId;
    private Instant timestamp;

    public ErrorResponse() {
        this.timestamp = Instant.now();
    }

    public ErrorResponse(boolean success, String message, List<String> errors, String traceId, Instant timestamp) {
        this.success = success;
        this.message = message;
        this.errors = errors;
        this.traceId = traceId;
        this.timestamp = timestamp;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public List<String> getErrors() { return errors; }
    public void setErrors(List<String> errors) { this.errors = errors; }
    public String getTraceId() { return traceId; }
    public void setTraceId(String traceId) { this.traceId = traceId; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
