package com.kartezy.authservice.service;
import com.kartezy.authservice.dto.*;
import com.kartezy.authservice.entity.*;
import com.kartezy.authservice.repository.DeviceRepository;
import com.kartezy.authservice.repository.OTPRepository;
import com.kartezy.authservice.repository.RefreshTokenRepository;
import com.kartezy.authservice.repository.RoleRepository;
import com.kartezy.authservice.repository.SessionRepository;
import com.kartezy.authservice.repository.UserRepository;
import com.kartezy.authservice.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OTPRepository otpRepository;
    private final SessionRepository sessionRepository;
    private final DeviceRepository deviceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    @Override
    public ResponseEntity<?> login(LoginRequest loginRequest, HttpServletRequest request) {
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
            String deviceId = request.getHeader("X-Device-ID");
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
                    .expiresIn(jwtUtil.getJwtExpiration() / 1000)
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
    @Override
    public ResponseEntity<?> register(RegisterRequest registerRequest) {
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
        // Assign a default role (e.g., ROLE_USER) if it exists
        roleRepository.findByName("ROLE_USER").ifPresent(role -> user.addRole(role));
        // Send verification OTPs (email and phone) via async task
        // OTPs are logged for observability; actual delivery handled by notification-service
        return ResponseEntity.ok("User registered successfully. Please verify your email and phone.");
    }
    @Override
    public ResponseEntity<?> refreshToken(RefreshTokenRequest refreshTokenRequest) {
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
    @Override
    public ResponseEntity<?> forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
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
            // Log OTP for observability; delivery handled by notification-service via email/SMS
            log.info("Password reset OTP generated for email: {}", email);
        }
        // Always return same message to prevent user enumeration
        return ResponseEntity.ok("If the email exists, a password reset OTP has been sent.");
    }
    @Override
    public ResponseEntity<?> resetPassword(ResetPasswordRequest resetPasswordRequest) {
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
    @Override
    public ResponseEntity<?> sendOtp(SendOtpRequest sendOtpRequest) {
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
        // OTP delivery delegated to notification-service for SMS/email dispatch
        log.info("OTP generated for contact {} (purpose: {})", contact, purpose);
        return ResponseEntity.ok("OTP sent successfully");
    }
    @Override
    public ResponseEntity<?> verifyOtp(VerifyOtpRequest verifyOtpRequest) {
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
    @Override
    public ResponseEntity<?> logout(RefreshTokenRequest refreshTokenRequest, HttpServletRequest request) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        Optional<RefreshToken> optional = refreshTokenRepository.findByToken(refreshToken);
        if (optional.isPresent()) {
            RefreshToken tokenEntity = optional.get();
            tokenEntity.setRevoked(true);
            refreshTokenRepository.save(tokenEntity);
        }
        // Invalidate session
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            Optional<User> optionalUser = userRepository.findByEmail(email);
            optionalUser.ifPresent(user -> {
                // Invalidate all sessions for the user
                sessionRepository.findByUser(user).forEach(session -> {
                    session.setValid(false);
                    sessionRepository.save(session);
                });
            });
        }
        return ResponseEntity.ok("Logged out successfully");
    }
    @Override
    public ResponseEntity<?> logoutAllDevices(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            Optional<User> optionalUser = userRepository.findByEmail(email);
            optionalUser.ifPresent(user -> {
                // Invalidate all refresh tokens for the user
                refreshTokenRepository.findByUser(user).forEach(tokenEntity -> {
                    tokenEntity.setRevoked(true);
                    refreshTokenRepository.save(tokenEntity);
                });
                // Invalidate all sessions for the user
                sessionRepository.findByUser(user).forEach(session -> {
                    session.setValid(false);
                    sessionRepository.save(session);
                });
                // Optionally, untrust all devices
                deviceRepository.findByUser(user).forEach(device -> {
                    device.setTrusted(false);
                    deviceRepository.save(device);
                });
            });
        }
        return ResponseEntity.ok("Logged out from all devices successfully");
    }
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                return ResponseEntity.ok(new UserDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getPhoneNumber(),
                        user.isEmailVerified(),
                        user.isPhoneVerified()
                ));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
    private String generateOtp(int length) {
        StringBuilder otp = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            otp.append((int) (Math.random() * 10));
        }
        return otp.toString();
    }
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            xfHeader = request.getHeader("Proxy-Client-IP");
        }
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            xfHeader = request.getHeader("WL-Proxy-Client-IP");
        }
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            xfHeader = request.getRemoteAddr();
        }
        if (xfHeader != null && xfHeader.contains(",")) {
            xfHeader = xfHeader.split(",")[0].trim();
        }
        return xfHeader;
    }
    private String extractDeviceName(String userAgent) {
        if (userAgent == null) return "Unknown Device";
        // Simplified extraction
        if (userAgent.contains("iPhone")) return "iPhone";
        if (userAgent.contains("iPad")) return "iPad";
        if (userAgent.contains("Android")) return "Android Device";
        if (userAgent.contains("Windows NT")) return "Windows PC";
        if (userAgent.contains("Macintosh")) return "Mac";
        if (userAgent.contains("Linux")) return "Linux Device";
        return "Unknown Device";
    }
    private String extractDeviceType(String userAgent) {
        if (userAgent == null) return "unknown";
        if (userAgent.matches(".*(iPhone|iPod).*")) return "mobile";
        if (userAgent.matches(".*(iPad).*")) return "tablet";
        if (userAgent.matches(".*(Android).*Mobile.*")) return "mobile";
        if (userAgent.matches(".*(Android).*")) return "mobile";
        if (userAgent.matches(".*(Windows NT|Macintosh|Linux).*")) return "desktop";
        return "unknown";
    }
    private String extractOs(String userAgent) {
        if (userAgent == null) return "Unknown";
        if (userAgent.contains("iPhone") || userAgent.contains("iPad")) return "iOS";
        if (userAgent.contains("Android")) return "Android";
        if (userAgent.contains("Windows NT")) return "Windows";
        if (userAgent.contains("Macintosh")) return "macOS";
        if (userAgent.contains("Linux")) return "Linux";
        return "Unknown";
    }
    private String extractBrowser(String userAgent) {
        if (userAgent == null) return "Unknown";
        if (userAgent.contains("Chrome")) return "Chrome";
        if (userAgent.contains("Firefox")) return "Firefox";
        if (userAgent.contains("Safari")) return "Safari";
        if (userAgent.contains("Edge")) return "Edge";
        if (userAgent.contains("OPR")) return "Opera";
        return "Unknown";
    }
}