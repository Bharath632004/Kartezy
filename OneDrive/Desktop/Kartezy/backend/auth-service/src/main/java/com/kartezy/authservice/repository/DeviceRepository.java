package com.kartezy.authservice.repository;
import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
import java.util.UUID;
@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {
    Optional<Device> findByDeviceId(String deviceId);
    List<Device> findByUser(User user);
}
