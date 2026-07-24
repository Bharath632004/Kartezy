package com.kartezy.authservice.service;
import com.kartezy.authservice.dto.LoginRequest;
import com.kartezy.authservice.dto.LoginResponse;
import com.kartezy.authservice.dto.RegisterRequest;
import com.kartezy.authservice.dto.RefreshTokenRequest;
import com.kartezy.authservice.dto.ForgotPasswordRequest;
import com.kartezy.authservice.dto.ResetPasswordRequest;
import com.kartezy.authservice.dto.SendOtpRequest;
import com.kartezy.authservice.dto.VerifyOtpRequest;
import com.kartezy.authservice.dto.UserDto;
import com.kartezy.shared.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;
/**
 * Service interface for authentication-related business logic.
 */
public interface AuthService {
    ResponseEntity<ApiResponse<LoginResponse>> login(LoginRequest loginRequest, HttpServletRequest request);
    ResponseEntity<ApiResponse<String>> register(RegisterRequest registerRequest);
    ResponseEntity<ApiResponse<LoginResponse>> refreshToken(RefreshTokenRequest refreshTokenRequest);
    ResponseEntity<ApiResponse<String>> forgotPassword(ForgotPasswordRequest forgotPasswordRequest);
    ResponseEntity<ApiResponse<String>> resetPassword(ResetPasswordRequest resetPasswordRequest);
    ResponseEntity<ApiResponse<String>> sendOtp(SendOtpRequest sendOtpRequest);
    ResponseEntity<ApiResponse<String>> verifyOtp(VerifyOtpRequest verifyOtpRequest);
    ResponseEntity<ApiResponse<String>> logout(RefreshTokenRequest refreshTokenRequest, HttpServletRequest request);
    ResponseEntity<ApiResponse<String>> logoutAllDevices(HttpServletRequest request);
    ResponseEntity<ApiResponse<UserDto>> getCurrentUser(HttpServletRequest request);
}