package com.kartezy.ops.service;

import com.kartezy.ops.entity.Escalation;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.EscalationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EscalationService {

    private final EscalationRepository escalationRepository;

    public List<Escalation> getEscalationsByTicket(Long ticketId) {
        return escalationRepository.findByTicketId(ticketId);
    }

    public Escalation getEscalationById(Long id) {
        return escalationRepository.findById(id)
            .orElseThrow(() -> new OpsException("Escalation not found: " + id, "ESC_NOT_FOUND"));
    }

    public List<Escalation> getEscalationsByLevel(String level) {
        return escalationRepository.findByEscalationLevel(level);
    }

    public List<Escalation> getPendingEscalations() {
        return escalationRepository.findByStatus("PENDING");
    }

    @Transactional
    public Escalation createEscalation(Escalation escalation) {
        escalation.setEscalatedAt(LocalDateTime.now());
        escalation.setStatus("PENDING");
        return escalationRepository.save(escalation);
    }

    @Transactional
    public Escalation acknowledgeEscalation(Long id) {
        Escalation escalation = getEscalationById(id);
        escalation.setStatus("ACKNOWLEDGED");
        escalation.setAcknowledgedAt(LocalDateTime.now());
        return escalationRepository.save(escalation);
    }

    @Transactional
    public Escalation resolveEscalation(Long id, String resolution) {
        Escalation escalation = getEscalationById(id);
        escalation.setStatus("RESOLVED");
        escalation.setResolution(resolution);
        escalation.setResolvedAt(LocalDateTime.now());
        return escalationRepository.save(escalation);
    }

    public List<Object[]> getEscalationCountByLevel() {
        return escalationRepository.countByLevel();
    }

    public List<Object[]> getEscalationCountByStatus() {
        return escalationRepository.countByStatus();
    }
}
