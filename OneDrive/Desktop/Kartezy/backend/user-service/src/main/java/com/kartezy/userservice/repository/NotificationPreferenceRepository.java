package com.kartezy.userservice.repository;
import com.kartezy.userservice.entity.NotificationPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.UUID;
/**
 * Repository for managing NotificationPreference entities.
 */
@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, UUID>, JpaSpecificationExecutor<NotificationPreference> {
}