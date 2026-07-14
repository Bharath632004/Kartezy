package com.kartezy.authservice;
import com.kartezy.authservice.dto.*;
import com.kartezy.authservice.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthServiceController {
    private final AuthService authService;
    /**
     * Home endpoint for the auth service.
     * @return Welcome message
     */
    @GetMapping("")
    public String home() {
        return "Welcome to auth-service";
    }
    /**
     * Health check endpoint for the auth service.
     * @return Health status message
     */
    @GetMapping("/health")
    public String health() {
        return "auth-service is healthy";
    }
    /**
     * Authenticates a user with the provided login credentials.
     * @param loginRequest Contains the login credentials (email/username and password)
     * @param request The HTTP servlet request (used for IP address, etc.)
     * @return ResponseEntity containing the authentication result
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        return authService.login(loginRequest, request);
    }
    /**
     * Registers a new user with the provided registration details.
     * @param registerRequest Contains the user registration details
     * @return ResponseEntity containing the registration result
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }
    /**
     * Refreshes the access token using a valid refresh token.
     * @param refreshTokenRequest Contains the refresh token
     * @return ResponseEntity containing the new access token
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return authService.refreshToken(refreshTokenRequest);
    }
    /**
     * Initiates a password reset process for the user with the provided email.
     * @param forgotPasswordRequest Contains the email address of the user
     * @return ResponseEntity indicating the result of the request
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        return authService.forgotPassword(forgotPasswordRequest);
    }
    /**
     * Resets the password for a user using the provided token and new password.
     * @param resetPasswordRequest Contains the reset token and new password
     * @return ResponseEntity indicating the result of the password reset
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        return authService.resetPassword(resetPasswordRequest);
    }
    /**
     * Sends a one-time password (OTP) to the user's email or phone for verification.
     * @param sendOtpRequest Contains the destination (email/phone) and purpose for the OTP
     * @return ResponseEntity indicating the result of sending the OTP
     */
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest sendOtpRequest) {
        return authService.sendOtp(sendOtpRequest);
    }
    /**
     * Verifies the one-time password (OTP) provided by the user.
     * @param verifyOtpRequest Contains the OTP and the associated identifier (email/phone)
     * @return ResponseEntity indicating whether the OTP is valid
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        return authService.verifyOtp(verifyOtpRequest);
    }
    /**
     * Logs out the user from the current device by invalidating the refresh token.
     * @param refreshTokenRequest Contains the refresh token to be invalidated
     * @param request The HTTP servlet request (used for IP address, etc.)
     * @return ResponseEntity indicating the result of the logout operation
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest refreshTokenRequest, HttpServletRequest request) {
        return authService.logout(refreshTokenRequest, request);
    }
    /**
     * Logs out the user from all devices by invalidating all refresh tokens associated with the user.
     * @param request The HTTP servlet request (used to extract the user ID from the token)
     * @return ResponseEntity indicating the result of the logout-all-devices operation
     */
    @PostMapping("/logout-all-devices")
    public ResponseEntity<?> logoutAllDevices(HttpServletRequest request) {
        return authService.logoutAllDevices(request);
    }
    /**
     * Retrieves the current authenticated user's information.
     * @param request The HTTP servlet request (used to extract the user ID from the token)
     * @return ResponseEntity containing the current user's information
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        return authService.getCurrentUser(request);
    }
}