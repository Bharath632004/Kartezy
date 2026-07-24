package com.kartezy.fraudservice.repository;

import com.kartezy.fraudservice.entity.FraudEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FraudEventRepository extends JpaRepository<FraudEvent, UUID> {

    List<FraudEvent> findByUserIdAndRiskScoreGreaterThanEqualOrderByTimestampDesc(
            String userId, int minRiskScore);

    List<FraudEvent> findByActionRequiredTrueOrderByTimestampDesc();

    @Query("SELECT COUNT(DISTINCT f.userId) FROM FraudEvent f WHERE f.deviceFingerprint = :fingerprint")
    long countDistinctUsersByDeviceFingerprint(@Param("fingerprint") String fingerprint);

    @Query("SELECT COUNT(DISTINCT f.userId) FROM FraudEvent f WHERE f.ipAddress = :ip")
    long countDistinctUsersByIpAddress(@Param("ip") String ip);

    @Query("SELECT COUNT(f) FROM FraudEvent f WHERE f.userId = :userId " +
           "AND f.eventType = :eventType AND f.timestamp > :since")
    long countRecentEventsByUser(@Param("userId") String userId,
                                  @Param("eventType") String eventType,
                                  @Param("since") Instant since);

    @Query("SELECT COUNT(f) FROM FraudEvent f WHERE f.userId = :userId " +
           "AND f.eventType LIKE %:type% AND f.timestamp > :since")
    long countRecentEventsByUserAndType(@Param("userId") String userId,
                                         @Param("type") String type,
                                         @Param("since") Instant since);

    Optional<FraudEvent> findTopByUserIdAndEventTypeOrderByTimestampDesc(
            String userId, String eventType);
}
