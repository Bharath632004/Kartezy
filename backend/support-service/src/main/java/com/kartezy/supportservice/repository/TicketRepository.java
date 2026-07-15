package com.kartezy.supportservice.repository;
import com.kartezy.supportservice.entity.Ticket;
import com.kartezy.supportservice.entity.Ticket.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    List<Ticket> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByAssignedToOrderByCreatedAtDesc(UUID assignedTo);
    long countByStatus(TicketStatus status);
}
