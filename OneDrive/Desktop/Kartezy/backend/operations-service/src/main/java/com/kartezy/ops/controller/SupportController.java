package com.kartezy.ops.controller;

import com.kartezy.ops.entity.SupportTicket;
import com.kartezy.ops.service.SupportOpsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportOpsService supportOpsService;

    @GetMapping("/tickets")
    public ResponseEntity<List<SupportTicket>> getAllTickets() {
        return ResponseEntity.ok(supportOpsService.getAllTickets());
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<SupportTicket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(supportOpsService.getTicketById(id));
    }

    @GetMapping("/tickets/number/{ticketNumber}")
    public ResponseEntity<SupportTicket> getTicketByNumber(@PathVariable String ticketNumber) {
        return ResponseEntity.ok(supportOpsService.getTicketByNumber(ticketNumber));
    }

    @GetMapping("/tickets/customer/{customerId}")
    public ResponseEntity<List<SupportTicket>> getTicketsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(supportOpsService.getTicketsByCustomer(customerId));
    }

    @GetMapping("/tickets/status/{status}")
    public ResponseEntity<List<SupportTicket>> getTicketsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(supportOpsService.getTicketsByStatus(status));
    }

    @GetMapping("/tickets/priority/{priority}")
    public ResponseEntity<List<SupportTicket>> getTicketsByPriority(@PathVariable String priority) {
        return ResponseEntity.ok(supportOpsService.getTicketsByPriority(priority));
    }

    @GetMapping("/tickets/sla-breach")
    public ResponseEntity<List<SupportTicket>> getSlaBreachedTickets() {
        return ResponseEntity.ok(supportOpsService.getSlaBreachedTickets());
    }

    @PostMapping("/tickets")
    public ResponseEntity<SupportTicket> createTicket(@RequestBody SupportTicket ticket) {
        return ResponseEntity.ok(supportOpsService.createTicket(ticket));
    }

    @PostMapping("/tickets/{id}/assign")
    public ResponseEntity<SupportTicket> assignTicket(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(supportOpsService.assignTicket(id, body.get("assignee")));
    }

    @PostMapping("/tickets/{id}/first-response")
    public ResponseEntity<SupportTicket> addFirstResponse(@PathVariable Long id) {
        return ResponseEntity.ok(supportOpsService.addFirstResponse(id));
    }

    @PostMapping("/tickets/{id}/resolve")
    public ResponseEntity<SupportTicket> resolveTicket(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(supportOpsService.resolveTicket(id, body.get("resolution")));
    }

    @PostMapping("/tickets/{id}/close")
    public ResponseEntity<SupportTicket> closeTicket(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(supportOpsService.closeTicket(id,
            (Integer) body.get("csatScore"),
            (String) body.get("feedback")));
    }

    @PostMapping("/tickets/{id}/escalate")
    public ResponseEntity<SupportTicket> escalateTicket(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(supportOpsService.escalateTicket(id, body.get("reason")));
    }

    @GetMapping("/stats/tickets")
    public ResponseEntity<List<Object[]>> getTicketStats() {
        return ResponseEntity.ok(supportOpsService.getTicketCountByStatus());
    }

    @GetMapping("/stats/open-priority")
    public ResponseEntity<List<Object[]>> getOpenByPriority() {
        return ResponseEntity.ok(supportOpsService.getOpenTicketsByPriority());
    }
}
