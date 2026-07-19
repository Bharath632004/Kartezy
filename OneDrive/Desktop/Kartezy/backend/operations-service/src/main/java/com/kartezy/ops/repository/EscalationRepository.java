package com.kartezy.ops.repository;

import com.kartezy.ops.entity.Escalation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EscalationRepository extends JpaRepository<Escalation, Long> {
    List<Escalation> findByTicketId(Long ticketId);
    List<Escalation> findByIncidentId(Long incidentId);
    List<Escalation> findByEscalationLevel(String level);
    List<Escalation> findByStatus(String status);
    List<Escalation> findByEscalatedTo(String escalatedTo);
    
    @Query("SELECT e.escalationLevel, COUNT(e) FROM Escalation e GROUP BY e.escalationLevel")
    List<Object[]> countByLevel();
    
    @Query("SELECT e.status, COUNT(e) FROM Escalation e GROUP BY e.status")
    List<Object[]> countByStatus();
}
