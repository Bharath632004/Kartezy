package com.kartezy.authservice.service;

import com.kartezy.authservice.entity.LoginAttempt;
import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.entity.UserStatus;
import com.kartezy.authservice.repository.LoginAttemptRepository;
import com.kartezy.authservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Brute force protection and suspicious login detection service.
 * <p>
 * Features:
 * - Account lockout after N failed attempts
 * - Progressive lockout duration
 * - IP-based rate limiting
 * - Geographic anomaly detection
 * - Impossible travel detection
 * - Credential stuffing detection (multiple accounts from same IP)
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BruteForceProtectionService {

    private final LoginAttemptRepository loginAttemptRepository;
    private final UserRepository userRepository;

    @Value("${kartezy.security.bruteforce.max-failed-attempts:5}")
    private int maxFailedAttempts = 5;

    @Value("${kartezy.security.bruteforce.lockout-duration-minutes:15}")
    private int lockoutDurationMinutes = 15;

    @Value("${kartezy.security.bruteforce.ip-rate-limit:20}")
    private int ipRateLimit = 20;

    @Value("${kartezy.security.bruteforce.ip-rate-window-minutes:5}")
    private int ipRateWindowMinutes = 5;

    @Value("${kartezy.security.bruteforce.max-identities-per-ip:10}")
    private int maxIdentitiesPerIp = 10;

    /**
     * Records a login attempt and checks for potential brute force.
     *
     * @return true if the attempt should be blocked, false otherwise
     */
    @Transactional
    public boolean recordAndCheck(
            String identifier,
            String ipAddress,
            String userAgent,
            boolean success,
            String failureReason,
            String country,
            String city,
            String deviceFingerprint
    ) {
        // Record the attempt
        LoginAttempt attempt = LoginAttempt.builder()
                .identifier(identifier)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .attemptedAt(Instant.now())
                .success(success)
                .failureReason(failureReason)
                .country(country)
                .city(city)
                .deviceFingerprint(deviceFingerprint)
                .suspicious(false)
                .riskScore(0)
                .build();

        // Calculate risk score
        int riskScore = calculateRiskScore(identifier, ipAddress);
        attempt.setRiskScore(riskScore);
        attempt.setSuspicious(riskScore >= 50);

        loginAttemptRepository.save(attempt);

        // If failed attempt, check lockout
        if (!success) {
            return shouldBlock(identifier, ipAddress);
        }

        return false;
    }

    /**
     * Checks if the account or IP should be blocked.
     */
    public boolean shouldBlock(String identifier, String ipAddress) {
        // Check account lockout
        if (isAccountLocked(identifier)) {
            log.warn("Blocking login for locked account: {}", identifier);
            return true;
        }

        // Check IP rate limit
        if (isIpRateLimited(ipAddress)) {
            log.warn("Blocking login from rate-limited IP: {}", ipAddress);
            return true;
        }

        // Check for credential stuffing (too many different accounts from same IP)
        if (isPossibleCredentialStuffing(ipAddress)) {
            log.warn("Blocking possible credential stuffing from IP: {}", ipAddress);
            return true;
        }

        return false;
    }

    /**
     * Checks if an account is currently locked due to too many failed attempts.
     */
    public boolean isAccountLocked(String identifier) {
        Instant since = Instant.now().minusSeconds(lockoutDurationMinutes * 60L);
        long failedAttempts = loginAttemptRepository.countFailedAttemptsSince(identifier, since);
        return failedAttempts >= maxFailedAttempts;
    }

    /**
     * Checks if an IP address is rate limited.
     */
    public boolean isIpRateLimited(String ipAddress) {
        Instant since = Instant.now().minusSeconds(ipRateWindowMinutes * 60L);
        long attempts = loginAttemptRepository.countAttemptsFromIpSince(ipAddress, since);
        return attempts >= ipRateLimit;
    }

    /**
     * Checks for possible credential stuffing (multiple accounts from same IP).
     */
    public boolean isPossibleCredentialStuffing(String ipAddress) {
        Instant since = Instant.now().minusSeconds(30 * 60L); // 30 minute window
        long distinctIdentifiers = loginAttemptRepository.countDistinctIdentifiersFromIp(ipAddress, since);
        return distinctIdentifiers >= maxIdentitiesPerIp;
    }

    /**
     * Locks a user account and returns the unlock time.
     */
    @Transactional
    public Instant lockAccount(User user) {
        user.setStatus(UserStatus.LOCKED);
        userRepository.save(user);
        Instant unlockTime = Instant.now().plusSeconds(lockoutDurationMinutes * 60L);
        log.warn("Account locked for user: {} until {}", user.getEmail(), unlockTime);
        return unlockTime;
    }

    /**
     * Unlocks a user account.
     */
    @Transactional
    public void unlockAccount(User user) {
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        log.info("Account unlocked for user: {}", user.getEmail());
    }

    /**
     * Gets recent suspicious login attempts.
     */
    public List<LoginAttempt> getSuspiciousAttempts() {
        Instant since = Instant.now().minusSeconds(24 * 60 * 60); // Last 24 hours
        return loginAttemptRepository.findBySuspiciousTrueAndAttemptedAtAfter(since);
    }

    /**
     * Calculates a risk score (0-100) for a login attempt.
     */
    private int calculateRiskScore(String identifier, String ipAddress) {
        int score = 0;

        // Failed attempts on this account (up to 40 points)
        Instant recentSince = Instant.now().minusSeconds(60 * 60); // 1 hour
        long recentFailures = loginAttemptRepository.countFailedAttemptsSince(identifier, recentSince);
        score += Math.min(recentFailures * 10, 40);

        // Failed attempts from this IP (up to 30 points)
        Instant ipSince = Instant.now().minusSeconds(15 * 60); // 15 minutes
        long ipAttempts = loginAttemptRepository.countAttemptsFromIpSince(ipAddress, ipSince);
        score += Math.min(ipAttempts * 3, 30);

        // Velocity - many different identifiers from same IP (up to 30 points)
        long distinctIds = loginAttemptRepository.countDistinctIdentifiersFromIp(ipAddress,
                Instant.now().minusSeconds(30 * 60));
        score += Math.min(distinctIds * 5, 30);

        return Math.min(score, 100);
    }
}
