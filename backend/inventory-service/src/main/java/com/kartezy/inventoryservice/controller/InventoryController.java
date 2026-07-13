package com.kartezy.inventoryservice.controller;

import com.kartezy.inventoryservice.dto.InventoryDto;
import com.kartezy.inventoryservice.entity.InventoryItem;
import com.kartezy.inventoryservice.repository.InventoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
@AllArgsConstructor
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    @GetMapping
    public ResponseEntity<List<InventoryDto>> getList(@RequestParam java.util.Map<String, String> params) {
        List<InventoryItem> items = inventoryRepository.findAll();
        List<InventoryDto> dtos = items.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryDto> getDetail(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<InventoryDto> updateStock(@PathVariable Long id, @RequestBody java.util.Map<String, Object> body) {
        Integer quantity = (Integer) body.get("quantity");
        if (quantity == null) {
            return ResponseEntity.badRequest().build();
        }
        return inventoryRepository.findById(id)
                .map(item -> {
                    item.setQuantity(quantity);
                    item.setAvailableQuantity(quantity - item.getReservedQuantity());
                    inventoryRepository.save(item);
                    return ResponseEntity.ok(toDto(item));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<InventoryDto>> getAlerts(@RequestParam java.util.Map<String, String> params) {
        // For simplicity, return items where availableQuantity < lowStockThreshold and alert enabled
        List<InventoryItem> items = inventoryRepository.findAll();
        List<InventoryDto> lowStock = items.stream()
                .filter(item -> Boolean.TRUE.equals(item.getLowStockAlertEnabled())
                        && item.getAvailableQuantity() < item.getLowStockThreshold())
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lowStock);
    }

    private InventoryDto toDto(InventoryItem entity) {
        return InventoryDto.builder()
                .id(entity.getId())
                .sku(entity.getSku())
                .productName(entity.getProductName())
                .quantity(entity.getQuantity())
                .reservedQuantity(entity.getReservedQuantity())
                .availableQuantity(entity.getAvailableQuantity())
                .location(entity.getLocation())
                .lowStockAlertEnabled(entity.getLowStockAlertEnabled())
                .lowStockThreshold(entity.getLowStockThreshold())
                .build();
    }
}