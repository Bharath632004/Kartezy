package com.kartezy.authservice.controller;

import com.kartezy.authservice.dto.SocialLoginRequest;
import com.kartezy.authservice.service.SocialLoginService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for social login via OAuth2 providers.
 * <p>
 * Supports: Google, Apple, Facebook
 * Flow: Client performs OAuth2 flow with provider, sends access token to this endpoint.
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/auth/social")
@RequiredArgsConstructor
public class SocialLoginController {

    private final SocialLoginService socialLoginService;

    /**
     * Authenticate or register via social login provider.
     * The client sends the provider's access token/id token after successful OAuth flow.
     */
    @PostMapping("/login")
    public ResponseEntity<?> socialLogin(@Valid @RequestBody SocialLoginRequest request) {
        String provider = request.getProvider().toLowerCase();

        // Validate provider
        if (!provider.equals("google") && !provider.equals("apple") && !provider.equals("facebook")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Unsupported provider. Supported: google, apple, facebook"
            ));
        }

        try {
            var loginResponse = socialLoginService.authenticate(
                    provider,
                    request.getProviderToken(),
                    request.getEmail(),
                    request.getFirstName(),
                    request.getLastName(),
                    request.getProviderUserId()
            );

            log.info("Social login successful: {} via {}", request.getEmail(), provider);
            return ResponseEntity.ok(loginResponse);

        } catch (Exception e) {
            log.error("Social login failed for {} via {}: {}", request.getEmail(), provider, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Social login failed: " + e.getMessage()
            ));
        }
    }

    /**
     * Process an ID token from the provider (alternative to access token flow).
     * Use this when the client receives a JWT ID token from the OAuth provider.
     */
    @PostMapping("/id-token")
    public ResponseEntity<?> processIdToken(@Valid @RequestBody SocialLoginRequest request) {
        String provider = request.getProvider().toLowerCase();

        if (!provider.equals("google") && !provider.equals("apple")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "ID token flow supported for: google, apple"
            ));
        }

        try {
            var userInfo = socialLoginService.processIdToken(provider, request.getProviderToken());

            var loginResponse = socialLoginService.authenticate(
                    provider,
                    request.getProviderToken(),
                    userInfo.get("email"),
                    userInfo.get("firstName"),
                    userInfo.get("lastName"),
                    userInfo.get("sub")
            );

            return ResponseEntity.ok(loginResponse);

        } catch (Exception e) {
            log.error("ID token processing failed for {}: {}", provider, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid ID token: " + e.getMessage()
            ));
        }
    }

    /**
     * Get list of supported social login providers.
     */
    @GetMapping("/providers")
    public ResponseEntity<?> getProviders() {
        return ResponseEntity.ok(Map.of(
                "providers", java.util.List.of(
                        Map.of("id", "google", "name", "Google", "authUrl", "/oauth2/authorization/google"),
                        Map.of("id", "apple", "name", "Apple", "authUrl", "/oauth2/authorization/apple"),
                        Map.of("id", "facebook", "name", "Facebook", "authUrl", "/oauth2/authorization/facebook")
                )
        ));
    }
}
