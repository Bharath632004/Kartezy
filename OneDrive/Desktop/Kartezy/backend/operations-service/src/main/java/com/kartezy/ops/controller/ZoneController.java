package com.kartezy.ops.controller;

import com.kartezy.ops.entity.Zone;
import com.kartezy.ops.service.ZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ops/zones")
@RequiredArgsConstructor
public class ZoneController {

    private final ZoneService zoneService;

    @GetMapping
    public ResponseEntity<List<Zone>> getAllZones() {
        return ResponseEntity.ok(zoneService.getAllZones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Zone> getZoneById(@PathVariable Long id) {
        return ResponseEntity.ok(zoneService.getZoneById(id));
    }

    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<Zone>> getZonesByCity(@PathVariable Long cityId) {
        return ResponseEntity.ok(zoneService.getZonesByCity(cityId));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Zone>> getZonesByType(@PathVariable String type) {
        return ResponseEntity.ok(zoneService.getZonesByType(type));
    }

    @PostMapping
    public ResponseEntity<Zone> createZone(@RequestBody Zone zone) {
        return ResponseEntity.ok(zoneService.createZone(zone));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Zone> updateZone(@PathVariable Long id, @RequestBody Zone zone) {
        return ResponseEntity.ok(zoneService.updateZone(id, zone));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteZone(@PathVariable Long id) {
        zoneService.deleteZone(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats/by-type")
    public ResponseEntity<List<Object[]>> getZoneStatsByType() {
        return ResponseEntity.ok(zoneService.getZoneCountByType());
    }

    @GetMapping("/stats/by-city")
    public ResponseEntity<List<Object[]>> getZoneStatsByCity() {
        return ResponseEntity.ok(zoneService.getZoneCountByCity());
    }
}
