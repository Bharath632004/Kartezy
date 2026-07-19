package com.kartezy.finance.service;

import com.kartezy.finance.entity.Vendor;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.VendorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VendorServiceTest {

    @Mock private VendorRepository vendorRepository;
    @Mock private AuditService auditService;

    private VendorService vendorService;

    @BeforeEach
    void setUp() {
        vendorService = new VendorService(vendorRepository, auditService);
    }

    @Test
    @DisplayName("Should create vendor with generated code")
    void createVendor_ShouldGenerateCode() {
        Vendor vendor = Vendor.builder().vendorName("Test Vendor").build();
        when(vendorRepository.save(any(Vendor.class)))
            .thenAnswer(inv -> { Vendor v = inv.getArgument(0); v.setId(1L); return v; });

        Vendor result = vendorService.createVendor(vendor);
        assertNotNull(result.getVendorCode());
        assertTrue(result.getVendorCode().startsWith("VND-"));
        assertEquals("ACTIVE", result.getStatus());
    }

    @Test
    @DisplayName("Should update vendor fields")
    void updateVendor_ShouldUpdateProvidedFields() {
        Vendor existing = Vendor.builder().id(1L).vendorName("Old Name")
            .email("old@test.com").phone("123").build();
        Vendor updates = Vendor.builder().vendorName("New Name").email("new@test.com").build();

        when(vendorRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(vendorRepository.save(any(Vendor.class))).thenAnswer(inv -> inv.getArgument(0));

        Vendor result = vendorService.updateVendor(1L, updates);
        assertEquals("New Name", result.getVendorName());
        assertEquals("new@test.com", result.getEmail());
        assertEquals("123", result.getPhone()); // Should remain unchanged
    }

    @Test
    @DisplayName("Should throw when vendor not found")
    void updateVendor_ShouldThrow_WhenNotFound() {
        when(vendorRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(FinanceException.class, () -> vendorService.updateVendor(999L, Vendor.builder().build()));
    }

    @Test
    @DisplayName("Should get vendors with pagination")
    void getVendors_ShouldReturnPage() {
        PageRequest pageable = PageRequest.of(0, 20);
        when(vendorRepository.findAll(pageable))
            .thenReturn(new PageImpl<>(List.of(Vendor.builder().vendorName("Test").build())));

        Page<Vendor> result = vendorService.getVendors(null, null, pageable);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    @DisplayName("Should soft delete vendor")
    void deleteVendor_ShouldSoftDelete() {
        Vendor vendor = Vendor.builder().id(1L).vendorCode("VND-001").build();
        when(vendorRepository.findById(1L)).thenReturn(Optional.of(vendor));
        when(vendorRepository.save(any(Vendor.class))).thenReturn(vendor);

        vendorService.deleteVendor(1L);
        assertTrue(vendor.getIsDeleted());
        assertEquals("INACTIVE", vendor.getStatus());
    }
}
