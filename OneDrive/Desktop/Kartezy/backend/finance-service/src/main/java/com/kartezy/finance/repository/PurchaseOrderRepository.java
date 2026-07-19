package com.kartezy.finance.repository;

import com.kartezy.finance.entity.PurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    Optional<PurchaseOrder> findByPoNumber(String poNumber);

    Page<PurchaseOrder> findByVendorIdOrderByOrderDateDesc(Long vendorId, Pageable pageable);

    Page<PurchaseOrder> findByStatus(String status, Pageable pageable);

    List<PurchaseOrder> findByExpectedDeliveryDateBeforeAndStatus(LocalDate date, String status);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.status IN ('PENDING_APPROVAL', 'APPROVED') AND po.expectedDeliveryDate <= :date")
    List<PurchaseOrder> findOverdueOrders(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(po.totalAmount), 0) FROM PurchaseOrder po WHERE po.status NOT IN ('CANCELLED', 'DRAFT')")
    BigDecimal getTotalOrderValue();

    @Query("SELECT COALESCE(SUM(po.balanceAmount), 0) FROM PurchaseOrder po WHERE po.status = 'PARTIALLY_RECEIVED'")
    BigDecimal getTotalOutstandingValue();

    long countByStatus(String status);
}
