package com.kartezy.leadservice.service;

import com.kartezy.leadservice.entity.Lead;
import com.kartezy.leadservice.entity.LeadStatus;
import com.kartezy.leadservice.repository.LeadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeadServiceTest {

    @Mock
    private LeadRepository leadRepository;

    private LeadService leadService;

    @BeforeEach
    void setUp() {
        leadService = new LeadService(leadRepository);
    }

    @Test
    void createLead_ShouldReturnSavedLead() {
        Lead lead = Lead.builder()
                .name("Test Lead")
                .email("test@example.com")
                .source("WEBSITE")
                .status(LeadStatus.NEW)
                .build();

        when(leadRepository.save(any(Lead.class))).thenReturn(lead);

        Lead result = leadService.createLead(lead);

        assertNotNull(result);
        assertEquals("Test Lead", result.getName());
        verify(leadRepository).save(lead);
    }

    @Test
    void getLeadById_ShouldReturnLead_WhenExists() {
        UUID id = UUID.randomUUID();
        Lead lead = Lead.builder()
                .id(id)
                .name("Test Lead")
                .email("test@example.com")
                .source("API")
                .status(LeadStatus.NEW)
                .build();

        when(leadRepository.findById(id)).thenReturn(Optional.of(lead));

        Optional<Lead> result = leadService.getLeadById(id);

        assertTrue(result.isPresent());
        assertEquals(id, result.get().getId());
    }

    @Test
    void getLeadById_ShouldReturnEmpty_WhenNotExists() {
        UUID id = UUID.randomUUID();
        when(leadRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Lead> result = leadService.getLeadById(id);

        assertFalse(result.isPresent());
    }

    @Test
    void getAllLeads_ShouldReturnAllLeads() {
        List<Lead> leads = List.of(
                Lead.builder().name("Lead 1").email("l1@test.com").source("WEB").status(LeadStatus.NEW).build(),
                Lead.builder().name("Lead 2").email("l2@test.com").source("API").status(LeadStatus.CONTACTED).build()
        );

        when(leadRepository.findAll()).thenReturn(leads);

        List<Lead> result = leadService.getAllLeads();

        assertEquals(2, result.size());
        verify(leadRepository).findAll();
    }

    @Test
    void deleteLead_ShouldCallRepository() {
        UUID id = UUID.randomUUID();
        doNothing().when(leadRepository).deleteById(id);

        leadService.deleteLead(id);

        verify(leadRepository).deleteById(id);
    }

    @Test
    void updateLeadStatus_ShouldUpdateAndReturn() {
        UUID id = UUID.randomUUID();
        Lead existingLead = Lead.builder()
                .id(id)
                .name("Test")
                .email("test@test.com")
                .source("WEB")
                .status(LeadStatus.NEW)
                .build();

        when(leadRepository.findById(id)).thenReturn(Optional.of(existingLead));
        when(leadRepository.save(any(Lead.class))).thenAnswer(i -> i.getArgument(0));

        Lead result = leadService.updateLeadStatus(id, LeadStatus.CONTACTED);

        assertEquals(LeadStatus.CONTACTED, result.getStatus());
    }
}
