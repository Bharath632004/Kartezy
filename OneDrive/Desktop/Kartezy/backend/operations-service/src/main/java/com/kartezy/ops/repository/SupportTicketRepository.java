package com.kartezy.ops.repository;

import com.kartezy.ops.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    Optional<SupportTicket> findByTicketNumber(String ticketNumber);
    List<SupportTicket> findByCustomerId(Long customerId);
    List<SupportTicket> findByMerchantId(Long merchantId);
    List<SupportTicket> findByStatus(String status);
    List<SupportTicket> findByPriority(String priority);
    List<SupportTicket> findByAssignedTo(String assignedTo);
    long countByStatus(String status);
    long countByPriority(String priority);
    
    List<SupportTicket> findBySlaBreachedTrue();
    List<SupportTicket> findByStatusAndPriority(String status, String priority);
    List<SupportTicket> findByCreatedAtAfter(LocalDateTime since);
    
    @Query("SELECT t.status, COUNT(t) FROM SupportTicket t GROUP BY t.status")
    List<Object[]> countByStatus();
    
    @Query("SELECT t.priority, COUNT(t) FROM SupportTicket t WHERE t.status != 'CLOSED' GROUP BY t.priority")
    List<Object[]> countOpenByPriority();
    
    @Query("SELECT COALESCE(AVG(t.customerSatisfactionScore), 0) FROM SupportTicket t WHERE t.customerSatisfactionScore > 0")
    double avgCsatScore();
}
