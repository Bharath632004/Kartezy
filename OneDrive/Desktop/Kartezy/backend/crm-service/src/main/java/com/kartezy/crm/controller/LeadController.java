package com.kartezy.crm.controller;

import com.kartezy.crm.constants.LeadSource;
import com.kartezy.crm.entity.Lead;
import com.kartezy.crm.service.LeadManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/crm/leads")
@RequiredArgsConstructor
@Tag(name = "Lead Management", description = "Lead capture, scoring, and pipeline management")
public class LeadController {

    private final LeadManagementService leadService;

    @PostMapping
    @Operation(summary = "Create a new lead")
    public ResponseEntity<Map<String, Object>> createLead(@RequestBody Lead lead) {
        Lead created = leadService.createLead(lead);
        return ResponseEntity.ok(wrapResponse(created, "Lead created"));
    }

    @GetMapping
    @Operation(summary = "Get leads with filters")
    public ResponseEntity<Map<String, Object>> getLeads(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) LeadSource source,
        @RequestParam(required = false) String assignedTo,
        Pageable pageable) {
        Page<Lead> leads = leadService.getLeads(status, source, assignedTo, pageable);
        return ResponseEntity.ok(wrapResponse(leads, "Leads retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lead details")
    public ResponseEntity<Map<String, Object>> getLead(@PathVariable Long id) {
        Lead lead = leadService.getLead(id);
        return ResponseEntity.ok(wrapResponse(lead, "Lead retrieved"));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update lead status")
    public ResponseEntity<Map<String, Object>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Lead lead = leadService.updateLeadStatus(id, status);
        return ResponseEntity.ok(wrapResponse(lead, "Lead status updated"));
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Assign lead to user")
    public ResponseEntity<Map<String, Object>> assignLead(@PathVariable Long id, @RequestParam String assignedTo) {
        Lead lead = leadService.assignLead(id, assignedTo);
        return ResponseEntity.ok(wrapResponse(lead, "Lead assigned"));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get lead analytics")
    public ResponseEntity<Map<String, Object>> getLeadAnalytics() {
        Map<String, Object> analytics = leadService.getLeadAnalytics();
        return ResponseEntity.ok(wrapResponse(analytics, "Lead analytics retrieved"));
    }

    private Map<String, Object> wrapResponse(Object data, String message) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
