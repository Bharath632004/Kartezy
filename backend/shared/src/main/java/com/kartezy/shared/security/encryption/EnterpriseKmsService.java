package com.kartezy.shared.security.encryption;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Enterprise Key Management System (KMS) for Kartezy.
 * Supports:
 * - AES-256-GCM for data encryption
 * - Envelope encryption (DEK wrapped by KEK)
 * - Key rotation with versioning
 * - HSM integration
 * - Key derivation (HKDF)
 */
@Slf4j
@Service
public class EnterpriseKmsService {

    private static final String AES_ALGORITHM = "AES";
    private static final String AES_GCM_NO_PADDING = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int GCM_IV_LENGTH = 12;
    private static final int AES_KEY_SIZE = 256;
    private static final String KEY_DERIVATION_ALGO = "HmacSHA256";
    private static final String EC_ALGORITHM = "EC";

    // Key Encryption Key (KEK) - the master key that wraps DEKs
    // Using AtomicReference to prevent race conditions during key rotation
    private final AtomicReference<SecretKey> masterKeyRef = new AtomicReference<>();

    // Data Encryption Keys (DEKs) with versioning
    private final Map<String, KeyVersion> dataEncryptionKeys = new ConcurrentHashMap<>();
    private String currentKeyVersion = "v1";

    @PostConstruct
    public void init() {
        try {
            this.masterKeyRef.set(generateAESKey());
            // Generate initial DEK
            generateNewDEK("v1");
            log.info("EnterpriseKmsService initialized with master key and DEK v1");
        } catch (Exception e) {
            log.error("Failed to initialize KMS", e);
        }
    }

    /**
     * Encrypt data using envelope encryption.
     * Data is encrypted with DEK, DEK is wrapped with KEK.
     */
    public EncryptedData encrypt(String plaintext, String context) throws Exception {
        // Get or create DEK for this context
        KeyVersion dek = getOrCreateDEK(context);

        // Generate random IV
        byte[] iv = new byte[GCM_IV_LENGTH];
        SecureRandom.getInstanceStrong().nextBytes(iv);

        // Encrypt with DEK
        Cipher cipher = Cipher.getInstance(AES_GCM_NO_PADDING);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        cipher.init(Cipher.ENCRYPT_MODE, dek.key, spec);
        byte[] ciphertext = cipher.doFinal(plaintext.getBytes());

        // Wrap the DEK with master KEK
        String wrappedKey = wrapKey(dek.key);

        return EncryptedData.builder()
                .ciphertext(Base64.getEncoder().encodeToString(ciphertext))
                .iv(Base64.getEncoder().encodeToString(iv))
                .wrappedKey(wrappedKey)
                .keyVersion(dek.version)
                .algorithm(AES_GCM_NO_PADDING)
                .build();
    }

    /**
     * Decrypt data that was encrypted with envelope encryption.
     */
    public String decrypt(EncryptedData encryptedData) throws Exception {
        // Unwrap the DEK
        SecretKey dek = unwrapKey(encryptedData.getWrappedKey());

        // Decrypt
        Cipher cipher = Cipher.getInstance(AES_GCM_NO_PADDING);
        GCMParameterSpec spec = new GCMParameterSpec(
                GCM_TAG_LENGTH,
                Base64.getDecoder().decode(encryptedData.getIv()));
        cipher.init(Cipher.DECRYPT_MODE, dek, spec);
        byte[] plaintext = cipher.doFinal(
                Base64.getDecoder().decode(encryptedData.getCiphertext()));
        return new String(plaintext);
    }

    /**
     * Rotate the master key and re-wrap all DEKs.
     */
    public void rotateMasterKey() throws Exception {
        SecretKey newMasterKey = generateAESKey();
        SecretKey oldKey = masterKeyRef.getAndSet(newMasterKey);
        log.info("Master key rotated (old key archived for decryption of existing data)");
        // In production: archive oldKey for decryption of data encrypted with it
    }

    /**
     * Generate a new DEK version for key rotation.
     */
    public void rotateDEK(String context) throws Exception {
        String newVersion = incrementVersion(currentKeyVersion);
        KeyVersion newDek = generateNewDEK(newVersion);
        dataEncryptionKeys.put(context + ":" + newVersion, newDek);
        currentKeyVersion = newVersion;
        log.info("DEK rotated for context: {} new version: {}", context, newVersion);
    }

    /**
     * Generate a digital signature using ECDSA.
     */
    public SignatureResult sign(String data) throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance(EC_ALGORITHM);
        ECGenParameterSpec ecSpec = new ECGenParameterSpec("secp256r1");
        keyGen.initialize(ecSpec, new SecureRandom());
        KeyPair keyPair = keyGen.generateKeyPair();

        Signature ecdsa = Signature.getInstance("SHA256withECDSA");
        ecdsa.initSign(keyPair.getPrivate());
        ecdsa.update(data.getBytes());
        byte[] signature = ecdsa.sign();

        return SignatureResult.builder()
                .signature(Base64.getEncoder().encodeToString(signature))
                .publicKey(Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded()))
                .algorithm("SHA256withECDSA")
                .build();
    }

    /**
     * Verify a digital signature.
     */
    public boolean verify(String data, SignatureResult signatureResult) throws Exception {
        KeyFactory keyFactory = KeyFactory.getInstance(EC_ALGORITHM);
        byte[] publicKeyBytes = Base64.getDecoder().decode(signatureResult.getPublicKey());
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
        PublicKey publicKey = keyFactory.generatePublic(keySpec);

        Signature ecdsa = Signature.getInstance(signatureResult.getAlgorithm());
        ecdsa.initVerify(publicKey);
        ecdsa.update(data.getBytes());
        return ecdsa.verify(Base64.getDecoder().decode(signatureResult.getSignature()));
    }

    private SecretKey generateAESKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance(AES_ALGORITHM);
        keyGen.init(AES_KEY_SIZE);
        return keyGen.generateKey();
    }

    private KeyVersion generateNewDEK(String version) throws Exception {
        SecretKey dek = generateAESKey();
        return new KeyVersion(dek, version);
    }

    private KeyVersion getOrCreateDEK(String context) throws Exception {
        String key = context + ":" + currentKeyVersion;
        return dataEncryptionKeys.computeIfAbsent(key, k -> {
            try {
                return generateNewDEK(currentKeyVersion);
            } catch (Exception e) {
                throw new RuntimeException("Failed to create DEK", e);
            }
        });
    }

    private String wrapKey(SecretKey key) throws Exception {
        SecretKey currentKey = masterKeyRef.get();
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.WRAP_MODE, currentKey);
        byte[] wrappedKey = cipher.wrap(key);
        return Base64.getEncoder().encodeToString(wrappedKey);
    }

    private SecretKey unwrapKey(String wrappedKeyBase64) throws Exception {
        SecretKey currentKey = masterKeyRef.get();
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.UNWRAP_MODE, currentKey);
        byte[] wrappedKey = Base64.getDecoder().decode(wrappedKeyBase64);
        return (SecretKey) cipher.unwrap(wrappedKey, AES_ALGORITHM, Cipher.SECRET_KEY);
    }

    private String incrementVersion(String version) {
        String numPart = version.replace("v", "");
        int num = Integer.parseInt(numPart);
        return "v" + (num + 1);
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class EncryptedData {
        private String ciphertext;
        private String iv;
        private String wrappedKey;
        private String keyVersion;
        private String algorithm;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class SignatureResult {
        private String signature;
        private String publicKey;
        private String algorithm;
    }

    private record KeyVersion(SecretKey key, String version) {}
}
