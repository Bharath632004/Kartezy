package com.kartezy.crm.repository;

import com.kartezy.crm.constants.LeadSource;
import com.kartezy.crm.entity.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    Page<Lead> findByStatus(String status, Pageable pageable);

    Page<Lead> findBySource(LeadSource source, Pageable pageable);

    Page<Lead> findByAssignedTo(String assignedTo, Pageable pageable);

    List<Lead> findByLeadScoreGreaterThanEqual(Integer minScore);

    long countByStatus(String status);

    @Query("SELECT l FROM Lead l WHERE l.convertedToUserId IS NOT NULL")
    List<Lead> findConvertedLeads();

    @Query("SELECT l.source, COUNT(l) FROM Lead l GROUP BY l.source ORDER BY COUNT(l) DESC")
    List<Object[]> getLeadCountBySource();

    @Query("SELECT l.status, COUNT(l) FROM Lead l GROUP BY l.status")
    List<Object[]> getLeadCountByStatus();

    @Query("SELECT COALESCE(AVG(l.leadScore), 0) FROM Lead l WHERE l.status != 'LOST'")
    Double getAverageLeadScore();

    @Query("SELECT l FROM Lead l WHERE l.campaignId = :campaignId")
    List<Lead> findByCampaignId(@Param("campaignId") Long campaignId);
}
