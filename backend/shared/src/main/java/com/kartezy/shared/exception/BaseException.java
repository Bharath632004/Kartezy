package com.kartezy.shared.exception;

/**
 * Base exception for all custom exceptions in the application.
 */
public class BaseException extends RuntimeException {

    private String errorCode;
    private Object[] errorParams;

    public BaseException(String message) {
        super(message);
    }

    public BaseException(String message, Throwable cause) {
        super(message, cause);
    }

    public BaseException(String message, String errorCode, Object... errorParams) {
        super(message);
        this.errorCode = errorCode;
        this.errorParams = errorParams;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public Object[] getErrorParams() {
        return errorParams;
    }

    public void setErrorParams(Object[] errorParams) {
        this.errorParams = errorParams;
    }
}