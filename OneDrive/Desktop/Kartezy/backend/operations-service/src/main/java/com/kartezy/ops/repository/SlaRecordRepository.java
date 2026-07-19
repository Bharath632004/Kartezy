package com.kartezy.ops.repository;

import com.kartezy.ops.entity.SlaRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SlaRecordRepository extends JpaRepository<SlaRecord, Long> {
    List<SlaRecord> findBySlaType(String slaType);
    List<SlaRecord> findBySlaStatus(String slaStatus);
    List<SlaRecord> findByEntityTypeAndEntityId(String entityType, Long entityId);
    
    List<SlaRecord> findBySlaStatusAndDeadlineAtBefore(String slaStatus, LocalDateTime deadline);
    List<SlaRecord> findBySlaStatusAndSlaType(String slaStatus, String slaType);
    
    @Query("SELECT s.slaStatus, COUNT(s) FROM SlaRecord s GROUP BY s.slaStatus")
    List<Object[]> countByStatus();
    
    @Query("SELECT s.slaType, COUNT(s) FROM SlaRecord s WHERE s.slaStatus = 'BREACHED' GROUP BY s.slaType")
    List<Object[]> countBreachedByType();
    
    long countBySlaStatus(String slaStatus);
}
