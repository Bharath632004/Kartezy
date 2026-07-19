package com.kartezy.ops.controller;

import com.kartezy.ops.entity.Escalation;
import com.kartezy.ops.service.EscalationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/escalations")
@RequiredArgsConstructor
public class EscalationController {

    private final EscalationService escalationService;

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<Escalation>> getByTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(escalationService.getEscalationsByTicket(ticketId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Escalation> getEscalationById(@PathVariable Long id) {
        return ResponseEntity.ok(escalationService.getEscalationById(id));
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<Escalation>> getByLevel(@PathVariable String level) {
        return ResponseEntity.ok(escalationService.getEscalationsByLevel(level));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Escalation>> getPending() {
        return ResponseEntity.ok(escalationService.getPendingEscalations());
    }

    @PostMapping
    public ResponseEntity<Escalation> createEscalation(@RequestBody Escalation escalation) {
        return ResponseEntity.ok(escalationService.createEscalation(escalation));
    }

    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<Escalation> acknowledge(@PathVariable Long id) {
        return ResponseEntity.ok(escalationService.acknowledgeEscalation(id));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<Escalation> resolve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(escalationService.resolveEscalation(id, body.get("resolution")));
    }

    @GetMapping("/stats/level")
    public ResponseEntity<List<Object[]>> getLevelStats() {
        return ResponseEntity.ok(escalationService.getEscalationCountByLevel());
    }

    @GetMapping("/stats/status")
    public ResponseEntity<List<Object[]>> getStatusStats() {
        return ResponseEntity.ok(escalationService.getEscalationCountByStatus());
    }
}
