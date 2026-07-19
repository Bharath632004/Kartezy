package com.kartezy.ops.controller;

import com.kartezy.ops.entity.SlaRecord;
import com.kartezy.ops.service.SLAService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/sla")
@RequiredArgsConstructor
public class SLAController {

    private final SLAService slaService;

    @GetMapping
    public ResponseEntity<List<SlaRecord>> getAllSlaRecords() {
        return ResponseEntity.ok(slaService.getAllSlaRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SlaRecord> getSlaRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(slaService.getSlaRecordById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<SlaRecord>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(slaService.getSlaByType(type));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SlaRecord>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(slaService.getSlaByStatus(status));
    }

    @PostMapping
    public ResponseEntity<SlaRecord> createSlaRecord(@RequestBody SlaRecord sla) {
        return ResponseEntity.ok(slaService.createSlaRecord(sla));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<SlaRecord> completeSla(@PathVariable Long id) {
        return ResponseEntity.ok(slaService.completeSla(id));
    }

    @PostMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAllSla() {
        int breachedCount = slaService.checkAndUpdateSlaStatus();
        return ResponseEntity.ok(Map.of(
            "checked", true,
            "breachedCount", breachedCount,
            "totalBreaches", slaService.getSlaBreachCount()
        ));
    }

    @GetMapping("/stats/status")
    public ResponseEntity<List<Object[]>> getStatusStats() {
        return ResponseEntity.ok(slaService.getSlaCountByStatus());
    }

    @GetMapping("/stats/breached-by-type")
    public ResponseEntity<List<Object[]>> getBreachedByType() {
        return ResponseEntity.ok(slaService.getBreachedByType());
    }
}
