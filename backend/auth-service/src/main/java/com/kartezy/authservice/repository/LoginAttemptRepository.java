package com.kartezy.authservice.repository;

import com.kartezy.authservice.entity.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, UUID> {

    @Query("SELECT COUNT(l) FROM LoginAttempt l WHERE l.identifier = :identifier " +
           "AND l.success = false AND l.attemptedAt > :since")
    long countFailedAttemptsSince(@Param("identifier") String identifier, @Param("since") Instant since);

    @Query("SELECT COUNT(l) FROM LoginAttempt l WHERE l.ipAddress = :ip " +
           "AND l.attemptedAt > :since")
    long countAttemptsFromIpSince(@Param("ip") String ip, @Param("since") Instant since);

    @Query("SELECT l FROM LoginAttempt l WHERE l.identifier = :identifier " +
           "AND l.attemptedAt > :since ORDER BY l.attemptedAt DESC")
    List<LoginAttempt> findRecentAttempts(@Param("identifier") String identifier,
                                          @Param("since") Instant since);

    @Query("SELECT l FROM LoginAttempt l WHERE l.ipAddress = :ip " +
           "AND l.attemptedAt > :since ORDER BY l.attemptedAt DESC")
    List<LoginAttempt> findRecentAttemptsByIp(@Param("ip") String ip,
                                              @Param("since") Instant since);

    List<LoginAttempt> findBySuspiciousTrueAndAttemptedAtAfter(Instant since);

    @Query("SELECT COUNT(DISTINCT l.identifier) FROM LoginAttempt l WHERE l.ipAddress = :ip " +
           "AND l.attemptedAt > :since")
    long countDistinctIdentifiersFromIp(@Param("ip") String ip, @Param("since") Instant since);
}
