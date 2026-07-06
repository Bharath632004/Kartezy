package com.kartezy.shared.util;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Utility class for validation operations using Jakarta Bean Validation.
 */
public final class ValidationUtil {

    private static final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static final Validator validator = factory.getValidator();

    private ValidationUtil() {
        // Prevent instantiation
    }

    /**
     * Validates the given object and throws a ConstraintViolationException if any constraints are violated.
     *
     * @param object the object to validate
     * @param <T>    the type of the object
     */
    public static <T> void validate(T object) {
        Set<ConstraintViolation<T>> violations = validator.validate(object);
        if (!violations.isEmpty()) {
            String message = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException("Validation failed: " + message);
        }
    }

    /**
     * Validates the given object and returns a set of constraint violations.
     *
     * @param object the object to validate
     * @param <T>    the type of the object
     * @return a set of constraint violations, empty if the object is valid
     */
    public static <T> Set<ConstraintViolation<T>> validateToSet(T object) {
        return validator.validate(object);
    }
}