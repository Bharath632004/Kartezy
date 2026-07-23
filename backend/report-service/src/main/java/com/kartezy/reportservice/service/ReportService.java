package com.kartezy.reportservice.service;

import com.kartezy.reportservice.dto.ReportDto;
import com.kartezy.reportservice.entity.Report;
import com.kartezy.reportservice.repository.ReportRepository;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportDto createReport(ReportDto request) {
        Report report = Report.builder()
            .name(request.getName())
            .description(request.getDescription())
            .reportType(request.getReportType())
            .format(request.getFormat())
            .queryConfig(request.getQueryConfig())
            .parameters(request.getParameters())
            .createdBy(request.getCreatedBy())
            .active(true)
            .build();
        report = reportRepository.save(report);
        log.info("Report created: {}", report.getName());
        return toDto(report);
    }

    public List<ReportDto> getAllReports() {
        return reportRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ReportDto getReport(UUID id) {
        Report report = reportRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + id));
        return toDto(report);
    }

    public String generateReport(UUID id) {
        Report report = reportRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + id));
        // In production, this would trigger async report generation (CSV, PDF, etc.)
        log.info("Report generation triggered: {}", report.getName());
        return "/reports/" + report.getName() + "." + report.getFormat().toLowerCase();
    }

    private ReportDto toDto(Report report) {
        return ReportDto.builder()
            .id(report.getId())
            .name(report.getName())
            .description(report.getDescription())
            .reportType(report.getReportType())
            .format(report.getFormat())
            .queryConfig(report.getQueryConfig())
            .parameters(report.getParameters())
            .filePath(report.getFilePath())
            .active(report.isActive())
            .createdBy(report.getCreatedBy())
            .createdAt(report.getCreatedAt())
            .updatedAt(report.getUpdatedAt())
            .build();
    }
}
