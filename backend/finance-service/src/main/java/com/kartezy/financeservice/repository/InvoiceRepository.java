package com.kartezy.financeservice.repository;

import com.kartezy.financeservice.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByMerchantIdOrderByCreatedAtDesc(UUID merchantId);
    List<Invoice> findByOrderId(UUID orderId);
    List<Invoice> findByStatusOrderByCreatedAtDesc(String status);
}
