package com.kartezy.crm.controller;

import com.kartezy.crm.entity.CustomerSegment;
import com.kartezy.crm.service.SegmentationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crm/segments")
@RequiredArgsConstructor
@Tag(name = "Customer Segmentation", description = "Segment creation, evaluation, and targeting")
public class SegmentController {

    private final SegmentationService segmentationService;

    @PostMapping
    @Operation(summary = "Create a customer segment")
    public ResponseEntity<Map<String, Object>> createSegment(@RequestBody CustomerSegment segment) {
        CustomerSegment created = segmentationService.createSegment(segment);
        return ResponseEntity.ok(wrapResponse(created, "Segment created"));
    }

    @GetMapping
    @Operation(summary = "Get all segments")
    public ResponseEntity<Map<String, Object>> getAllSegments() {
        List<CustomerSegment> segments = segmentationService.getAllSegments();
        return ResponseEntity.ok(wrapResponse(segments, "Segments retrieved"));
    }

    @PostMapping("/{segmentId}/evaluate")
    @Operation(summary = "Evaluate segment members")
    public ResponseEntity<Map<String, Object>> evaluateSegment(@PathVariable Long segmentId) {
        segmentationService.evaluateSegment(segmentId);
        return ResponseEntity.ok(wrapResponse(null, "Segment evaluated"));
    }

    @GetMapping("/{segmentId}/members")
    @Operation(summary = "Get segment member IDs")
    public ResponseEntity<Map<String, Object>> getSegmentMembers(@PathVariable Long segmentId) {
        List<Long> memberIds = segmentationService.getSegmentCustomerIds(segmentId);
        return ResponseEntity.ok(wrapResponse(memberIds, "Segment members retrieved"));
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
