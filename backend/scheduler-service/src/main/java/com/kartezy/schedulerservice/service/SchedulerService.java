package com.kartezy.schedulerservice.service;

import com.kartezy.schedulerservice.dto.ScheduledTaskDto;
import com.kartezy.schedulerservice.entity.ScheduledTask;
import com.kartezy.schedulerservice.repository.ScheduledTaskRepository;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchedulerService {

    private final ScheduledTaskRepository taskRepository;

    @Transactional
    public ScheduledTaskDto createTask(ScheduledTaskDto request) {
        ScheduledTask task = ScheduledTask.builder()
            .taskName(request.getTaskName()).taskType(request.getTaskType())
            .status("PENDING").cronExpression(request.getCronExpression())
            .taskConfig(request.getTaskConfig())
            .nextRunAt(request.getNextRunAt() != null ? request.getNextRunAt() : LocalDateTime.now())
            .maxRetries(request.getMaxRetries() > 0 ? request.getMaxRetries() : 3)
            .active(true).build();
        task = taskRepository.save(task);
        log.info("Scheduled task created: {} type={}", task.getTaskName(), task.getTaskType());
        return toDto(task);
    }

    public List<ScheduledTaskDto> getPendingTasks() {
        return taskRepository.findByStatusOrderByNextRunAtAsc("PENDING")
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ScheduledTaskDto> getDueTasks() {
        return taskRepository.findByActiveTrueAndNextRunAtBefore(LocalDateTime.now())
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ScheduledTaskDto updateTaskStatus(UUID id, String status, String error) {
        ScheduledTask task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
        task.setStatus(status);
        task.setLastRunAt(LocalDateTime.now());
        if ("SUCCESS".equals(status)) {
            task.setLastSuccessAt(LocalDateTime.now());
            task.setRetryCount(0);
        } else if (error != null) {
            task.setLastError(error);
            task.setRetryCount(task.getRetryCount() + 1);
        }
        taskRepository.save(task);
        return toDto(task);
    }

    private ScheduledTaskDto toDto(ScheduledTask task) {
        return ScheduledTaskDto.builder()
            .id(task.getId()).taskName(task.getTaskName()).taskType(task.getTaskType())
            .status(task.getStatus()).cronExpression(task.getCronExpression())
            .taskConfig(task.getTaskConfig()).nextRunAt(task.getNextRunAt())
            .retryCount(task.getRetryCount()).maxRetries(task.getMaxRetries())
            .lastRunAt(task.getLastRunAt()).lastSuccessAt(task.getLastSuccessAt())
            .lastError(task.getLastError()).active(task.isActive())
            .createdAt(task.getCreatedAt()).build();
    }
}
