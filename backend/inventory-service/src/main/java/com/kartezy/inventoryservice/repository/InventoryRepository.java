package com.kartezy.inventoryservice.repository;
import com.kartezy.inventoryservice.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
}