package com.kartezy.userservice.repository;
import com.kartezy.userservice.entity.PrivacySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.UUID;
/**
 * Repository for managing PrivacySettings entities.
 */
@Repository
public interface PrivacySettingsRepository extends JpaRepository<PrivacySettings, UUID>, JpaSpecificationExecutor<PrivacySettings> {
}