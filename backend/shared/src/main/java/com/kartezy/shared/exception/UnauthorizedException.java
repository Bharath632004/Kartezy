package com.kartezy.shared.exception;
/**
 * Exception thrown when an unauthenticated request is made.
 */
public class UnauthorizedException extends BaseException {
    public UnauthorizedException(String message) {
        super(message);
    }
    public UnauthorizedException(String message, String errorCode, Object... errorParams) {
        super(message, errorCode, errorParams);
    }
}