package com.kartezy.crm.repository;

import com.kartezy.crm.entity.CustomerSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerSegmentRepository extends JpaRepository<CustomerSegment, Long> {

    List<CustomerSegment> findByIsActiveTrue();

    List<CustomerSegment> findByIsDynamicTrue();

    @Query("SELECT COALESCE(SUM(s.memberCount), 0) FROM CustomerSegment s WHERE s.isActive = true")
    long getTotalSegmentMembers();
}
