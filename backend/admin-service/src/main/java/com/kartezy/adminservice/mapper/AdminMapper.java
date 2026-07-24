package com.kartezy.adminservice.mapper;

import com.kartezy.adminservice.dto.AdminActionDto;
import com.kartezy.adminservice.dto.DashboardDto;
import com.kartezy.adminservice.entity.AdminAction;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

public class AdminMapper {

    private AdminMapper() {}

    public static AdminActionDto toActionDto(AdminAction action) {
        if (action == null) return null;
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

    public static AdminAction toActionEntity(AdminActionDto dto) {
        if (dto == null) return null;
        return AdminAction.builder()
            .adminId(dto.getAdminId())
            .actionType(dto.getActionType())
            .targetType(dto.getTargetType())
            .targetId(dto.getTargetId())
            .description(dto.getDescription())
            .details(dto.getDetails())
            .severity(dto.getSeverity())
            .build();
    }

    public static DashboardDto emptyDashboard() {
        return DashboardDto.builder()
            .totalUsers(0).totalMerchants(0).totalOrders(0)
            .totalRevenue(0).pendingApprovals(0).activeDeliveries(0)
            .orderStatusBreakdown(Collections.emptyMap())
            .revenueByDay(Collections.emptyMap())
            .build();
    }
}
