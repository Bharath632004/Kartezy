package com.kartezy.finance.controller;

import com.kartezy.finance.entity.FinancialReport;
import com.kartezy.finance.entity.RevenueRecord;
import com.kartezy.finance.service.RevenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/revenue")
@RequiredArgsConstructor
@Tag(name = "Revenue & P&L", description = "Revenue tracking, Profit & Loss, Balance Sheet, Cash Flow")
public class RevenueController {

    private final RevenueService revenueService;

    @PostMapping("/records")
    @Operation(summary = "Record revenue")
    public ResponseEntity<Map<String, Object>> recordRevenue(@RequestBody RevenueRecord record) {
        RevenueRecord saved = revenueService.recordRevenue(record);
        return ResponseEntity.ok(wrapResponse(saved, "Revenue recorded"));
    }

    @GetMapping("/records")
    @Operation(summary = "Get revenue records within date range")
    public ResponseEntity<Map<String, Object>> getRevenues(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        Pageable pageable) {
        Page<RevenueRecord> records = revenueService.getRevenues(from, to, pageable);
        return ResponseEntity.ok(wrapResponse(records, "Revenue records retrieved"));
    }

    @GetMapping("/breakdown")
    @Operation(summary = "Get revenue breakdown by type")
    public ResponseEntity<Map<String, Object>> getRevenueBreakdown(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        Map<String, Object> breakdown = revenueService.getRevenueBreakdown(from, to);
        return ResponseEntity.ok(wrapResponse(breakdown, "Revenue breakdown retrieved"));
    }

    @PostMapping("/reports/profit-loss")
    @Operation(summary = "Generate Profit & Loss statement")
    public ResponseEntity<Map<String, Object>> generateProfitLoss(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @RequestParam(required = false) Long entityId) {
        FinancialReport report = revenueService.generateProfitAndLoss(from, to, entityId);
        return ResponseEntity.ok(wrapResponse(report, "P&L generated"));
    }

    @PostMapping("/reports/balance-sheet")
    @Operation(summary = "Generate Balance Sheet")
    public ResponseEntity<Map<String, Object>> generateBalanceSheet(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate asOf) {
        FinancialReport report = revenueService.generateBalanceSheet(asOf);
        return ResponseEntity.ok(wrapResponse(report, "Balance sheet generated"));
    }

    @PostMapping("/reports/cash-flow")
    @Operation(summary = "Generate Cash Flow statement")
    public ResponseEntity<Map<String, Object>> generateCashFlow(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        FinancialReport report = revenueService.generateCashFlowStatement(from, to);
        return ResponseEntity.ok(wrapResponse(report, "Cash flow statement generated"));
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
