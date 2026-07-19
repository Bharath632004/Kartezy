package com.kartezy.crm.repository;

import com.kartezy.crm.entity.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, Long> {

    List<NotificationTemplate> findByChannel(String channel);

    List<NotificationTemplate> findByCategory(String category);

    List<NotificationTemplate> findByIsDraftFalse();
}
