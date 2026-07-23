package com.kartezy.adminservice.service;

import com.kartezy.adminservice.dto.AdminActionDto;
import com.kartezy.adminservice.dto.DashboardDto;
import com.kartezy.adminservice.entity.AdminAction;
import com.kartezy.adminservice.repository.AdminActionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminActionRepository actionRepository;

    public DashboardDto getDashboard() {
        // In a full implementation, this would aggregate data from other services
        return DashboardDto.builder()
            .totalUsers(0)
            .totalMerchants(0)
            .totalOrders(0)
            .totalRevenue(0)
            .pendingApprovals(0)
            .activeDeliveries(0)
            .orderStatusBreakdown(new HashMap<>())
            .revenueByDay(new HashMap<>())
            .build();
    }

    public List<AdminActionDto> getRecentActions(int limit) {
        return actionRepository.findTop50ByOrderByCreatedAtDesc()
            .stream().limit(limit)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public List<AdminActionDto> getActionsByAdmin(UUID adminId) {
        return actionRepository.findByAdminIdOrderByCreatedAtDesc(adminId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void logAction(AdminActionDto dto) {
        AdminAction action = AdminAction.builder()
            .adminId(dto.getAdminId())
            .actionType(dto.getActionType())
            .targetType(dto.getTargetType())
            .targetId(dto.getTargetId())
            .description(dto.getDescription())
            .details(dto.getDetails())
            .severity(dto.getSeverity())
            .build();
        actionRepository.save(action);
        log.info("Admin action logged: {} by adminId={}", dto.getActionType(), dto.getAdminId());
    }

    private AdminActionDto toDto(AdminAction action) {
        return AdminActionDto.builder()
            .id(action.getId())
            .adminId(action.getAdminId())
            .actionType(action.getActionType())
            .targetType(action.getTargetType())
            .targetId(action.getTargetId())
            .description(action.getDescription())
            .details(action.getDetails())
            .severity(action.getSeverity())
            .timestamp(action.getCreatedAt())
            .build();
    }
}
