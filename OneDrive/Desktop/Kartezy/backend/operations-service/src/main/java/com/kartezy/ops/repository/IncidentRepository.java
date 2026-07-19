package com.kartezy.ops.repository;

import com.kartezy.ops.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findBySeverity(String severity);
    List<Incident> findByStatus(String status);
    List<Incident> findByCategory(String category);
    List<Incident> findByAssignedTo(String assignedTo);
    List<Incident> findByReportedAtAfter(LocalDateTime since);
    
    @Query("SELECT i.severity, COUNT(i) FROM Incident i GROUP BY i.severity")
    List<Object[]> countBySeverity();
    
    @Query("SELECT i.status, COUNT(i) FROM Incident i GROUP BY i.status")
    List<Object[]> countByStatus();
    
    @Query("SELECT i.category, COUNT(i) FROM Incident i GROUP BY i.category")
    List<Object[]> countByCategory();
}
