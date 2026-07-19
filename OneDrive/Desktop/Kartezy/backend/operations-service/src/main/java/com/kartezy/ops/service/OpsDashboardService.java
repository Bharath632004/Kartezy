package com.kartezy.ops.service;

import com.kartezy.ops.entity.OpsDashboard;
import com.kartezy.ops.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Map;
import java.util.LinkedHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpsDashboardService {

    private final OpsDashboardRepository opsDashboardRepository;
    private final DeliveryOperationRepository deliveryOperationRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final InventoryOperationRepository inventoryOperationRepository;
    private final MerchantOperationRepository merchantOperationRepository;
    private final SlaRecordRepository slaRecordRepository;
    private final WarehouseRepository warehouseRepository;

    @Cacheable(value = OpsConstants.CACHE_DASHBOARD, key = "'latest'")
    public Map<String, Object> getLiveDashboard() {
        Map<String, Object> dashboard = new LinkedHashMap<>();
        LocalDateTime today = LocalDate.now().atStartOfDay();

        // Order metrics
        long onTime = deliveryOperationRepository.countOnTimeDeliveries(today, LocalDateTime.now());
        long totalDeliveries = deliveryOperationRepository.countDeliveriesInRange(today, LocalDateTime.now());
        dashboard.put("activeDeliveries", deliveryOperationRepository.countByStatus("IN_TRANSIT"));
        dashboard.put("pendingDeliveries", deliveryOperationRepository.countByStatus("PENDING"));
        dashboard.put("todayDeliveries", totalDeliveries);
        dashboard.put("onTimeRate", totalDeliveries > 0 ? (onTime * 100 / totalDeliveries) : 100);

        // Support metrics
        dashboard.put("openTickets", supportTicketRepository.countByStatus("OPEN"));
        dashboard.put("criticalTickets", supportTicketRepository.countByPriority("CRITICAL"));
        dashboard.put("avgCsat", supportTicketRepository.avgCsatScore());

        // Inventory metrics
        dashboard.put("outOfStockSku", inventoryOperationRepository.totalOutOfStock());
        dashboard.put("lowStockSku", inventoryOperationRepository.totalLowStock());

        // Merchant metrics
        dashboard.put("pendingVerifications", merchantOperationRepository.countByVerificationStatus("PENDING_VERIFICATION"));

        // SLA metrics
        dashboard.put("slaBreaches", slaRecordRepository.countBySlaStatus("BREACHED"));

        // Warehouse
        dashboard.put("activeWarehouses", warehouseRepository.findByIsActiveTrue().size());

        return dashboard;
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_DASHBOARD, allEntries = true)
    public void snapshotDailyMetrics() {
        OpsDashboard snapshot = new OpsDashboard();
        snapshot.setSnapshotDate(LocalDateTime.now());

        LocalDateTime today = LocalDate.now().atStartOfDay();

        snapshot.setActiveDeliveries((int) deliveryOperationRepository.countByStatus("IN_TRANSIT"));
        snapshot.setSuccessfulDeliveries((int) deliveryOperationRepository.countByStatus("DELIVERED"));
        snapshot.setOnTimeDeliveries((int) deliveryOperationRepository.countOnTimeDeliveries(today, LocalDateTime.now()));
        snapshot.setTotalOrders(snapshot.getSuccessfulDeliveries() + snapshot.getActiveDeliveries());

        snapshot.setOpenTickets((int) supportTicketRepository.countByStatus("OPEN"));
        snapshot.setCriticalTickets((int) supportTicketRepository.countByPriority("CRITICAL"));
        snapshot.setAvgCsatScore(supportTicketRepository.avgCsatScore());
        snapshot.setAvgResolutionTimeHrs(0.0); // Would need calculation from ticket data
        snapshot.setSlaBreaches((int) slaRecordRepository.countBySlaStatus("BREACHED"));

        snapshot.setOutOfStockItems((int) inventoryOperationRepository.totalOutOfStock());
        snapshot.setLowStockItems((int) inventoryOperationRepository.totalLowStock());

        snapshot.setPendingVerifications((int) merchantOperationRepository.countByVerificationStatus("PENDING_VERIFICATION"));
        snapshot.setActiveMerchants((int) merchantOperationRepository.findByIsActiveTrue().size());

        snapshot.setActiveWarehouses(warehouseRepository.findByIsActiveTrue().size());

        opsDashboardRepository.save(snapshot);
        log.info("Daily ops dashboard snapshot saved at {}", snapshot.getSnapshotDate());
    }
}
