package com.kartezy.finance.repository;

import com.kartezy.finance.entity.Vendor;
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
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByVendorCode(String vendorCode);

    Optional<Vendor> findByGstin(String gstin);

    Page<Vendor> findByStatus(String status, Pageable pageable);

    List<Vendor> findByCity(String city);

    @Query("SELECT v FROM Vendor v WHERE v.isActive = true AND v.isDeleted = false ORDER BY v.vendorName")
    List<Vendor> findAllActiveVendors();

    @Query("SELECT COALESCE(SUM(v.outstandingAmount), 0) FROM Vendor v WHERE v.status = 'ACTIVE'")
    BigDecimal getTotalOutstanding();

    @Query("SELECT v FROM Vendor v WHERE v.outstandingAmount > 0 ORDER BY v.outstandingAmount DESC")
    List<Vendor> findVendorsWithOutstanding();

    Page<Vendor> findByVendorNameContainingIgnoreCase(String name, Pageable pageable);
}
