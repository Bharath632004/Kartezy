package com.kartezy.adminservice.controller;

import com.kartezy.adminservice.dto.AdminActionDto;
import com.kartezy.adminservice.dto.DashboardDto;
import com.kartezy.adminservice.service.AdminService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardDto>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboard()));
    }

    @GetMapping("/actions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AdminActionDto>>> getAdminActions(
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getRecentActions(limit)));
    }

    @GetMapping("/actions/{adminId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AdminActionDto>>> getActionsByAdmin(
            @PathVariable UUID adminId) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getActionsByAdmin(adminId)));
    }
}
