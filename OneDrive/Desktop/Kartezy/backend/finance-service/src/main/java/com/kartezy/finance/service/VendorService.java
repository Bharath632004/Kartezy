package com.kartezy.finance.service;

import com.kartezy.finance.constants.AuditAction;
import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.entity.Vendor;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.VendorRepository;
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
public class VendorService {

    private final VendorRepository vendorRepository;
    private final AuditService auditService;

    @Transactional
    public Vendor createVendor(Vendor vendor) {
        String vendorCode = "VND-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
            + "-" + System.currentTimeMillis() % 10000;
        vendor.setVendorCode(vendorCode);
        vendor.setStatus("ACTIVE");
        vendor.setOutstandingAmount(java.math.BigDecimal.ZERO);

        Vendor saved = vendorRepository.save(vendor);

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_VENDOR,
            saved.getId(), saved.getVendorCode(), "System",
            null, "Vendor created: " + saved.getVendorName());

        return saved;
    }

    @Transactional
    public Vendor updateVendor(Long id, Vendor updates) {
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new FinanceException("Vendor not found: " + id));

        if (updates.getVendorName() != null) vendor.setVendorName(updates.getVendorName());
        if (updates.getEmail() != null) vendor.setEmail(updates.getEmail());
        if (updates.getPhone() != null) vendor.setPhone(updates.getPhone());
        if (updates.getAddressLine1() != null) vendor.setAddressLine1(updates.getAddressLine1());
        if (updates.getCity() != null) vendor.setCity(updates.getCity());
        if (updates.getState() != null) vendor.setState(updates.getState());
        if (updates.getPincode() != null) vendor.setPincode(updates.getPincode());
        if (updates.getPaymentTerms() != null) vendor.setPaymentTerms(updates.getPaymentTerms());
        if (updates.getCreditDays() != null) vendor.setCreditDays(updates.getCreditDays());
        if (updates.getCreditLimit() != null) vendor.setCreditLimit(updates.getCreditLimit());
        if (updates.getStatus() != null) vendor.setStatus(updates.getStatus());
        if (updates.getCategory() != null) vendor.setCategory(updates.getCategory());
        if (updates.getNotes() != null) vendor.setNotes(updates.getNotes());

        return vendorRepository.save(vendor);
    }

    @Transactional(readOnly = true)
    public Page<Vendor> getVendors(String status, String search, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return vendorRepository.findByVendorNameContainingIgnoreCase(search, pageable);
        }
        if (status != null) {
            return vendorRepository.findByStatus(status, pageable);
        }
        return vendorRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Vendor getVendor(Long id) {
        return vendorRepository.findById(id)
            .orElseThrow(() -> new FinanceException("Vendor not found: " + id));
    }

    @Transactional
    public void deleteVendor(Long id) {
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new FinanceException("Vendor not found: " + id));
        vendor.setIsDeleted(true);
        vendor.setStatus("INACTIVE");
        vendorRepository.save(vendor);

        auditService.log(AuditAction.DELETE, FinanceConstants.ENTITY_VENDOR,
            id, vendor.getVendorCode(), "System", null, "Vendor deleted");
    }
}
