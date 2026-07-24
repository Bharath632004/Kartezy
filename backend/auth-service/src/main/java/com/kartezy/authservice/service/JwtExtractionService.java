package com.kartezy.authservice.service;

import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.repository.UserRepository;
import com.kartezy.authservice.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service to extract the current authenticated user from JWT tokens.
 */
@Service
@RequiredArgsConstructor
public class JwtExtractionService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    /**
     * Gets the current authenticated user from the request's Authorization header.
     */
    public User getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        if (email == null) {
            return null;
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.orElse(null);
    }
}
