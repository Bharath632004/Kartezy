package com.kartezy.ops.repository;

import com.kartezy.ops.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Optional<Warehouse> findByWarehouseCode(String code);
    List<Warehouse> findByCityId(Long cityId);
    List<Warehouse> findByStatus(String status);
    List<Warehouse> findByIsActiveTrue();
    
    @Query("SELECT w.status, COUNT(w) FROM Warehouse w GROUP BY w.status")
    List<Object[]> countByStatus();
    
    @Query("SELECT w.city.name, COUNT(w) FROM Warehouse w GROUP BY w.city.name")
    List<Object[]> countByCity();
}
