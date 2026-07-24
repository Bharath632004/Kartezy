package com.kartezy.authservice.service;

import com.kartezy.authservice.entity.MfaDevice;
import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.repository.MfaBackupCodeRepository;
import com.kartezy.authservice.repository.MfaDeviceRepository;
import com.kartezy.authservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests for MfaService.
 */
@ExtendWith(MockitoExtension.class)
public class MfaServiceTest {

    @Mock
    private MfaDeviceRepository mfaDeviceRepository;

    @Mock
    private MfaBackupCodeRepository backupCodeRepository;

    @Mock
    private UserRepository userRepository;

    private MfaService mfaService;
    private PasswordEncoder passwordEncoder;
    private User testUser;

    @BeforeEach
    public void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        mfaService = new MfaService(mfaDeviceRepository, backupCodeRepository,
                userRepository, passwordEncoder);
        ReflectionTestUtils.setField(mfaService, "encryptionKey",
                "dGVzdEtleUZvckFFUzI1NkVuY3J5cHRpb25UZXN0aW5nMTIz");
        ReflectionTestUtils.setField(mfaService, "mfaIssuer", "kartezy.com");

        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@kartezy.com")
                .build();
    }

    @Test
    public void testEnrollMfa() {
        when(mfaDeviceRepository.save(any(MfaDevice.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(backupCodeRepository.findByUserAndUsedFalse(any()))
                .thenReturn(List.of());
        when(userRepository.save(any())).thenReturn(testUser);

        var result = mfaService.enroll(testUser, "My Phone");

        assertNotNull(result);
        assertNotNull(result.secret());
        assertNotNull(result.provisioningUri());
        assertTrue(result.provisioningUri().startsWith("otpauth://totp/"));
        assertNotNull(result.backupCodes());
        assertFalse(result.backupCodes().isEmpty());

        verify(mfaDeviceRepository).save(any(MfaDevice.class));
        verify(userRepository).save(testUser);
        assertTrue(testUser.isMfaEnabled());
    }

    @Test
    public void testBackupCodeGeneration() {
        when(mfaDeviceRepository.findByUserAndActiveTrue(any()))
                .thenReturn(List.of());
        when(backupCodeRepository.countByUserAndUsedFalse(any()))
                .thenReturn(10L);

        var status = mfaService.getMfaStatus(testUser);

        assertNotNull(status);
        assertFalse(status.mfaEnabled());
        assertEquals(10L, status.backupCodeCount());
    }

    @Test
    public void testMfaStatus() {
        when(mfaDeviceRepository.countByUserAndActiveTrue(any())).thenReturn(0L);
        when(backupCodeRepository.countByUserAndUsedFalse(any())).thenReturn(5L);
        when(mfaDeviceRepository.existsByUserAndVerifiedTrue(any())).thenReturn(false);

        assertFalse(mfaService.isMfaEnabled(testUser));

        when(mfaDeviceRepository.existsByUserAndVerifiedTrue(any())).thenReturn(true);

        // Enable MFA on user
        testUser.setMfaEnabled(true);
        assertTrue(mfaService.isMfaEnabled(testUser));
    }
}
