package com.kartezy.notificationservice.service;

import com.kartezy.notificationservice.dto.*;
import com.kartezy.notificationservice.entity.*;
import com.kartezy.notificationservice.entity.Notification.NotificationChannel;
import com.kartezy.notificationservice.entity.Notification.NotificationStatus;
import com.kartezy.notificationservice.entity.Notification.NotificationType;
import com.kartezy.notificationservice.repository.*;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final NotificationTemplateRepository templateRepository;

    @Transactional
    public NotificationDto sendNotification(SendNotificationRequestDto request) {
        NotificationType type;
        try {
            type = NotificationType.valueOf(request.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid notification type: " + request.getType());
        }

        NotificationChannel channel;
        try {
            channel = NotificationChannel.valueOf(request.getChannel().toUpperCase());
        } catch (IllegalArgumentException e) {
            channel = NotificationChannel.IN_APP;
        }

        Notification notification = Notification.builder()
            .userId(request.getUserId())
            .type(type)
            .channel(channel)
            .title(request.getTitle())
            .body(request.getBody())
            .imageUrl(request.getImageUrl())
            .actionUrl(request.getActionUrl())
            .dataPayload(request.getDataPayload())
            .isRead(false)
            .status(NotificationStatus.PENDING)
            .build();

        notification = notificationRepository.save(notification);

        // Simulate sending via channel
        notification.setStatus(NotificationStatus.SENT);
        notification.setSentAt(LocalDateTime.now());
        notification = notificationRepository.save(notification);

        notification.setStatus(NotificationStatus.DELIVERED);
        notification.setDeliveredAt(LocalDateTime.now());
        notification = notificationRepository.save(notification);

        log.info("Notification sent: {} to user: {} via {}", notification.getId(), request.getUserId(), channel);
        return toDto(notification);
    }

    @Transactional
    public NotificationDto sendFromTemplate(UUID userId, String typeStr, String channelStr,
                                             java.util.Map<String, String> params) {
        NotificationType type;
        try {
            type = NotificationType.valueOf(typeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid type");
        }

        NotificationChannel channel;
        try {
            channel = NotificationChannel.valueOf(channelStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            channel = NotificationChannel.IN_APP;
        }

        NotificationTemplate template = templateRepository.findByTypeAndChannel(type, channelStr.toLowerCase())
            .orElse(null);

        String title = type.name().replace("_", " ").toLowerCase();
        String body = "Notification for " + type.name();

        if (template != null) {
            title = template.getTitleTemplate();
            body = template.getBodyTemplate();
            if (params != null) {
                for (var entry : params.entrySet()) {
                    title = title.replace("{{" + entry.getKey() + "}}", entry.getValue());
                    body = body.replace("{{" + entry.getKey() + "}}", entry.getValue());
                }
            }
        }

        Notification notification = Notification.builder()
            .userId(userId).type(type).channel(channel)
            .title(title).body(body)
            .isRead(false).status(NotificationStatus.PENDING)
            .build();

        notification = notificationRepository.save(notification);
        notification.setStatus(NotificationStatus.SENT);
        notification.setSentAt(LocalDateTime.now());
        notification.setStatus(NotificationStatus.DELIVERED);
        notification.setDeliveredAt(LocalDateTime.now());
        notification = notificationRepository.save(notification);

        return toDto(notification);
    }

    @Transactional
    public NotificationDto markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        notification.setStatus(NotificationStatus.READ);
        notification = notificationRepository.save(notification);
        return toDto(notification);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> {
            n.setRead(true);
            n.setReadAt(LocalDateTime.now());
            n.setStatus(NotificationStatus.READ);
        });
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void deleteNotification(UUID id) {
        notificationRepository.deleteById(id);
    }

    @Transactional
    public NotificationPreferenceDto updatePreferences(NotificationPreferenceDto prefs) {
        NotificationPreference preference = preferenceRepository.findByUserId(prefs.getUserId())
            .orElse(NotificationPreference.builder().userId(prefs.getUserId()).build());

        preference.setPushEnabled(prefs.isPushEnabled());
        preference.setEmailEnabled(prefs.isEmailEnabled());
        preference.setSmsEnabled(prefs.isSmsEnabled());
        preference.setOrderNotifications(prefs.isOrderNotifications());
        preference.setPaymentNotifications(prefs.isPaymentNotifications());
        preference.setWalletNotifications(prefs.isWalletNotifications());
        preference.setPromotionalNotifications(prefs.isPromotionalNotifications());
        preference.setSystemNotifications(prefs.isSystemNotifications());
        preference.setDoNotDisturb(prefs.isDoNotDisturb());
        preference.setDndStartTime(prefs.getDndStartTime());
        preference.setDndEndTime(prefs.getDndEndTime());
        preference = preferenceRepository.save(preference);

        return toPreferenceDto(preference);
    }

    public List<NotificationDto> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public UnreadCountDto getUnreadCount(UUID userId) {
        long count = notificationRepository.countByUserIdAndIsReadFalse(userId);
        return new UnreadCountDto(count);
    }

    public NotificationPreferenceDto getPreferences(UUID userId) {
        return preferenceRepository.findByUserId(userId)
            .map(this::toPreferenceDto)
            .orElse(NotificationPreferenceDto.builder()
                .userId(userId).pushEnabled(true).emailEnabled(true).smsEnabled(true)
                .orderNotifications(true).paymentNotifications(true)
                .walletNotifications(true).promotionalNotifications(true).systemNotifications(true)
                .build());
    }

    public NotificationTemplateDto createTemplate(NotificationTemplateDto dto) {
        NotificationType type = NotificationType.valueOf(dto.getType().toUpperCase());
        NotificationTemplate template = NotificationTemplate.builder()
            .type(type).channel(dto.getChannel())
            .titleTemplate(dto.getTitleTemplate()).bodyTemplate(dto.getBodyTemplate())
            .isActive(dto.isActive()).build();
        template = templateRepository.save(template);
        return toTemplateDto(template);
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
            .id(n.getId()).userId(n.getUserId())
            .type(n.getType().name()).channel(n.getChannel().name())
            .title(n.getTitle()).body(n.getBody())
            .imageUrl(n.getImageUrl()).actionUrl(n.getActionUrl())
            .isRead(n.isRead()).readAt(n.getReadAt())
            .status(n.getStatus().name()).createdAt(n.getCreatedAt()).build();
    }

    private NotificationPreferenceDto toPreferenceDto(NotificationPreference p) {
        return NotificationPreferenceDto.builder()
            .id(p.getId()).userId(p.getUserId())
            .pushEnabled(p.isPushEnabled()).emailEnabled(p.isEmailEnabled()).smsEnabled(p.isSmsEnabled())
            .orderNotifications(p.isOrderNotifications()).paymentNotifications(p.isPaymentNotifications())
            .walletNotifications(p.isWalletNotifications()).promotionalNotifications(p.isPromotionalNotifications())
            .systemNotifications(p.isSystemNotifications())
            .doNotDisturb(p.isDoNotDisturb()).dndStartTime(p.getDndStartTime()).dndEndTime(p.getDndEndTime())
            .build();
    }

    private NotificationTemplateDto toTemplateDto(NotificationTemplate t) {
        return NotificationTemplateDto.builder()
            .id(t.getId()).type(t.getType().name()).channel(t.getChannel())
            .titleTemplate(t.getTitleTemplate()).bodyTemplate(t.getBodyTemplate())
            .isActive(t.isActive()).build();
    }
}
