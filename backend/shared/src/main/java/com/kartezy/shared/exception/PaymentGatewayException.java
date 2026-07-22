package com.kartezy.shared.exception;

/**
 * Exception thrown when a payment gateway operation fails.
 * This includes Razorpay API failures, network errors, and invalid responses.
 */
public class PaymentGatewayException extends BaseException {

    public PaymentGatewayException(String message) {
        super(message, "PAYMENT_GATEWAY_ERROR");
    }

    public PaymentGatewayException(String message, Throwable cause) {
        super(message, cause);
    }
}
