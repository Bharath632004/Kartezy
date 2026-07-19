package com.kartezy.ops.repository;

import com.kartezy.ops.entity.InventoryOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryOperationRepository extends JpaRepository<InventoryOperation, Long> {
    List<InventoryOperation> findByWarehouseId(Long warehouseId);
    List<InventoryOperation> findByMerchantId(Long merchantId);
    List<InventoryOperation> findByHealthStatus(String healthStatus);
    
    @Query("SELECT i.healthStatus, COUNT(i) FROM InventoryOperation i GROUP BY i.healthStatus")
    List<Object[]> countByHealthStatus();
    
    @Query("SELECT COALESCE(SUM(i.outOfStockSkuCount), 0) FROM InventoryOperation i")
    long totalOutOfStock();
    
    @Query("SELECT COALESCE(SUM(i.lowStockSkuCount), 0) FROM InventoryOperation i")
    long totalLowStock();
}
