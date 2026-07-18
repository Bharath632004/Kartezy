package com.kartezy.shared.security.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Spring Data JPA repository for AuditEvent entities.
 */
@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {
}