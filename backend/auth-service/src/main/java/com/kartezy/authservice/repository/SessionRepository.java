package com.kartezy.authservice.repository;
import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;
@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {    // Find all active sessions for a user
    java.util.List<Session> findByUserIdAndValidTrue(UUID userId);

    // Find session by session ID (token)
    Session findBySessionId(String sessionId);

    // Find all sessions for a user
    java.util.List<Session> findByUser(User user);

    // Delete all sessions for a user (logout all devices)
    void deleteByUserId(UUID userId);
}
