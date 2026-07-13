package com.kartezy.authservice;

import com.kartezy.authservice.dto.*;
import com.kartezy.authservice.entity.*;
import com.kartezy.authservice.repository.*;
import com.kartezy.authservice.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthServiceController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OTPRepository otpRepository;
    private final SessionRepository sessionRepository;
    private final DeviceRepository deviceRepository;
    private final OAuthAccountRepository oauthAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @GetMapping("")
    public String home() {
        return "Welcome to auth-service";
    }

    @GetMapping("/health")
    public String health() {
        return "auth-service is healthy";
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());
            if (optionalUser.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            User user = optionalUser.get();

            // Generate access token and refresh token
            String accessToken = jwtUtil.generateAccessToken(user.getEmail());
            String refreshToken = jwtUtil.generateRefreshToken();

            // Save refresh token to database
            RefreshToken refreshTokenEntity = RefreshToken.builder()
                    .user(user)
                    .token(refreshToken)
                    .expiryDate(Instant.now().plusMillis(jwtUtil.getRefreshExpiration()))
                    .revoked(false)
                    .build();
            refreshTokenRepository.save(refreshTokenEntity);

            // Create session and device records (optional)
            String sessionId = UUID.randomUUID().toString();
            String ipAddress = getClientIp(request);
            String userAgent = request.getHeader("User-Agent");

            Session session = Session.builder()
                    .user(user)
                    .sessionId(sessionId)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .lastAccessedAt(Instant.now())
                    .expiresAt(Instant.now().plusMillis(jwtUtil.getRefreshExpiration()))
                    .valid(true)
                    .build();
            sessionRepository.save(session);

            // Device (optional)
            String deviceId = request.getHeader("X-Device-ID"); // or generate from user agent
            if (deviceId != null && !deviceId.isBlank()) {
                Device device = Device.builder()
                        .user(user)
                        .deviceId(deviceId)
                        .deviceName(extractDeviceName(userAgent))
                        .deviceType(extractDeviceType(userAgent))
                        .os(extractOs(userAgent))
                        .browser(extractBrowser(userAgent))
                        .lastUsedAt(Instant.now())
                        .trusted(false)
                        .build();
                deviceRepository.save(device);
            }

            LoginResponse response = LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtUtil.getJwtExpiration() / 1000) // seconds
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (userRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("Phone number already exists");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .phoneNumber(registerRequest.getPhoneNumber())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .status(UserStatus.PENDING_VERIFICATION)
                .emailVerified(false)
                .phoneVerified(false)
                .mfaEnabled(false)
                .build();

        User savedUser = userRepository.save(user);

        // Optionally assign a default role (e.g., ROLE_USER)
        // roleRepository.findByName("ROLE_USER").ifPresent(role -> user.addRole(role));

        // Send verification OTPs (email and phone) - async task
        // For now, we just return success

        return ResponseEntity.ok("User registered successfully. Please verify your email and phone.");
    }

    // POST /api/auth/refresh
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        Optional<RefreshToken> optional = refreshTokenRepository.findByToken(refreshToken);
        if (optional.isEmpty() || optional.get().isRevoked() || optional.get().getExpiryDate().isBefore(Instant.now())) {
            return ResponseEntity.badRequest().body("Invalid refresh token");
        }
        RefreshToken tokenEntity = optional.get();
        User user = tokenEntity.getUser();

        // Generate new access token
        String accessToken = jwtUtil.generateAccessToken(user.getEmail());

        // Optionally rotate refresh token: revoke old and issue new
        tokenEntity.setRevoked(true);
        refreshTokenRepository.save(tokenEntity);

        String newRefreshToken = jwtUtil.generateRefreshToken();
        RefreshToken newRefreshTokenEntity = RefreshToken.builder()
                .user(user)
                .token(newRefreshToken)
                .expiryDate(Instant.now().plusMillis(jwtUtil.getRefreshExpiration()))
                .revoked(false)
                .build();
        refreshTokenRepository.save(newRefreshTokenEntity);

        return ResponseEntity.ok(new LoginResponse(
                accessToken,
                newRefreshToken,
                "Bearer",
                jwtUtil.getJwtExpiration() / 1000,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        ));
    }

    // POST /api/auth/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        String email = forgotPasswordRequest.getEmail();
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Generate OTP for password reset
            String otp = generateOtp(6);
            OTP otpEntity = OTP.builder()
                    .otp(otp)
                    .purpose("PASSWORD_RESET")
                    .expiresAt(Instant.now().plusMillis(15 * 60 * 1000)) // 15 minutes
                    .used(false)
                    .user(user)
                    .build();
            otpRepository.save(otpEntity);

            // Send OTP via email (async, using email service)
            // For now, just return success
            // In production, you would send the OTP to the user's email
        }
        // Always return same message to prevent user enumeration
        return ResponseEntity.ok("If the email exists, a password reset OTP has been sent.");
    }

    // POST /api/auth/reset-password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        String otp = resetPasswordRequest.getToken();
        String newPassword = resetPasswordRequest.getNewPassword();

        OTP otpEntity = otpRepository.findByOtpAndPurposeAndUsedFalse(otp, "PASSWORD_RESET")
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

        if (otpEntity.getExpiresAt().isBefore(Instant.now())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }

        // Mark OTP as used
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);

        // Find user associated with OTP
        User user = otpEntity.getUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully");
    }

    // POST /api/auth/send-otp
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest sendOtpRequest) {
        String contact = sendOtpRequest.getContact();
        String purpose = sendOtpRequest.getPurpose();

        // Determine if contact is email or phone
        boolean isEmail = contact.matches("^[^@]+@[^@]+\\.[^@]+$");
        User user = null;
        if (isEmail) {
            user = userRepository.findByEmail(contact).orElse(null);
        } else {
            user = userRepository.findByPhoneNumber(contact).orElse(null);
        }

        // Generate OTP
        String otp = generateOtp(6);
        OTP otpEntity = OTP.builder()
                .otp(otp)
                .purpose(purpose)
                .expiresAt(Instant.now().plusMillis(10 * 60 * 1000)) // 10 minutes
                .used(false)
                .user(user) // may be null if user not found (for signup verification)
                .build();
        otpRepository.save(otpEntity);

        // Send OTP via SMS or email (depending on contact type)
        // For now, just return success
        // In production, you would integrate with SMS/email provider

        return ResponseEntity.ok("OTP sent successfully");
    }

    // POST /api/auth/verify-otp
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        String otp = verifyOtpRequest.getOtp();
        String purpose = verifyOtpRequest.getPurpose();

        OTP otpEntity = otpRepository.findByOtpAndPurposeAndUsedFalse(otp, purpose)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

        if (otpEntity.getExpiresAt().isBefore(Instant.now())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }

        // Mark OTP as used
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);

        // If OTP is for email verification, mark user email as verified
        if ("EMAIL_VERIFICATION".equalsIgnoreCase(purpose) && otpEntity.getUser() != null) {
            User user = otpEntity.getUser();
            user.setEmailVerified(true);
            if (user.isPhoneVerified()) {
                user.setStatus(UserStatus.ACTIVE);
            }
            userRepository.save(user);
        }
        // If OTP is for phone verification, mark user phone as verified
        else if ("PHONE_VERIFICATION".equalsIgnoreCase(purpose) && otpEntity.getUser() != null) {
            User user = otpEntity.getUser();
            user.setPhoneVerified(true);
            if (user.isEmailVerified()) {
                user.setStatus(UserStatus.ACTIVE);
            }
            userRepository.save(user);
        }
        // If OTP is for password reset, we already handled in reset-password endpoint

        return ResponseEntity.ok("OTP verified successfully");
    }

    // POST /api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest refreshTokenRequest, HttpServletRequest request) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        Optional<RefreshToken> optional = refreshTokenRepository.findByToken(refreshToken);
        if (optional.isPresent()) {
            RefreshToken tokenEntity = optional.get();
            tokenEntity.setRevoked(true);
            refreshTokenRepository.save(tokenEntity);
        }
        // Optionally invalidate the current session
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String accessToken = authHeader.substring(7);
            String username = jwtUtil.extractUsername(accessToken);
            // We could find user and invalidate all sessions, but for simplicity we just revoke the refresh token.
        }
        return ResponseEntity.ok("Logged out successfully");
    }

    // POST /api/auth/logout-all-devices
    @PostMapping("/logout-all-devices")
    public ResponseEntity<?> logoutAllDevices(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing or invalid authorization header");
        }
        String accessToken = authHeader.substring(7);
        String username = jwtUtil.extractUsername(accessToken);
        Optional<User> optionalUser = userRepository.findByEmail(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = optionalUser.get();

        // Revoke all refresh tokens for the user
        refreshTokenRepository.findByUser(user).forEach(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });

        // Invalidate all sessions for the user
        sessionRepository.findByUser(user).forEach(session -> {
            session.setValid(false);
            sessionRepository.save(session);
        });

        // Optionally mark devices as untrusted
        deviceRepository.findByUser(user).forEach(device -> {
            device.setTrusted(false);
            deviceRepository.save(device);
        });

        return ResponseEntity.ok("Logged out from all devices successfully");
    }

    // GET /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing or invalid authorization header");
        }
        String accessToken = authHeader.substring(7);
        String username = jwtUtil.extractUsername(accessToken);
        Optional<User> optionalUser = userRepository.findByEmail(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = optionalUser.get();

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .build();

        return ResponseEntity.ok(userDto);
    }

    // Helper methods

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null) {
            return xfHeader.split(",")[0];
        }
        return request.getRemoteAddr();
    }

    private String generateOtp(int length) {
        StringBuilder otp = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            otp.append((int) (Math.random() * 10));
        }
        return otp.toString();
    }

    private String extractDeviceName(String userAgent) {
        // Simplified extraction
        if (userAgent.contains("Mobile")) {
            return "Mobile Device";
        }
        if (userAgent.contains("Windows")) {
            return "Windows PC";
        }
        if (userAgent.contains("Mac")) {
            return "Mac";
        }
        return "Unknown Device";
    }

    private String extractDeviceType(String userAgent) {
        if (userAgent.contains("Mobile") || userAgent.contains("Android") || userAgent.contains("iPhone")) {
            return "MOBILE";
        }
        if (userAgent.contains("Windows") || userAgent.contains("Mac") || userAgent.contains("Linux")) {
            return "DESKTOP";
        }
        if (userAgent.contains("Tablet") || userAgent.contains("iPad")) {
            return "TABLET";
        }
        return "OTHER";
    }

    private String extractOs(String userAgent) {
        if (userAgent.contains("Windows")) {
            return "Windows";
        }
        if (userAgent.contains("Mac")) {
            return "macOS";
        }
        if (userAgent.contains("Linux")) {
            return "Linux";
        }
        if (userAgent.contains("Android")) {
            return "Android";
        }
        if (userAgent.contains("iPhone") || userAgent.contains("iPad")) {
            return "iOS";
        }
        return "Unknown";
    }

    private String extractBrowser(String userAgent) {
        if (userAgent.contains("Chrome")) {
            return "Chrome";
        }
        if (userAgent.contains("Firefox")) {
            return "Firefox";
        }
        if (userAgent.contains("Safari")) {
            return "Safari";
        }
        if (userAgent.contains("Edge")) {
            return "Edge";
        }
        return "Unknown";
    }
}