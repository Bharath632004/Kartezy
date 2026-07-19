package com.kartezy.shared.exception;
/**
 * Exception thrown when an authenticated user does not have permission to perform an action.
 */
public class ForbiddenException extends BaseException {
    public ForbiddenException(String message) {
        super(message);
    }
    public ForbiddenException(String message, String errorCode, Object... errorParams) {
        super(message, errorCode, errorParams);
    }
}