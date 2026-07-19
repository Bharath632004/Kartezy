package com.kartezy.crm.service;

import com.kartezy.crm.constants.CrmConstants;
import com.kartezy.crm.constants.LeadSource;
import com.kartezy.crm.entity.Lead;
import com.kartezy.crm.exception.CrmException;
import com.kartezy.crm.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeadManagementService {

    private final LeadRepository leadRepository;

    @Transactional
    public Lead createLead(Lead lead) {
        lead.setStatus(CrmConstants.LEAD_NEW);
        lead.setLeadScore(calculateLeadScore(lead));
        return leadRepository.save(lead);
    }

    @Transactional
    public Lead updateLeadStatus(Long leadId, String status) {
        Lead lead = leadRepository.findById(leadId)
            .orElseThrow(() -> new CrmException("Lead not found: " + leadId));
        lead.setStatus(status);

        if (CrmConstants.LEAD_CONVERTED.equals(status) && lead.getConvertedToUserId() == null) {
            // Would create user and link here
        }
        if (CrmConstants.LEAD_CONTACTED.equals(status)) {
            lead.setLastContactedAt(LocalDateTime.now());
        }

        return leadRepository.save(lead);
    }

    @Transactional
    public Lead assignLead(Long leadId, String assignedTo) {
        Lead lead = leadRepository.findById(leadId)
            .orElseThrow(() -> new CrmException("Lead not found: " + leadId));
        lead.setAssignedTo(assignedTo);
        lead.setAssignedAt(LocalDateTime.now());
        return leadRepository.save(lead);
    }

    @Transactional(readOnly = true)
    public Page<Lead> getLeads(String status, LeadSource source, String assignedTo, Pageable pageable) {
        if (status != null) return leadRepository.findByStatus(status, pageable);
        if (source != null) return leadRepository.findBySource(source, pageable);
        if (assignedTo != null) return leadRepository.findByAssignedTo(assignedTo, pageable);
        return leadRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Lead getLead(Long id) {
        return leadRepository.findById(id)
            .orElseThrow(() -> new CrmException("Lead not found: " + id));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getLeadAnalytics() {
        return Map.of(
            "totalLeads", leadRepository.count(),
            "newLeads", leadRepository.countByStatus(CrmConstants.LEAD_NEW),
            "contacted", leadRepository.countByStatus(CrmConstants.LEAD_CONTACTED),
            "qualified", leadRepository.countByStatus(CrmConstants.LEAD_QUALIFIED),
            "converted", leadRepository.countByStatus(CrmConstants.LEAD_CONVERTED),
            "lost", leadRepository.countByStatus(CrmConstants.LEAD_LOST),
            "avgScore", leadRepository.getAverageLeadScore()
        );
    }

    private int calculateLeadScore(Lead lead) {
        int score = 0;
        if (lead.getEmail() != null && lead.getEmail().contains("@")) score += 10;
        if (lead.getPhone() != null && lead.getPhone().length() >= 10) score += 10;
        if (lead.getCompany() != null) score += 15;
        if (lead.getBudget() != null && lead.getBudget().doubleValue() > 0) score += 20;
        if (lead.getInterestCategory() != null) score += 15;
        if (lead.getSource() == LeadSource.REFERRAL) score += 20;
        if (lead.getSource() == LeadSource.WEBSITE || lead.getSource() == LeadSource.MOBILE_APP) score += 10;
        if (lead.getMessage() != null && lead.getMessage().length() > 50) score += 10;
        return Math.min(score, 100);
    }
}
