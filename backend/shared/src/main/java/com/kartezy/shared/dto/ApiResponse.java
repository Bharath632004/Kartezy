package com.kartezy.shared.dto;

import java.time.Instant;
import java.util.List;

/**
 * Generic API response wrapper.
 * @param <T> The type of the data payload.
 */
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String message;
    private Instant timestamp;
    private String traceId;

    public ApiResponse() {
        this.timestamp = Instant.now();
    }

    public ApiResponse(boolean success, T data, String message) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.timestamp = Instant.now();
    }

    public ApiResponse(boolean success, T data, String message, String traceId) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.timestamp = Instant.now();
        this.traceId = traceId;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    // Static builder methods for success and error responses
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, "Success");
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }

    public static <T> ApiResponse<T> error(String message, String traceId) {
        return new ApiResponse<>(false, null, message, traceId);
    }
}