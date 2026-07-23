package com.kartezy.reportservice.repository;

import com.kartezy.reportservice.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByActiveTrue();
    List<Report> findByReportType(String reportType);
    List<Report> findByCreatedByOrderByCreatedAtDesc(String createdBy);
}
