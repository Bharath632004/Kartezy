package com.kartezy.inventoryservice.repository;

import com.kartezy.inventoryservice.entity.StockAudit;
import com.kartezy.inventoryservice.entity.StockAudit.AuditStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface StockAuditRepository extends JpaRepository<StockAudit, UUID> {
    List<StockAudit> findByStatus(AuditStatus status);
    List<StockAudit> findBySku(String sku);
}
