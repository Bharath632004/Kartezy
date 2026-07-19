package com.kartezy.crm.exception;

public class CrmException extends RuntimeException {
    private final String errorCode;

    public CrmException(String message) {
        super(message);
        this.errorCode = "CRM_ERROR";
    }

    public CrmException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() { return errorCode; }
}
