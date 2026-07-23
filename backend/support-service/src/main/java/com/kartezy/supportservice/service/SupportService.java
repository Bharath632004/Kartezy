package com.kartezy.supportservice.service;

import com.kartezy.shared.exception.ResourceNotFoundException;
import com.kartezy.supportservice.dto.SupportTicketDto;
import com.kartezy.supportservice.entity.SupportTicket;
import com.kartezy.supportservice.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportTicketRepository ticketRepository;

    @Transactional
    public SupportTicketDto createTicket(SupportTicketDto request) {
        SupportTicket ticket = SupportTicket.builder()
            .userId(request.getUserId()).subject(request.getSubject())
            .description(request.getDescription()).category(request.getCategory())
            .priority(request.getPriority() != null ? request.getPriority() : "MEDIUM")
            .status("OPEN").source(request.getSource() != null ? request.getSource() : "APP")
            .orderId(request.getOrderId()).orderNumber(request.getOrderNumber())
            .build();
        ticket = ticketRepository.save(ticket);
        log.info("Support ticket created: id={} userId={} subject={}", ticket.getId(), ticket.getUserId(), ticket.getSubject());
        return toDto(ticket);
    }

    public List<SupportTicketDto> getUserTickets(UUID userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public SupportTicketDto getTicket(UUID id) {
        return toDto(ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id)));
    }

    @Transactional
    public SupportTicketDto updateTicketStatus(UUID id, String status, String resolution) {
        SupportTicket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));
        ticket.setStatus(status);
        ticket.setResolution(resolution);
        if ("RESOLVED".equals(status) || "CLOSED".equals(status)) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        ticketRepository.save(ticket);
        log.info("Ticket {} updated: status={}", id, status);
        return toDto(ticket);
    }

    public List<SupportTicketDto> getAllTickets(String status) {
        if (status != null && !status.isEmpty()) {
            return ticketRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream().map(this::toDto).collect(Collectors.toList());
        }
        return ticketRepository.findAllByOrderByCreatedAtDesc()
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    private SupportTicketDto toDto(SupportTicket ticket) {
        return SupportTicketDto.builder()
            .id(ticket.getId()).userId(ticket.getUserId()).subject(ticket.getSubject())
            .description(ticket.getDescription()).category(ticket.getCategory())
            .priority(ticket.getPriority()).status(ticket.getStatus())
            .source(ticket.getSource()).orderId(ticket.getOrderId())
            .orderNumber(ticket.getOrderNumber()).resolution(ticket.getResolution())
            .assignedTo(ticket.getAssignedTo())
            .createdAt(ticket.getCreatedAt()).updatedAt(ticket.getUpdatedAt())
            .resolvedAt(ticket.getResolvedAt()).build();
    }
}
