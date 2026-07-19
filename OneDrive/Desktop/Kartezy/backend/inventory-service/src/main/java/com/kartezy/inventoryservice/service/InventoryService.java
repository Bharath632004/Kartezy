package com.kartezy.inventoryservice.service;

import com.kartezy.inventoryservice.dto.*;
import com.kartezy.inventoryservice.entity.*;
import com.kartezy.inventoryservice.entity.StockAudit.AuditStatus;
import com.kartezy.inventoryservice.entity.StockTransfer.TransferStatus;
import com.kartezy.inventoryservice.repository.*;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockTransferRepository transferRepository;
    private final StockAuditRepository auditRepository;

    public InventoryEnhancedDto getItem(Long id) {
        return inventoryRepository.findById(id)
            .map(this::toEnhancedDto)
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
    }

    public List<InventoryEnhancedDto> getAllItems() {
        return inventoryRepository.findAll().stream()
            .map(this::toEnhancedDto).collect(Collectors.toList());
    }

    @Transactional
    public InventoryEnhancedDto updateStock(Long id, Integer quantity) {
        InventoryItem item = inventoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        item.setQuantity(quantity);
        item.setAvailableQuantity(quantity - item.getReservedQuantity());
        item = inventoryRepository.save(item);
        return toEnhancedDto(item);
    }

    @Transactional
    public InventoryEnhancedDto reserveStock(Long id, Integer quantity) {
        InventoryItem item = inventoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        if (item.getAvailableQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock");
        }

        item.setReservedQuantity(item.getReservedQuantity() + quantity);
        item.setAvailableQuantity(item.getQuantity() - item.getReservedQuantity());
        item = inventoryRepository.save(item);
        return toEnhancedDto(item);
    }

    @Transactional
    public InventoryEnhancedDto releaseStock(Long id, Integer quantity) {
        InventoryItem item = inventoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        int newReserved = Math.max(0, item.getReservedQuantity() - quantity);
        item.setReservedQuantity(newReserved);
        item.setAvailableQuantity(item.getQuantity() - newReserved);
        item = inventoryRepository.save(item);
        return toEnhancedDto(item);
    }

    // Warehouse operations
    public WarehouseDto createWarehouse(WarehouseDto dto) {
        Warehouse warehouse = Warehouse.builder()
            .name(dto.getName()).address(dto.getAddress())
            .city(dto.getCity()).state(dto.getState())
            .pincode(dto.getPincode()).isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
            .build();
        warehouse = warehouseRepository.save(warehouse);
        return toWarehouseDto(warehouse);
    }

    public List<WarehouseDto> getWarehouses() {
        return warehouseRepository.findByIsActiveTrue().stream()
            .map(this::toWarehouseDto).collect(Collectors.toList());
    }

    // Stock transfer
    @Transactional
    public StockTransferDto createTransfer(StockTransferDto dto) {
        StockTransfer transfer = StockTransfer.builder()
            .fromWarehouseId(dto.getFromWarehouseId())
            .toWarehouseId(dto.getToWarehouseId())
            .productId(dto.getProductId()).sku(dto.getSku())
            .quantity(dto.getQuantity()).reason(dto.getReason())
            .status(TransferStatus.PENDING).initiatedBy(dto.getInitiatedBy())
            .build();
        transfer = transferRepository.save(transfer);
        return toTransferDto(transfer);
    }

    @Transactional
    public StockTransferDto approveTransfer(UUID transferId, String approvedBy) {
        StockTransfer transfer = transferRepository.findById(transferId)
            .orElseThrow(() -> new ResourceNotFoundException("Transfer not found"));
        transfer.setStatus(TransferStatus.APPROVED);
        transfer.setApprovedBy(approvedBy);
        transfer.setApprovedAt(LocalDateTime.now());
        transfer = transferRepository.save(transfer);
        return toTransferDto(transfer);
    }

    @Transactional
    public StockTransferDto completeTransfer(UUID transferId) {
        StockTransfer transfer = transferRepository.findById(transferId)
            .orElseThrow(() -> new ResourceNotFoundException("Transfer not found"));
        transfer.setStatus(TransferStatus.COMPLETED);
        transfer.setCompletedAt(LocalDateTime.now());
        transfer = transferRepository.save(transfer);
        return toTransferDto(transfer);
    }

    // Stock audit
    @Transactional
    public StockAuditDto createAudit(StockAuditDto dto) {
        int variance = dto.getPhysicalQuantity() - dto.getSystemQuantity();
        StockAudit audit = StockAudit.builder()
            .sku(dto.getSku()).productName(dto.getProductName())
            .systemQuantity(dto.getSystemQuantity())
            .physicalQuantity(dto.getPhysicalQuantity())
            .variance(variance).notes(dto.getNotes())
            .auditedBy(dto.getAuditedBy())
            .status(variance != 0 ? AuditStatus.DISCREPANCY_FOUND : AuditStatus.VERIFIED)
            .build();
        audit = auditRepository.save(audit);
        return toAuditDto(audit);
    }

    public List<StockTransferDto> getTransfers() {
        return transferRepository.findAll().stream()
            .map(this::toTransferDto).collect(Collectors.toList());
    }

    public List<StockAuditDto> getAudits() {
        return auditRepository.findAll().stream()
            .map(this::toAuditDto).collect(Collectors.toList());
    }

    public List<InventoryAlertDto> getAlerts(String type) {
        List<InventoryItem> items = inventoryRepository.findAll();
        List<InventoryAlertDto> alerts = new ArrayList<>();

        for (InventoryItem item : items) {
            if (item.getLowStockAlertEnabled() && item.getAvailableQuantity() < item.getLowStockThreshold()) {
                alerts.add(InventoryAlertDto.builder()
                    .sku(item.getSku()).productName(item.getProductName())
                    .currentStock(item.getAvailableQuantity())
                    .threshold(item.getLowStockThreshold())
                    .alertType("LOW_STOCK")
                    .severity(item.getAvailableQuantity() == 0 ? "CRITICAL" : "WARNING")
                    .build());
            }
        }
        return alerts;
    }

    private InventoryEnhancedDto toEnhancedDto(InventoryItem i) {
        return InventoryEnhancedDto.builder()
            .id(i.getId()).sku(i.getSku()).productName(i.getProductName())
            .quantity(i.getQuantity()).reservedQuantity(i.getReservedQuantity())
            .availableQuantity(i.getAvailableQuantity()).location(i.getLocation())
            .lowStockAlertEnabled(i.getLowStockAlertEnabled())
            .lowStockThreshold(i.getLowStockThreshold()).build();
    }

    private WarehouseDto toWarehouseDto(Warehouse w) {
        return WarehouseDto.builder().id(w.getId()).name(w.getName())
            .address(w.getAddress()).city(w.getCity()).state(w.getState())
            .pincode(w.getPincode()).isActive(w.getIsActive()).build();
    }

    private StockTransferDto toTransferDto(StockTransfer t) {
        return StockTransferDto.builder()
            .id(t.getId()).fromWarehouseId(t.getFromWarehouseId())
            .toWarehouseId(t.getToWarehouseId()).productId(t.getProductId())
            .sku(t.getSku()).quantity(t.getQuantity()).reason(t.getReason())
            .status(t.getStatus().name()).initiatedBy(t.getInitiatedBy())
            .approvedBy(t.getApprovedBy()).createdAt(t.getCreatedAt())
            .completedAt(t.getCompletedAt()).build();
    }

    private StockAuditDto toAuditDto(StockAudit a) {
        return StockAuditDto.builder()
            .id(a.getId()).sku(a.getSku()).productName(a.getProductName())
            .systemQuantity(a.getSystemQuantity()).physicalQuantity(a.getPhysicalQuantity())
            .variance(a.getVariance()).notes(a.getNotes())
            .status(a.getStatus().name()).auditedBy(a.getAuditedBy())
            .auditDate(a.getAuditDate()).build();
    }
}
