package com.kartezy.userservice.repository;
import com.kartezy.userservice.entity.DeviceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.UUID;
/**
 * Repository for managing DeviceHistory entities.
 */
@Repository
public interface DeviceHistoryRepository extends JpaRepository<DeviceHistory, UUID>, JpaSpecificationExecutor<DeviceHistory> {
}