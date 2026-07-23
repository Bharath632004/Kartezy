package com.kartezy.schedulerservice.repository;

import com.kartezy.schedulerservice.entity.ScheduledTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ScheduledTaskRepository extends JpaRepository<ScheduledTask, UUID> {
    List<ScheduledTask> findByActiveTrueAndNextRunAtBefore(LocalDateTime now);
    List<ScheduledTask> findByStatusOrderByNextRunAtAsc(String status);
    List<ScheduledTask> findByTaskTypeAndActiveTrue(String taskType);
}
