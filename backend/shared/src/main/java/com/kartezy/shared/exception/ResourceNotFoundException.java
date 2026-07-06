package com.kartezy.shared.exception;

/**
 * Exception thrown when a resource is not found.
 */
public class ResourceNotFoundException extends BaseException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, String errorCode, Object... errorParams) {
        super(message, errorCode, errorParams);
    }
}