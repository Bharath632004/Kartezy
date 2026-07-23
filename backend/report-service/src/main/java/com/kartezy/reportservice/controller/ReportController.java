package com.kartezy.reportservice.controller;

import com.kartezy.reportservice.dto.ReportDto;
import com.kartezy.reportservice.service.ReportService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReportDto>> createReport(@RequestBody ReportDto request) {
        return ResponseEntity.ok(ApiResponse.success(reportService.createReport(request)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ReportDto>>> getAllReports() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getAllReports()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReportDto>> getReport(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getReport(id)));
    }

    @PostMapping("/{id}/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> generateReport(@PathVariable UUID id) {
        String filePath = reportService.generateReport(id);
        return ResponseEntity.ok(ApiResponse.success(filePath, "Report generated successfully"));
    }
}
