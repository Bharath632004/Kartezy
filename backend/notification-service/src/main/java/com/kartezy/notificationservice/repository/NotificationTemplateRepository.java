package com.kartezy.notificationservice.repository;

import com.kartezy.notificationservice.entity.Notification;
import com.kartezy.notificationservice.entity.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, UUID> {
    Optional<NotificationTemplate> findByTypeAndChannel(Notification.NotificationType type, String channel);
}

