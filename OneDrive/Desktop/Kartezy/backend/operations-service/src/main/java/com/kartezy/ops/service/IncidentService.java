package com.kartezy.ops.service;

import com.kartezy.ops.constants.OpsConstants;
import com.kartezy.ops.entity.Incident;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.IncidentRepository;
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
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
            .orElseThrow(() -> new OpsException("Incident not found: " + id, "INCIDENT_NOT_FOUND"));
    }

    public List<Incident> getIncidentsBySeverity(String severity) {
        return incidentRepository.findBySeverity(severity);
    }

    public List<Incident> getIncidentsByStatus(String status) {
        return incidentRepository.findByStatus(status);
    }

    public List<Incident> getRecentIncidents() {
        return incidentRepository.findByReportedAtAfter(LocalDateTime.now().minusDays(7));
    }

    @Transactional
    public Incident createIncident(Incident incident) {
        incident.setIncidentNumber("INC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        incident.setStatus(OpsConstants.INCIDENT_NEW);
        incident.setReportedAt(LocalDateTime.now());
        return incidentRepository.save(incident);
    }

    @Transactional
    public Incident acknowledgeIncident(Long id, String assignedTo) {
        Incident incident = getIncidentById(id);
        incident.setStatus(OpsConstants.INCIDENT_INVESTIGATING);
        incident.setAssignedTo(assignedTo);
        incident.setAcknowledgedAt(LocalDateTime.now());
        return incidentRepository.save(incident);
    }

    @Transactional
    public Incident mitigateIncident(Long id, String resolution) {
        Incident incident = getIncidentById(id);
        incident.setStatus(OpsConstants.INCIDENT_MITIGATED);
        incident.setResolution(resolution);
        return incidentRepository.save(incident);
    }

    @Transactional
    public Incident resolveIncident(Long id, String rootCause, String lessons) {
        Incident incident = getIncidentById(id);
        incident.setStatus(OpsConstants.INCIDENT_RESOLVED);
        incident.setRootCause(rootCause);
        incident.setLessons(lessons);
        incident.setResolvedAt(LocalDateTime.now());
        return incidentRepository.save(incident);
    }

    @Transactional
    public Incident updateIncidentDetails(Long id, int affectedCustomers, int affectedOrders) {
        Incident incident = getIncidentById(id);
        incident.setAffectedCustomers(affectedCustomers);
        incident.setAffectedOrders(affectedOrders);
        return incidentRepository.save(incident);
    }

    public List<Object[]> getIncidentCountBySeverity() {
        return incidentRepository.countBySeverity();
    }

    public List<Object[]> getIncidentCountByStatus() {
        return incidentRepository.countByStatus();
    }

    public List<Object[]> getIncidentCountByCategory() {
        return incidentRepository.countByCategory();
    }
}
