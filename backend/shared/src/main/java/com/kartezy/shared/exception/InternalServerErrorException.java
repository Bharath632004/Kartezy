package com.kartezy.shared.exception;

/**
 * Exception thrown when an internal server error occurs.
 */
public class InternalServerErrorException extends BaseException {

    public InternalServerErrorException(String message) {
        super(message);
    }

    public InternalServerErrorException(String message, String errorCode, Object... errorParams) {
        super(message, errorCode, errorParams);
    }
}