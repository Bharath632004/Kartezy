package com.kartezy.inventoryservice.repository;

import com.kartezy.inventoryservice.entity.StockTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface StockTransferRepository extends JpaRepository<StockTransfer, UUID> {
    List<StockTransfer> findByFromWarehouseId(UUID warehouseId);
    List<StockTransfer> findByToWarehouseId(UUID warehouseId);
    List<StockTransfer> findByStatus(StockTransfer.TransferStatus status);
}
