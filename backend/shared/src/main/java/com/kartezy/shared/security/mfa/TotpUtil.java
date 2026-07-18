package com.kratezy.shared.security.mfa;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Utility class for generating and validating Time-based One-Time Passwords (TOTP)
 * as per RFC 6238.
 */
public class TotpUtil {

    private static final int CODE_DIGITS = 6;
    private static long TIME_STEP_SIZE = 30; // 30 seconds
    private static final String HMAC_ALGORITHM = "HmacSHA1";

    private TotpUtil() {
        // Prevent instantiation
    }

    /**
     * Generates a random secret key for TOTP.
     *
     * @return a Base64-encoded secret key (16 bytes)
     * @throws GeneralSecurityException if a secure random number generator is not available
     */
    public static String generateSecret() throws GeneralSecurityException {
        SecureRandom random = SecureRandom.getInstanceStrong();
        byte[] bytes = new byte[16]; // 128-bit key
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    /**
     * Computes the TOTP code for the given secret and time step.
     *
     * @param secretBase64 the Base64-encoded secret key
     * @param timeMillis   the current time in milliseconds since the epoch
     * @return the TOTP code as a string of CODE_DIGITS digits
     * @throws GeneralSecurityException if there is an error with the HMAC computation
     */
    public static String generateTotp(String secretBase64, long timeMillis) throws GeneralSecurityException {
        byte[] decodedKey = Base64.getDecoder().decode(secretBase64);
        long T = (timeMillis / 1000L) / TIME_STEP_SIZE;
        byte[] data = longToBytes(T);
        byte[] hash = computeHmacSha1(data, decodedKey);

        int offset = hash[hash.length - 1] & 0xF;
        int truncatedHash = 0;
        for (int i = 0; i < 4; ++i) {
            truncatedHash <<= 8;
            truncatedHash |= (hash[offset + i] & 0xFF);
        }
        truncatedHash &= 0x7FFFFFFF; // Remove the most significant bit
        int code = truncatedHash % ((int) Math.pow(10, CODE_DIGITS));

        return String.format("%0" + CODE_DIGITS + "d", code);
    }

    /**
     * Validates the provided TOTP code against the secret and current time.
     * Allows for a window of +/- 1 time step to account for clock skew.
     *
     * @param secretBase64 the Base64-encoded secret key
     * @param code         the TOTP code to validate
     * @param timeMillis   the current time in milliseconds since the epoch
     * @return true if the code is valid, false otherwise
     * @throws GeneralSecurityException if there is an error with the HMAC computation
     */
    public static boolean validateTotp(String secretBase64, String code, long timeMillis) throws GeneralSecurityException {
        // Check the current time step
        if (verifyCode(secretBase64, code, timeMillis)) {
            return true;
        }
        // Check the previous time step
        if (verifyCode(secretBase64, code, timeMillis - TIME_STEP_SIZE * 1000)) {
            return true;
        }
        // Check the next time step
        if (verifyCode(secretBase64, code, timeMillis + TIME_STEP_SIZE * 1000)) {
            return true;
        }
        return false;
    }

    private static boolean verifyCode(String secretBase64, String code, long timeMillis) throws GeneralSecurityException {
        String generatedCode = generateTotp(secretBase64, timeMillis);
        return code.equals(generatedCode);
    }

    private static byte[] longToBytes(long value) {
        byte[] buffer = new byte[8];
        for (int i = 8; i-- > 0; value >>>= 8) {
            buffer[i] = (byte) value;
        }
        return buffer;
    }

    private static byte[] computeHmacSha1(byte[] data, byte[] key) throws GeneralSecurityException {
        SecretKeySpec signKey = new SecretKeySpec(key, HMAC_ALGORITHM);
        Mac mac = Mac.getInstance(HMAC_ALGORITHM);
        mac.init(signKey);
        return mac.doFinal(data);
    }
}