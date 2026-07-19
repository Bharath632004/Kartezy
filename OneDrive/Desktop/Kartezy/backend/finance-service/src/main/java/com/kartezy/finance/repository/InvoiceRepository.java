package com.kartezy.finance.repository;

import com.kartezy.finance.constants.InvoiceStatus;
import com.kartezy.finance.entity.Invoice;
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
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    Page<Invoice> findByMerchantIdOrderByInvoiceDateDesc(Long merchantId, Pageable pageable);

    Page<Invoice> findByVendorIdOrderByInvoiceDateDesc(Long vendorId, Pageable pageable);

    Page<Invoice> findByStatus(InvoiceStatus status, Pageable pageable);

    List<Invoice> findByDueDateBeforeAndStatus(LocalDate date, InvoiceStatus status);

    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :date AND i.status = 'SENT'")
    List<Invoice> findOverdueInvoices(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.status NOT IN ('CANCELLED', 'DRAFT')")
    BigDecimal getTotalInvoiceValue();

    @Query("SELECT COALESCE(SUM(i.balanceAmount), 0) FROM Invoice i WHERE i.status IN ('SENT', 'PARTIALLY_PAID')")
    BigDecimal getTotalOutstanding();

    @Query("SELECT COALESCE(SUM(i.paidAmount), 0) FROM Invoice i WHERE i.status = 'PAID'")
    BigDecimal getTotalCollected();

    @Query("SELECT i FROM Invoice i WHERE i.isInterstate = true AND i.status = 'SENT'")
    List<Invoice> findInterstateInvoices();

    @Query("SELECT i FROM Invoice i WHERE i.gstin IS NOT NULL AND i.status NOT IN ('CANCELLED', 'DRAFT')")
    List<Invoice> findGSTInvoices();

    long countByStatus(InvoiceStatus status);

    @Query("SELECT COALESCE(SUM(i.balanceAmount), 0) FROM Invoice i WHERE i.merchantId = :merchantId AND i.status = 'SENT'")
    BigDecimal getMerchantOutstanding(@Param("merchantId") Long merchantId);
}
