package com.kartezy.shared.exception;

/**
 * Exception thrown when an authenticated user does not have permission to perform an action.
 * This will be implemented in Phase 3.
 */
public class ForbiddenException extends BaseException {

    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException(String message, String errorCode, Object... errorParams) {
        super(message, errorCode, errorParams);
    }
}