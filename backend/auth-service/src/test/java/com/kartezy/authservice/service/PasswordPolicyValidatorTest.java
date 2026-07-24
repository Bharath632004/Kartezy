package com.kartezy.authservice.service;

import com.kartezy.shared.security.crypto.PasswordPolicyValidator;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for PasswordPolicyValidator.
 */
public class PasswordPolicyValidatorTest {

    @Test
    public void testValidPassword() {
        var result = PasswordPolicyValidator.validate("SecureP@ss1");
        assertTrue(result.isValid(), "Strong password should be valid");
        assertTrue(result.getErrors().isEmpty());
    }

    @Test
    public void testShortPassword() {
        var result = PasswordPolicyValidator.validate("Sh0rt!@");
        assertFalse(result.isValid(), "Short password should be invalid");
        assertTrue(result.getErrors().stream()
                .anyMatch(e -> e.contains("at least 12")));
    }

    @Test
    public void testNoUppercase() {
        var result = PasswordPolicyValidator.validate("alllowercase1@345");
        assertFalse(result.isValid());
        assertTrue(result.getErrors().stream()
                .anyMatch(e -> e.contains("uppercase")));
    }

    @Test
    public void testNoLowercase() {
        var result = PasswordPolicyValidator.validate("ALLUPPERCASE1@345");
        assertFalse(result.isValid());
        assertTrue(result.getErrors().stream()
                .anyMatch(e -> e.contains("lowercase")));
    }

    @Test
    public void testNoDigit() {
        var result = PasswordPolicyValidator.validate("NoDigitsHere!@#");
        assertFalse(result.isValid());
        assertTrue(result.getErrors().stream()
                .anyMatch(e -> e.contains("digit")));
    }

    @Test
    public void testNoSpecialChar() {
        var result = PasswordPolicyValidator.validate("NoSpecialChar123");
        assertFalse(result.isValid());
        assertTrue(result.getErrors().stream()
                .anyMatch(e -> e.contains("special")));
    }

    @Test
    public void testCommonPassword() {
        var result = PasswordPolicyValidator.validate("P@ssword12345!");
        assertFalse(result.isValid(), "Common password should be rejected");
        assertTrue(result.getErrors().stream()
                .anyMatch(e -> e.contains("common")));
    }

    @Test
    public void testSequentialChars() {
        var result = PasswordPolicyValidator.validate("MyP@ssword123abc");
        assertFalse(result.isValid());
        assertTrue(result.getErrors().stream()
                .anyMatch(e -> e.contains("sequential")));
    }

    @Test
    public void testRepeatedChars() {
        var result = PasswordPolicyValidator.validate("MyP@ssword111xyz");
        assertFalse(result.isValid());
        assertTrue(result.getErrors().stream()
                .anyMatch(e -> e.contains("repeated")));
    }

    @Test
    public void testKeyboardPattern() {
        var result = PasswordPolicyValidator.validate("QwertyP@ss123");
        assertFalse(result.isValid());
        assertTrue(result.getErrors().stream()
                .anyMatch(e -> e.contains("keyboard")));
    }

    @Test
    public void testNullPassword() {
        var result = PasswordPolicyValidator.validate(null);
        assertFalse(result.isValid());
    }

    @Test
    public void testEmptyPassword() {
        var result = PasswordPolicyValidator.validate("");
        assertFalse(result.isValid());
    }

    @Test
    public void testVeryStrongPassword() {
        var result = PasswordPolicyValidator.validate("K@rtezy$ecure!2024#Platform");
        assertTrue(result.isValid(), "Very strong password should pass all checks");
    }
}
