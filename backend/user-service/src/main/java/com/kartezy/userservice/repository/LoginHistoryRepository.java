package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for managing LoginHistory entities.
 */
@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, UUID>, JpaSpecificationExecutor<LoginHistory> {
}