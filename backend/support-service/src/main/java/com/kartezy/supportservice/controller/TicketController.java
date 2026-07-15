package com.kartezy.supportservice.controller;
import com.kartezy.supportservice.dto.*;
import com.kartezy.supportservice.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/support") @RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    @PostMapping("/tickets")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketDto> createTicket(@Valid @RequestBody CreateTicketRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(req));
    }

    @GetMapping("/tickets/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketDto> getTicket(@PathVariable UUID id) {
        return ResponseEntity.ok(ticketService.getTicket(id));
    }

    @GetMapping("/tickets/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketDto>> getUserTickets(@PathVariable UUID userId) {
        return ResponseEntity.ok(ticketService.getUserTickets(userId));
    }

    @PutMapping("/tickets/{id}/assign/{agentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketDto> assignTicket(@PathVariable UUID id, @PathVariable UUID agentId, @RequestParam String agentName) {
        return ResponseEntity.ok(ticketService.assignTicket(id, agentId, agentName));
    }

    @PutMapping("/tickets/{id}/resolve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketDto> resolveTicket(@PathVariable UUID id, @RequestParam String resolution) {
        return ResponseEntity.ok(ticketService.resolveTicket(id, resolution));
    }

    @PutMapping("/tickets/{id}/close")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketDto> closeTicket(@PathVariable UUID id, @RequestParam(defaultValue = "0") int rating) {
        return ResponseEntity.ok(ticketService.closeTicket(id, rating));
    }

    @PostMapping("/tickets/{id}/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketMessageDto> addMessage(@PathVariable UUID id, @RequestParam UUID senderId,
                                                        @RequestParam String senderName, @RequestParam String senderType,
                                                        @RequestParam String message) {
        return ResponseEntity.ok(ticketService.addMessage(id, senderId, senderName, senderType, message));
    }

    @GetMapping("/tickets/{id}/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketMessageDto>> getMessages(@PathVariable UUID id) {
        return ResponseEntity.ok(ticketService.getMessages(id));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketStatsDto> getStats() {
        return ResponseEntity.ok(ticketService.getStats());
    }
}
