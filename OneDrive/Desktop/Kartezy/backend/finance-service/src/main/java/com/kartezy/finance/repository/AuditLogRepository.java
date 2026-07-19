package com.kartezy.finance.repository;

import com.kartezy.finance.constants.AuditAction;
import com.kartezy.finance.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByEntityTypeAndEntityIdOrderByPerformedAtDesc(String entityType, Long entityId, Pageable pageable);

    Page<AuditLog> findByPerformedByOrderByPerformedAtDesc(String performedBy, Pageable pageable);

    Page<AuditLog> findByActionOrderByPerformedAtDesc(AuditAction action, Pageable pageable);

    List<AuditLog> findByPerformedAtBetween(LocalDateTime from, LocalDateTime to);

    Page<AuditLog> findByEntityTypeOrderByPerformedAtDesc(String entityType, Pageable pageable);
}
