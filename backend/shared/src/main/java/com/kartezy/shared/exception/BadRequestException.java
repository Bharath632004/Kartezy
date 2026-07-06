package com.kartezy.shared.exception;

/**
 * Exception thrown when a bad request is made.
 */
public class BadRequestException extends BaseException {

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, String errorCode, Object... errorParams) {
        super(message, errorCode, errorParams);
    }
}