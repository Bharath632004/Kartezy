package com.kartezy.authservice.repository;

import com.kartezy.authservice.entity.MfaDevice;
import com.kartezy.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MfaDeviceRepository extends JpaRepository<MfaDevice, UUID> {
    List<MfaDevice> findByUserAndActiveTrue(User user);
    Optional<MfaDevice> findByUserAndActiveTrueAndMethod(User user, String method);
    long countByUserAndActiveTrue(User user);
    boolean existsByUserAndVerifiedTrue(User user);
}
