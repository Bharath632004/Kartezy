package com.kartezy.finance.controller;

import com.kartezy.finance.entity.GSTRecord;
import com.kartezy.finance.entity.TaxRecord;
import com.kartezy.finance.service.TaxService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/taxes")
@RequiredArgsConstructor
@Tag(name = "GST & Taxes", description = "GST, TDS, and tax management")
public class TaxController {

    private final TaxService taxService;

    @PostMapping("/gst")
    @Operation(summary = "Create GST record")
    public ResponseEntity<Map<String, Object>> createGSTRecord(@RequestBody GSTRecord record) {
        GSTRecord created = taxService.createGSTEntry(record);
        return ResponseEntity.ok(wrapResponse(created, "GST record created"));
    }

    @PostMapping("/gst/file/{returnPeriod}")
    @Operation(summary = "File GST return for a period")
    public ResponseEntity<Map<String, Object>> fileGSTReturn(@PathVariable String returnPeriod) {
        GSTRecord record = taxService.fileGSTReturn(returnPeriod);
        return ResponseEntity.ok(wrapResponse(record, "GST return filed"));
    }

    @GetMapping("/gst/summary/{returnPeriod}")
    @Operation(summary = "Get GST summary for a period")
    public ResponseEntity<Map<String, Object>> getGSTSummary(@PathVariable String returnPeriod) {
        Map<String, java.math.BigDecimal> summary = taxService.getGSTSummary(returnPeriod);
        return ResponseEntity.ok(wrapResponse(summary, "GST summary retrieved"));
    }

    @PostMapping("/tds")
    @Operation(summary = "Record TDS deduction")
    public ResponseEntity<Map<String, Object>> deductTDS(@RequestBody TaxRecord record) {
        TaxRecord saved = taxService.deductTDS(record);
        return ResponseEntity.ok(wrapResponse(saved, "TDS deducted"));
    }

    private Map<String, Object> wrapResponse(Object data, String message) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
