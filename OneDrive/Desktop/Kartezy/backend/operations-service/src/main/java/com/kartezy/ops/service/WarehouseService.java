package com.kartezy.ops.service;

import com.kartezy.ops.entity.City;
import com.kartezy.ops.entity.Warehouse;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final CityService cityService;

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public Warehouse getWarehouseById(Long id) {
        return warehouseRepository.findById(id)
            .orElseThrow(() -> new OpsException("Warehouse not found with id: " + id, "WH_NOT_FOUND"));
    }

    public Warehouse getWarehouseByCode(String code) {
        return warehouseRepository.findByWarehouseCode(code)
            .orElseThrow(() -> new OpsException("Warehouse not found: " + code, "WH_NOT_FOUND"));
    }

    public List<Warehouse> getWarehousesByCity(Long cityId) {
        return warehouseRepository.findByCityId(cityId);
    }

    public List<Warehouse> getActiveWarehouses() {
        return warehouseRepository.findByIsActiveTrue();
    }

    @Transactional
    public Warehouse createWarehouse(Warehouse warehouse) {
        if (warehouseRepository.findByWarehouseCode(warehouse.getWarehouseCode()).isPresent()) {
            throw new OpsException("Warehouse code already exists: " + warehouse.getWarehouseCode(), "WH_EXISTS");
        }
        City city = cityService.getCityById(warehouse.getCity().getId());
        warehouse.setCity(city);
        return warehouseRepository.save(warehouse);
    }

    @Transactional
    public Warehouse updateWarehouse(Long id, Warehouse updated) {
        Warehouse wh = getWarehouseById(id);
        wh.setName(updated.getName());
        wh.setAddress(updated.getAddress());
        wh.setStatus(updated.getStatus());
        wh.setCapacitySqFt(updated.getCapacitySqFt());
        wh.setUsedSqFt(updated.getUsedSqFt());
        wh.setTotalBays(updated.getTotalBays());
        wh.setOccupiedBays(updated.getOccupiedBays());
        wh.setStaffCount(updated.getStaffCount());
        wh.setOperatingHours(updated.getOperatingHours());
        wh.setLatitude(updated.getLatitude());
        wh.setLongitude(updated.getLongitude());
        return warehouseRepository.save(wh);
    }

    @Transactional
    public void updateWarehouseUtilization(Long id, int usedSqFt, int occupiedBays) {
        Warehouse wh = getWarehouseById(id);
        wh.setUsedSqFt(usedSqFt);
        wh.setOccupiedBays(occupiedBays);
        warehouseRepository.save(wh);
    }

    public List<Object[]> getWarehouseCountByStatus() {
        return warehouseRepository.countByStatus();
    }

    public List<Object[]> getWarehouseCountByCity() {
        return warehouseRepository.countByCity();
    }
}
