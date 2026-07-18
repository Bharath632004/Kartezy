package com.kartezy.shared.security.encryption;

import java.security.Key;
import java.util.Base64;

/**
 * Utility class for wrapping (encrypting) and unwrapping (decrypting) keys.
 * This is used for securely transmitting or storing encryption keys.
 */
public class KeyWrapper {

    /**
     * Wraps (encrypts) a key using the provided wrapping key.
     *
     * @param key         the key to wrap
     * @param wrappingKey the key used to wrap the target key
     * @param algorithm   the algorithm to use for wrapping (e.g., "RSA/ECB/OAEPWithSHA-256AndMGF1Padding")
     * @return            the wrapped key as a Base64-encoded string
     * @throws Exception  if wrapping fails
     */
    public static String wrapKey(Key key, Key wrappingKey, String algorithm) throws Exception {
        javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance(algorithm);
        cipher.init(javax.crypto.Cipher.WRAP_MODE, wrappingKey);
        byte[] wrappedKey = cipher.wrap(key);
        return Base64.getEncoder().encodeToString(wrappedKey);
    }

    /**
     * Unwraps (decrypts) a key using the provided unwrapping key.
     *
     * @param wrappedKey  the Base64-encoded wrapped key
     * @param unwrappingKey the key used to unwrap the target key
     * @param algorithm   the algorithm to use for unwrapping
     * @param keyType     the type of the key to unwrap (e.g., "AES")
     * @return            the unwrapped key
     * @throws Exception  if unwrapping fails
     */
    public static javax.crypto.SecretKey unwrapKey(String wrappedKey, Key unwrappingKey,
                                                   String algorithm, String keyType) throws Exception {
        byte[] wrappedKeyBytes = Base64.getDecoder().decode(wrappedKey);
        javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance(algorithm);
        cipher.init(javax.crypto.Cipher.UNWRAP_MODE, unwrappingKey);
        return (javax.crypto.SecretKey) cipher.unwrap(wrappedKeyBytes, keyType, javax.crypto.Cipher.SECRET_KEY);
    }
}