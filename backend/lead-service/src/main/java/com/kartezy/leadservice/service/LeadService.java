package com.kartezy.leadservice.service;

import com.kartezy.leadservice.entity.Lead;
import com.kartezy.leadservice.entity.LeadStatus;
import com.kartezy.leadservice.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeadService {

    private final LeadRepository leadRepository;

    public Lead createLead(Lead lead) {
        log.info("Creating lead: {}", lead.getEmail());
        return leadRepository.save(lead);
    }

    public Optional<Lead> getLeadById(UUID id) {
        return leadRepository.findById(id);
    }

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    public List<Lead> getLeadsByStatus(LeadStatus status) {
        return leadRepository.findByStatus(status);
    }

    public List<Lead> getLeadsByAssignedTo(String assignedTo) {
        return leadRepository.findByAssignedTo(assignedTo);
    }

    public Lead updateLead(UUID id, Lead updatedLead) {
        return leadRepository.findById(id)
                .map(lead -> {
                    lead.setName(updatedLead.getName());
                    lead.setEmail(updatedLead.getEmail());
                    lead.setPhoneNumber(updatedLead.getPhoneNumber());
                    lead.setSource(updatedLead.getSource());
                    lead.setStatus(updatedLead.getStatus());
                    lead.setAssignedTo(updatedLead.getAssignedTo());
                    lead.setNotes(updatedLead.getNotes());
                    lead.setScore(updatedLead.getScore());
                    if (updatedLead.getConvertedToUserId() != null) {
                        lead.setConvertedToUserId(updatedLead.getConvertedToUserId());
                    }
                    return leadRepository.save(lead);
                })
                .orElseThrow(() -> new RuntimeException("Lead not found: " + id));
    }

    public void deleteLead(UUID id) {
        leadRepository.deleteById(id);
    }

    public Lead updateLeadStatus(UUID id, LeadStatus status) {
        return leadRepository.findById(id)
                .map(lead -> {
                    lead.setStatus(status);
                    return leadRepository.save(lead);
                })
                .orElseThrow(() -> new RuntimeException("Lead not found: " + id));
    }

    public long getLeadCount() {
        return leadRepository.count();
    }
}
