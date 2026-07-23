package com.kartezy.supportservice.controller;

import com.kartezy.shared.dto.ApiResponse;
import com.kartezy.supportservice.dto.SupportTicketDto;
import com.kartezy.supportservice.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    @PostMapping("/tickets")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SupportTicketDto>> createTicket(@RequestBody SupportTicketDto request) {
        SupportTicketDto ticket = supportService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(ticket, "Ticket created"));
    }

    @GetMapping("/tickets/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SupportTicketDto>> getTicket(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(supportService.getTicket(id)));
    }

    @GetMapping("/tickets/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<SupportTicketDto>>> getUserTickets(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(supportService.getUserTickets(userId)));
    }

    @GetMapping("/tickets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SupportTicketDto>>> getAllTickets(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(supportService.getAllTickets(status)));
    }

    @PutMapping("/tickets/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SupportTicketDto>> updateTicketStatus(
            @PathVariable UUID id,
            @RequestParam String status,
            @RequestParam(required = false) String resolution) {
        SupportTicketDto ticket = supportService.updateTicketStatus(id, status, resolution);
        return ResponseEntity.ok(ApiResponse.success(ticket, "Ticket updated"));
    }
}
