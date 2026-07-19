package com.kartezy.ops.controller;

import com.kartezy.ops.constants.OpsConstants;
import com.kartezy.ops.entity.City;
import com.kartezy.ops.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {
        return ResponseEntity.ok(cityService.getCityById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<City>> getCitiesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(cityService.getCitiesByStatus(status));
    }

    @GetMapping("/region/{region}")
    public ResponseEntity<List<City>> getCitiesByRegion(@PathVariable String region) {
        return ResponseEntity.ok(cityService.getCitiesByRegion(region));
    }

    @GetMapping("/active")
    public ResponseEntity<List<City>> getActiveCities() {
        return ResponseEntity.ok(cityService.getActiveCities());
    }

    @PostMapping
    public ResponseEntity<City> createCity(@RequestBody City city) {
        return ResponseEntity.ok(cityService.createCity(city));
    }

    @PutMapping("/{id}")
    public ResponseEntity<City> updateCity(@PathVariable Long id, @RequestBody City city) {
        return ResponseEntity.ok(cityService.updateCity(id, city));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateCityStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        cityService.updateCityStatus(id, body.get("status"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCity(@PathVariable Long id) {
        cityService.deleteCity(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats/by-region")
    public ResponseEntity<List<Object[]>> getCityStatsByRegion() {
        return ResponseEntity.ok(cityService.getCityCountByRegion());
    }

    @GetMapping("/stats/by-status")
    public ResponseEntity<List<Object[]>> getCityStatsByStatus() {
        return ResponseEntity.ok(cityService.getCityCountByStatus());
    }
}
