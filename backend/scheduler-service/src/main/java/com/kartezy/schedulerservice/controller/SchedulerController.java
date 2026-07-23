package com.kartezy.schedulerservice.controller;

import com.kartezy.schedulerservice.dto.ScheduledTaskDto;
import com.kartezy.schedulerservice.service.SchedulerService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/scheduler")
@RequiredArgsConstructor
public class SchedulerController {

    private final SchedulerService schedulerService;

    @PostMapping("/tasks")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScheduledTaskDto>> createTask(@RequestBody ScheduledTaskDto request) {
        ScheduledTaskDto task = schedulerService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(task, "Task created"));
    }

    @GetMapping("/tasks/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ScheduledTaskDto>>> getPendingTasks() {
        return ResponseEntity.ok(ApiResponse.success(schedulerService.getPendingTasks()));
    }

    @GetMapping("/tasks/due")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ScheduledTaskDto>>> getDueTasks() {
        return ResponseEntity.ok(ApiResponse.success(schedulerService.getDueTasks()));
    }

    @PutMapping("/tasks/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScheduledTaskDto>> updateTaskStatus(
            @PathVariable UUID id,
            @RequestParam String status,
            @RequestParam(required = false) String error) {
        ScheduledTaskDto task = schedulerService.updateTaskStatus(id, status, error);
        return ResponseEntity.ok(ApiResponse.success(task, "Task status updated"));
    }
}
