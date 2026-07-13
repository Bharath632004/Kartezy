package com.kartezy.authservice.repository;

import com.kartezy.authservice.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    // Find all active sessions for a user
    java.util.List<Session> findByUserIdAndExpiredIsFalse(Long userId);

    // Find session by session ID (token)
    Session findBySessionId(String sessionId);

    // Delete all sessions for a user (logout all devices)
    void deleteByUserId(Long userId);
}