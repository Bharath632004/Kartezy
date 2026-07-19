package com.kartezy.ops.service;

import com.kartezy.ops.entity.City;
import com.kartezy.ops.entity.Zone;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final CityService cityService;

    @Cacheable(value = OpsConstants.CACHE_ZONES)
    public List<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    @Cacheable(value = OpsConstants.CACHE_ZONES, key = "#id")
    public Zone getZoneById(Long id) {
        return zoneRepository.findById(id)
            .orElseThrow(() -> new OpsException("Zone not found with id: " + id, "ZONE_NOT_FOUND"));
    }

    public List<Zone> getZonesByCity(Long cityId) {
        return zoneRepository.findByCityId(cityId);
    }

    public List<Zone> getActiveZonesByCity(Long cityId) {
        return zoneRepository.findByCityIdAndIsActiveTrue(cityId);
    }

    public List<Zone> getZonesByType(String type) {
        return zoneRepository.findByZoneType(type);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_ZONES, allEntries = true)
    public Zone createZone(Zone zone) {
        City city = cityService.getCityById(zone.getCity().getId());
        zone.setCity(city);
        return zoneRepository.save(zone);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_ZONES, allEntries = true)
    public Zone updateZone(Long id, Zone updated) {
        Zone zone = getZoneById(id);
        zone.setName(updated.getName());
        zone.setZoneType(updated.getZoneType());
        zone.setBoundaryGeoJson(updated.getBoundaryGeoJson());
        zone.setEstimatedPopulation(updated.getEstimatedPopulation());
        zone.setCoverageRadiusKm(updated.getCoverageRadiusKm());
        zone.setCenterLatitude(updated.getCenterLatitude());
        zone.setCenterLongitude(updated.getCenterLongitude());
        return zoneRepository.save(zone);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_ZONES, allEntries = true)
    public void deleteZone(Long id) {
        Zone zone = getZoneById(id);
        zone.setIsActive(false);
        zoneRepository.save(zone);
    }

    public List<Object[]> getZoneCountByType() {
        return zoneRepository.countByType();
    }

    public List<Object[]> getZoneCountByCity() {
        return zoneRepository.countByCity();
    }
}
