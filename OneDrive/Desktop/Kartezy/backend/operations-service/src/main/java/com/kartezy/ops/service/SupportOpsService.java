package com.kartezy.ops.service;

import com.kartezy.ops.constants.OpsConstants;
import com.kartezy.ops.entity.SupportTicket;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SupportOpsService {

    private final SupportTicketRepository supportTicketRepository;

    public List<SupportTicket> getAllTickets() {
        return supportTicketRepository.findAll();
    }

    public SupportTicket getTicketById(Long id) {
        return supportTicketRepository.findById(id)
            .orElseThrow(() -> new OpsException("Ticket not found: " + id, "TICKET_NOT_FOUND"));
    }

    public SupportTicket getTicketByNumber(String ticketNumber) {
        return supportTicketRepository.findByTicketNumber(ticketNumber)
            .orElseThrow(() -> new OpsException("Ticket not found: " + ticketNumber, "TICKET_NOT_FOUND"));
    }

    public List<SupportTicket> getTicketsByCustomer(Long customerId) {
        return supportTicketRepository.findByCustomerId(customerId);
    }

    public List<SupportTicket> getTicketsByMerchant(Long merchantId) {
        return supportTicketRepository.findByMerchantId(merchantId);
    }

    public List<SupportTicket> getTicketsByStatus(String status) {
        return supportTicketRepository.findByStatus(status);
    }

    public List<SupportTicket> getTicketsByPriority(String priority) {
        return supportTicketRepository.findByPriority(priority);
    }

    public List<SupportTicket> getSlaBreachedTickets() {
        return supportTicketRepository.findBySlaBreachedTrue();
    }

    @Transactional
    public SupportTicket createTicket(SupportTicket ticket) {
        ticket.setTicketNumber("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        ticket.setStatus(OpsConstants.TICKET_OPEN);
        if (ticket.getPriority() == null) ticket.setPriority(OpsConstants.PRIORITY_MEDIUM);
        // Set SLA deadline based on priority
        int slaMinutes = switch (ticket.getPriority()) {
            case "CRITICAL" -> OpsConstants.SLA_TICKET_RESOLUTION_CRITICAL;
            case "HIGH" -> OpsConstants.SLA_TICKET_RESOLUTION_HIGH;
            case "MEDIUM" -> OpsConstants.SLA_TICKET_RESOLUTION_MEDIUM;
            default -> OpsConstants.SLA_TICKET_RESOLUTION_LOW;
        };
        ticket.setSlaDeadline(LocalDateTime.now().plusMinutes(slaMinutes));
        return supportTicketRepository.save(ticket);
    }

    @Transactional
    public SupportTicket assignTicket(Long id, String assignee) {
        SupportTicket ticket = getTicketById(id);
        ticket.setAssignedTo(assignee);
        ticket.setAssignedAt(LocalDateTime.now());
        ticket.setStatus(OpsConstants.TICKET_IN_PROGRESS);
        return supportTicketRepository.save(ticket);
    }

    @Transactional
    public SupportTicket addFirstResponse(Long id) {
        SupportTicket ticket = getTicketById(id);
        ticket.setFirstResponseAt(LocalDateTime.now());
        ticket.setStatus(OpsConstants.TICKET_IN_PROGRESS);
        // Check first response SLA
        if (ticket.getAssignedAt() != null) {
            int responseMins = (int) java.time.Duration.between(ticket.getAssignedAt(), LocalDateTime.now()).toMinutes();
            if (responseMins > OpsConstants.SLA_TICKET_FIRST_RESPONSE) {
                ticket.setSlaBreached(true);
            }
        }
        return supportTicketRepository.save(ticket);
    }

    @Transactional
    public SupportTicket resolveTicket(Long id, String resolution) {
        SupportTicket ticket = getTicketById(id);
        ticket.setStatus(OpsConstants.TICKET_RESOLVED);
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setResolution(resolution);
        // Check resolution SLA
        if (ticket.getSlaDeadline() != null && LocalDateTime.now().isAfter(ticket.getSlaDeadline())) {
            ticket.setSlaBreached(true);
        }
        return supportTicketRepository.save(ticket);
    }

    @Transactional
    public SupportTicket closeTicket(Long id, Integer csatScore, String feedback) {
        SupportTicket ticket = getTicketById(id);
        ticket.setStatus(OpsConstants.TICKET_CLOSED);
        if (csatScore != null) ticket.setCustomerSatisfactionScore(csatScore);
        if (feedback != null) ticket.setCustomerFeedback(feedback);
        return supportTicketRepository.save(ticket);
    }

    @Transactional
    public SupportTicket escalateTicket(Long id, String reason) {
        SupportTicket ticket = getTicketById(id);
        ticket.setEscalationCount(ticket.getEscalationCount() + 1);
        ticket.setStatus(OpsConstants.TICKET_IN_PROGRESS);
        return supportTicketRepository.save(ticket);
    }

    public long getOpenTicketCount() {
        return supportTicketRepository.countByStatus(OpsConstants.TICKET_OPEN);
    }

    public double getAvgCsatScore() {
        return supportTicketRepository.avgCsatScore();
    }

    public List<Object[]> getTicketCountByStatus() {
        return supportTicketRepository.countByStatus();
    }

    public List<Object[]> getOpenTicketsByPriority() {
        return supportTicketRepository.countOpenByPriority();
    }
}
