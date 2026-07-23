package com.kartezy.adminservice.repository;

import com.kartezy.adminservice.entity.AdminAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AdminActionRepository extends JpaRepository<AdminAction, UUID> {
    List<AdminAction> findTop50ByOrderByCreatedAtDesc();
    List<AdminAction> findByAdminIdOrderByCreatedAtDesc(UUID adminId);
    List<AdminAction> findByActionTypeOrderByCreatedAtDesc(String actionType);
}
