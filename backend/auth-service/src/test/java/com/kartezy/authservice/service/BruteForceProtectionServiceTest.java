package com.kartezy.authservice.service;

import com.kartezy.authservice.entity.LoginAttempt;
import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.entity.UserStatus;
import com.kartezy.authservice.repository.LoginAttemptRepository;
import com.kartezy.authservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests for BruteForceProtectionService.
 */
@ExtendWith(MockitoExtension.class)
public class BruteForceProtectionServiceTest {

    @Mock
    private LoginAttemptRepository loginAttemptRepository;

    @Mock
    private UserRepository userRepository;

    private BruteForceProtectionService service;
    private User testUser;

    @BeforeEach
    public void setUp() {
        service = new BruteForceProtectionService(loginAttemptRepository, userRepository);
        ReflectionTestUtils.setField(service, "maxFailedAttempts", 5);
        ReflectionTestUtils.setField(service, "lockoutDurationMinutes", 15);
        ReflectionTestUtils.setField(service, "ipRateLimit", 20);
        ReflectionTestUtils.setField(service, "ipRateWindowMinutes", 5);
        ReflectionTestUtils.setField(service, "maxIdentitiesPerIp", 10);

        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@kartezy.com")
                .status(UserStatus.ACTIVE)
                .build();
    }

    @Test
    public void testAccountNotLockedAfterFewAttempts() {
        when(loginAttemptRepository.countFailedAttemptsSince(anyString(), any()))
                .thenReturn(2L);
        when(loginAttemptRepository.countAttemptsFromIpSince(anyString(), any()))
                .thenReturn(1L);
        when(loginAttemptRepository.countDistinctIdentifiersFromIp(anyString(), any()))
                .thenReturn(2L);

        boolean shouldBlock = service.shouldBlock("test@kartezy.com", "192.168.1.1");
        assertFalse(shouldBlock, "Should not block after 2 failed attempts");
    }

    @Test
    public void testAccountLockedAfterManyAttempts() {
        when(loginAttemptRepository.countFailedAttemptsSince(anyString(), any()))
                .thenReturn(5L);

        boolean shouldBlock = service.shouldBlock("test@kartezy.com", "192.168.1.1");
        assertTrue(shouldBlock, "Should block after 5 failed attempts");
    }

    @Test
    public void testIpRateLimited() {
        when(loginAttemptRepository.countFailedAttemptsSince(anyString(), any()))
                .thenReturn(0L);
        when(loginAttemptRepository.countAttemptsFromIpSince(anyString(), any()))
                .thenReturn(20L);

        boolean shouldBlock = service.shouldBlock("test@kartezy.com", "192.168.1.1");
        assertTrue(shouldBlock, "Should block rate-limited IP");
    }

    @Test
    public void testCredentialStuffingDetected() {
        when(loginAttemptRepository.countFailedAttemptsSince(anyString(), any()))
                .thenReturn(0L);
        when(loginAttemptRepository.countAttemptsFromIpSince(anyString(), any()))
                .thenReturn(5L);
        when(loginAttemptRepository.countDistinctIdentifiersFromIp(anyString(), any()))
                .thenReturn(10L);

        boolean shouldBlock = service.shouldBlock("test@kartezy.com", "192.168.1.1");
        assertTrue(shouldBlock, "Should block credential stuffing");
    }

    @Test
    public void testLockAccount() {
        when(userRepository.save(any())).thenReturn(testUser);

        service.lockAccount(testUser);

        assertEquals(UserStatus.LOCKED, testUser.getStatus());
        verify(userRepository).save(testUser);
    }

    @Test
    public void testUnlockAccount() {
        testUser.setStatus(UserStatus.LOCKED);
        when(userRepository.save(any())).thenReturn(testUser);

        service.unlockAccount(testUser);

        assertEquals(UserStatus.ACTIVE, testUser.getStatus());
        verify(userRepository).save(testUser);
    }
}
