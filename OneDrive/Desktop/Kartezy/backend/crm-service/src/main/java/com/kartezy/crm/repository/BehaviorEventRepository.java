package com.kartezy.crm.repository;

import com.kartezy.crm.entity.BehaviorEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BehaviorEventRepository extends JpaRepository<BehaviorEvent, Long> {

    Page<BehaviorEvent> findByCustomerIdOrderByEventTimeDesc(Long customerId, Pageable pageable);

    List<BehaviorEvent> findByCustomerIdAndEventType(Long customerId, String eventType);

    Page<BehaviorEvent> findByEventType(String eventType, Pageable pageable);

    @Query("SELECT b.eventType, COUNT(b) FROM BehaviorEvent b GROUP BY b.eventType ORDER BY COUNT(b) DESC")
    List<Object[]> getEventTypeCounts();

    @Query("SELECT b FROM BehaviorEvent b WHERE b.eventTime >= :since ORDER BY b.eventTime DESC")
    List<BehaviorEvent> findRecentEvents(@Param("since") LocalDateTime since, Pageable pageable);

    @Query("SELECT b FROM BehaviorEvent b WHERE b.sessionId = :sessionId ORDER BY b.eventTime")
    List<BehaviorEvent> findBySessionId(@Param("sessionId") String sessionId);

    @Query("SELECT COUNT(DISTINCT b.customerId) FROM BehaviorEvent b WHERE b.eventTime >= :since")
    long countDistinctActiveUsersSince(@Param("since") LocalDateTime since);

    long countByEventTypeAndEventTimeBetween(String eventType, LocalDateTime from, LocalDateTime to);
}
