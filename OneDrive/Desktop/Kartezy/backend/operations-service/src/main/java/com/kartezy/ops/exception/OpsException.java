package com.kartezy.ops.exception;

public class OpsException extends RuntimeException {
    private final String errorCode;

    public OpsException(String message) {
        super(message);
        this.errorCode = "OPS_ERROR";
    }

    public OpsException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() { return errorCode; }
}
