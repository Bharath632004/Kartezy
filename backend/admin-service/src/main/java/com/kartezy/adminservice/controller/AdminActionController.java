package com.kartezy.adminservice.controller;

import com.kartezy.adminservice.dto.AdminActionDto;
import com.kartezy.adminservice.service.AdminService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/logs")
@RequiredArgsConstructor
public class AdminActionController {

    private final AdminService adminService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminActionDto>> logAction(@RequestBody AdminActionDto action) {
        adminService.logAction(action);
        return ResponseEntity.ok(ApiResponse.success(null, "Action logged"));
    }
}
