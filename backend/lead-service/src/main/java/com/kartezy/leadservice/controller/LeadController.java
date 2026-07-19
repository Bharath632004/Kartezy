package com.kartezy.leadservice.controller;

import com.kartezy.leadservice.entity.Lead;
import com.kartezy.leadservice.entity.LeadStatus;
import com.kartezy.leadservice.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead) {
        Lead created = leadService.createLead(lead);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads(
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(required = false) String assignedTo) {
        if (status != null) {
            return ResponseEntity.ok(leadService.getLeadsByStatus(status));
        }
        if (assignedTo != null) {
            return ResponseEntity.ok(leadService.getLeadsByAssignedTo(assignedTo));
        }
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable UUID id) {
        return leadService.getLeadById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable UUID id, @RequestBody Lead lead) {
        Lead updated = leadService.updateLead(id, lead);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable UUID id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Lead> updateLeadStatus(@PathVariable UUID id, @RequestBody LeadStatus status) {
        Lead updated = leadService.updateLeadStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getLeadCount() {
        return ResponseEntity.ok(leadService.getLeadCount());
    }
}
