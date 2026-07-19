package com.kartezy.finance.repository;

import com.kartezy.finance.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Optional<Supplier> findBySupplierCode(String supplierCode);

    Optional<Supplier> findByGstin(String gstin);

    Page<Supplier> findByStatus(String status, Pageable pageable);

    List<Supplier> findByIsPreferredTrue();

    @Query("SELECT s FROM Supplier s WHERE s.isActive = true AND s.isDeleted = false ORDER BY s.supplierName")
    List<Supplier> findAllActiveSuppliers();

    @Query("SELECT COALESCE(SUM(s.outstandingAmount), 0) FROM Supplier s WHERE s.status = 'ACTIVE'")
    BigDecimal getTotalOutstanding();

    @Query("SELECT s FROM Supplier s WHERE s.contractEndDate <= CURRENT_DATE AND s.contractEndDate IS NOT NULL")
    List<Supplier> findExpiringContracts();

    @Query("SELECT s FROM Supplier s WHERE s.supplyCategories LIKE %:category%")
    List<Supplier> findBySupplyCategory(@Param("category") String category);
}
