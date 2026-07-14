package com.kartezy.authservice.service;
import com.kartezy.authservice.dto.LoginRequest;
import com.kartezy.authservice.dto.LoginResponse;
import com.kartezy.authservice.dto.RegisterRequest;
import com.kartezy.authservice.dto.RefreshTokenRequest;
import com.kartezy.authservice.dto.ForgotPasswordRequest;
import com.kartezy.authservice.dto.ResetPasswordRequest;
import com.kartezy.authservice.dto.SendOtpRequest;
import com.kartezy.authservice.dto.VerifyOtpRequest;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;
/**
 * Service interface for authentication-related business logic.
 */
public interface AuthService {
    ResponseEntity<?> login(LoginRequest loginRequest, HttpServletRequest request);
    ResponseEntity<?> register(RegisterRequest registerRequest);
    ResponseEntity<?> refreshToken(RefreshTokenRequest refreshTokenRequest);
    ResponseEntity<?> forgotPassword(ForgotPasswordRequest forgotPasswordRequest);
    ResponseEntity<?> resetPassword(ResetPasswordRequest resetPasswordRequest);
    ResponseEntity<?> sendOtp(SendOtpRequest sendOtpRequest);
    ResponseEntity<?> verifyOtp(VerifyOtpRequest verifyOtpRequest);
    ResponseEntity<?> logout(RefreshTokenRequest refreshTokenRequest, HttpServletRequest request);
    ResponseEntity<?> logoutAllDevices(HttpServletRequest request);
    ResponseEntity<?> getCurrentUser(HttpServletRequest request);
}