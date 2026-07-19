package com.kartezy.finance.service;

import com.kartezy.finance.constants.AuditAction;
import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.entity.Supplier;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final AuditService auditService;

    @Transactional
    public Supplier createSupplier(Supplier supplier) {
        String supplierCode = "SUP-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
            + "-" + System.currentTimeMillis() % 10000;
        supplier.setSupplierCode(supplierCode);
        supplier.setStatus("ACTIVE");
        supplier.setOutstandingAmount(java.math.BigDecimal.ZERO);

        Supplier saved = supplierRepository.save(supplier);

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_SUPPLIER,
            saved.getId(), saved.getSupplierCode(), "System",
            null, "Supplier created: " + saved.getSupplierName());

        return saved;
    }

    @Transactional
    public Supplier updateSupplier(Long id, Supplier updates) {
        Supplier supplier = supplierRepository.findById(id)
            .orElseThrow(() -> new FinanceException("Supplier not found: " + id));

        if (updates.getSupplierName() != null) supplier.setSupplierName(updates.getSupplierName());
        if (updates.getEmail() != null) supplier.setEmail(updates.getEmail());
        if (updates.getPhone() != null) supplier.setPhone(updates.getPhone());
        if (updates.getPaymentTerms() != null) supplier.setPaymentTerms(updates.getPaymentTerms());
        if (updates.getCreditDays() != null) supplier.setCreditDays(updates.getCreditDays());
        if (updates.getCreditLimit() != null) supplier.setCreditLimit(updates.getCreditLimit());
        if (updates.getStatus() != null) supplier.setStatus(updates.getStatus());
        if (updates.getIsPreferred() != null) supplier.setIsPreferred(updates.getIsPreferred());
        if (updates.getNotes() != null) supplier.setNotes(updates.getNotes());

        return supplierRepository.save(supplier);
    }

    @Transactional(readOnly = true)
    public Page<Supplier> getSuppliers(String status, Pageable pageable) {
        if (status != null) {
            return supplierRepository.findByStatus(status, pageable);
        }
        return supplierRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Supplier getSupplier(Long id) {
        return supplierRepository.findById(id)
            .orElseThrow(() -> new FinanceException("Supplier not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Supplier> getPreferredSuppliers() {
        return supplierRepository.findByIsPreferredTrue();
    }

    @Transactional(readOnly = true)
    public List<Supplier> getExpiringContracts() {
        return supplierRepository.findExpiringContracts();
    }
}
