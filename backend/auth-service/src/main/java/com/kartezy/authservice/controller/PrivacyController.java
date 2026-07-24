package com.kartezy.authservice.controller;

import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.service.JwtExtractionService;
import com.kartezy.authservice.service.PrivacyService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Controller for privacy-related operations.
 * Implements GDPR / India DPDP Act requirements.
 */
@Slf4j
@RestController
@RequestMapping("/auth/privacy")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class PrivacyController {

    private final PrivacyService privacyService;
    private final JwtExtractionService jwtExtractionService;

    /**
     * Export all user data (GDPR Right to Data Portability).
     */
    @GetMapping("/export-data")
    public ResponseEntity<?> exportData(HttpServletRequest request) {
        User user = jwtExtractionService.getCurrentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        var export = privacyService.exportUserData(user.getId());
        return ResponseEntity.ok(export);
    }

    /**
     * Delete or anonymize user account (GDPR Right to Erasure / Right to be Forgotten).
     */
    @PostMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(@RequestParam(defaultValue = "false") boolean hardDelete,
                                            HttpServletRequest request) {
        User user = jwtExtractionService.getCurrentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        privacyService.deleteUserData(user.getId(), hardDelete);
        return ResponseEntity.ok(Map.of(
                "message", hardDelete
                        ? "Your account has been permanently deleted."
                        : "Your account has been anonymized. Some data may be retained for legal compliance."
        ));
    }

    /**
     * Admin endpoint to delete any user's data.
     */
    @PostMapping("/admin/delete-user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminDeleteUser(@PathVariable UUID userId,
                                              @RequestParam(defaultValue = "false") boolean hardDelete) {
        try {
            privacyService.deleteUserData(userId, hardDelete);
            return ResponseEntity.ok(Map.of("message", "User data deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Admin endpoint to enforce data retention policy.
     */
    @PostMapping("/admin/enforce-retention")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> enforceRetention(@RequestParam(defaultValue = "365") int retentionDays) {
        int deleted = privacyService.enforceDataRetention(retentionDays);
        return ResponseEntity.ok(Map.of(
                "message", "Data retention enforced",
                "recordsDeleted", deleted,
                "retentionDays", retentionDays
        ));
    }
}
