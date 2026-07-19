package com.kartezy.leadservice.repository;

import com.kartezy.leadservice.entity.Lead;
import com.kartezy.leadservice.entity.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LeadRepository extends JpaRepository<Lead, UUID> {
    List<Lead> findByStatus(LeadStatus status);
    List<Lead> findByAssignedTo(String assignedTo);
    List<Lead> findBySource(String source);
    List<Lead> findByEmail(String email);
}
