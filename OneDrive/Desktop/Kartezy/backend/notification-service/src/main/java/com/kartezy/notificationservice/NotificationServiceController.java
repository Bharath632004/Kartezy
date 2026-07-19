package com.kartezy.notificationservice;

import com.kartezy.notificationservice.dto.*;
import com.kartezy.notificationservice.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationServiceController {
    private final NotificationService notificationService;

    @PostMapping("/send")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationDto> sendNotification(@Valid @RequestBody SendNotificationRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.sendNotification(request));
    }

    @PostMapping("/send-template")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationDto> sendFromTemplate(@RequestParam UUID userId,
                                                             @RequestParam String type,
                                                             @RequestParam(defaultValue = "IN_APP") String channel,
                                                             @RequestBody(required = false) Map<String, String> params) {
        return ResponseEntity.ok(notificationService.sendFromTemplate(userId, type, channel, params));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationDto>> getUserNotifications(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/user/{userId}/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UnreadCountDto> getUnreadCount(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable UUID id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PutMapping("/user/{userId}/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAllAsRead(@PathVariable UUID userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/preferences/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationPreferenceDto> getPreferences(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getPreferences(userId));
    }

    @PutMapping("/preferences")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationPreferenceDto> updatePreferences(
            @Valid @RequestBody NotificationPreferenceDto preferences) {
        return ResponseEntity.ok(notificationService.updatePreferences(preferences));
    }

    @PostMapping("/templates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationTemplateDto> createTemplate(@Valid @RequestBody NotificationTemplateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createTemplate(dto));
    }

    @GetMapping("")
    public String home() { return "Welcome to notification-service"; }

    @GetMapping("/health")
    public String health() { return "notification-service is healthy"; }
}
