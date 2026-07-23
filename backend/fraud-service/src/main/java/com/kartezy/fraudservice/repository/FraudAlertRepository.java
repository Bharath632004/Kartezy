package com.kartezy.fraudservice.repository;

import com.kartezy.fraudservice.entity.FraudAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface FraudAlertRepository extends JpaRepository<FraudAlert, UUID> {
    List<FraudAlert> findByStatusOrderByCreatedAtDesc(String status);
    long countByUserIdAndCreatedAtAfter(UUID userId, LocalDateTime after);
}
