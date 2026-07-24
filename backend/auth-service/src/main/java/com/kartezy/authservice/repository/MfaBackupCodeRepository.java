package com.kartezy.authservice.repository;

import com.kartezy.authservice.entity.MfaBackupCode;
import com.kartezy.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MfaBackupCodeRepository extends JpaRepository<MfaBackupCode, UUID> {
    List<MfaBackupCode> findByUserAndUsedFalse(User user);
    long countByUserAndUsedFalse(User user);

    @Modifying
    @Query("UPDATE MfaBackupCode c SET c.used = true, c.usedAt = CURRENT_TIMESTAMP WHERE c.id = :id")
    void markAsUsed(@Param("id") UUID id);

    @Modifying
    @Query("DELETE FROM MfaBackupCode c WHERE c.user = :user")
    void deleteAllByUser(@Param("user") User user);
}
