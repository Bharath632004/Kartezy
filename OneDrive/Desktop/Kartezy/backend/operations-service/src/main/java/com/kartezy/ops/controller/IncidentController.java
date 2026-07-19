package com.kartezy.ops.controller;

import com.kartezy.ops.entity.Incident;
import com.kartezy.ops.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<Incident>> getBySeverity(@PathVariable String severity) {
        return ResponseEntity.ok(incidentService.getIncidentsBySeverity(severity));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Incident>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(incidentService.getIncidentsByStatus(status));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Incident>> getRecentIncidents() {
        return ResponseEntity.ok(incidentService.getRecentIncidents());
    }

    @PostMapping
    public ResponseEntity<Incident> createIncident(@RequestBody Incident incident) {
        return ResponseEntity.ok(incidentService.createIncident(incident));
    }

    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<Incident> acknowledge(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(incidentService.acknowledgeIncident(id, body.get("assignedTo")));
    }

    @PostMapping("/{id}/mitigate")
    public ResponseEntity<Incident> mitigate(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(incidentService.mitigateIncident(id, body.get("resolution")));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<Incident> resolve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(incidentService.resolveIncident(id, body.get("rootCause"), body.get("lessons")));
    }

    @GetMapping("/stats/severity")
    public ResponseEntity<List<Object[]>> getSeverityStats() {
        return ResponseEntity.ok(incidentService.getIncidentCountBySeverity());
    }

    @GetMapping("/stats/status")
    public ResponseEntity<List<Object[]>> getStatusStats() {
        return ResponseEntity.ok(incidentService.getIncidentCountByStatus());
    }

    @GetMapping("/stats/category")
    public ResponseEntity<List<Object[]>> getCategoryStats() {
        return ResponseEntity.ok(incidentService.getIncidentCountByCategory());
    }
}
