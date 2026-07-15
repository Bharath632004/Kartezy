package com.kartezy.supportservice.service;
import com.kartezy.supportservice.dto.*;
import com.kartezy.supportservice.entity.*;
import com.kartezy.supportservice.entity.Ticket.TicketPriority;
import com.kartezy.supportservice.entity.Ticket.TicketStatus;
import com.kartezy.supportservice.repository.*;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j @Service @RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMessageRepository messageRepository;

    @Transactional
    public TicketDto createTicket(CreateTicketRequest req) {
        TicketPriority priority;
        try { priority = TicketPriority.valueOf(req.getPriority().toUpperCase()); }
        catch (Exception e) { priority = TicketPriority.MEDIUM; }

        Ticket ticket = Ticket.builder().userId(req.getUserId())
            .userEmail(req.getUserEmail()).userName(req.getUserName())
            .subject(req.getSubject()).description(req.getDescription())
            .category(req.getCategory()).priority(priority)
            .slaDeadline(priority == TicketPriority.URGENT ? LocalDateTime.now().plusHours(4) :
                         priority == TicketPriority.HIGH ? LocalDateTime.now().plusHours(8) :
                         LocalDateTime.now().plusHours(24))
            .build();
        ticket = ticketRepository.save(ticket);
        log.info("Ticket created: {} - {}", ticket.getTicketNumber(), req.getSubject());
        return toDto(ticket);
    }

    @Transactional
    public TicketDto assignTicket(UUID ticketId, UUID agentId, String agentName) {
        Ticket t = ticketRepository.findById(ticketId).orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        t.setAssignedTo(agentId); t.setAssignedToName(agentName);
        t.setAssignedAt(LocalDateTime.now()); t.setStatus(TicketStatus.IN_PROGRESS);
        t = ticketRepository.save(t); return toDto(t);
    }

    @Transactional
    public TicketDto resolveTicket(UUID ticketId, String resolution) {
        Ticket t = ticketRepository.findById(ticketId).orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        t.setResolution(resolution); t.setStatus(TicketStatus.RESOLVED);
        t.setResolvedAt(LocalDateTime.now()); t = ticketRepository.save(t);
        return toDto(t);
    }

    @Transactional
    public TicketDto closeTicket(UUID ticketId, int rating) {
        Ticket t = ticketRepository.findById(ticketId).orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        t.setStatus(TicketStatus.CLOSED); t.setClosedAt(LocalDateTime.now());
        t.setSatisfactionRating(rating); t = ticketRepository.save(t);
        return toDto(t);
    }

    @Transactional
    public TicketMessageDto addMessage(UUID ticketId, UUID senderId, String senderName, String senderType, String message) {
        TicketMessage msg = TicketMessage.builder().ticketId(ticketId)
            .senderId(senderId).senderName(senderName).senderType(senderType).message(message).build();
        msg = messageRepository.save(msg);
        return toMessageDto(msg);
    }

    @Cacheable(value = "tickets", key = "#id")
    public TicketDto getTicket(UUID id) {
        Ticket t = ticketRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        return toDto(t);
    }

    @Cacheable(value = "tickets", key = "'user:'+#userId")
    public List<TicketDto> getUserTickets(UUID userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<TicketMessageDto> getMessages(UUID ticketId) {
        return messageRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream().map(this::toMessageDto).collect(Collectors.toList());
    }

    public TicketStatsDto getStats() {
        return TicketStatsDto.builder()
            .open(ticketRepository.countByStatus(TicketStatus.OPEN))
            .inProgress(ticketRepository.countByStatus(TicketStatus.IN_PROGRESS))
            .resolved(ticketRepository.countByStatus(TicketStatus.RESOLVED))
            .closed(ticketRepository.countByStatus(TicketStatus.CLOSED))
            .urgent(ticketRepository.countByStatus(TicketStatus.OPEN))
            .avgResolutionTimeHours(4.5).build();
    }

    private TicketDto toDto(Ticket t) {
        return TicketDto.builder().id(t.getId()).ticketNumber(t.getTicketNumber())
            .userId(t.getUserId()).userEmail(t.getUserEmail()).userName(t.getUserName())
            .subject(t.getSubject()).description(t.getDescription()).category(t.getCategory())
            .priority(t.getPriority().name()).status(t.getStatus().name())
            .assignedTo(t.getAssignedTo()).assignedToName(t.getAssignedToName())
            .assignedAt(t.getAssignedAt()).resolvedAt(t.getResolvedAt())
            .resolution(t.getResolution()).satisfactionRating(t.getSatisfactionRating())
            .slaDeadline(t.getSlaDeadline()).createdAt(t.getCreatedAt())
            .messages(getMessages(t.getId())).build();
    }
    private TicketMessageDto toMessageDto(TicketMessage m) {
        return TicketMessageDto.builder().id(m.getId()).senderId(m.getSenderId())
            .senderName(m.getSenderName()).senderType(m.getSenderType())
            .message(m.getMessage()).attachmentUrl(m.getAttachmentUrl())
            .createdAt(m.getCreatedAt()).build();
    }
}
