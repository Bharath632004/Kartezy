package com.kartezy.finance.exception;

public class FinanceException extends RuntimeException {
    private final String errorCode;

    public FinanceException(String message) {
        super(message);
        this.errorCode = "FINANCE_ERROR";
    }

    public FinanceException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public FinanceException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "FINANCE_ERROR";
    }

    public String getErrorCode() {
        return errorCode;
    }
}
