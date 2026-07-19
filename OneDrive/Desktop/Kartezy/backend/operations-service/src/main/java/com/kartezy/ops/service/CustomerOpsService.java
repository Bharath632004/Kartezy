package com.kartezy.ops.service;

import com.kartezy.ops.entity.CustomerOperation;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.CustomerOperationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerOpsService {

    private final CustomerOperationRepository customerOperationRepository;

    public CustomerOperation getCustomerOperation(Long customerId) {
        return customerOperationRepository.findByCustomerId(customerId)
            .orElseThrow(() -> new OpsException("Customer ops not found: " + customerId, "CO_NOT_FOUND"));
    }

    public List<CustomerOperation> getCustomersByKycStatus(String status) {
        return customerOperationRepository.findByKycStatus(status);
    }

    public List<CustomerOperation> getBlacklistedCustomers() {
        return customerOperationRepository.findByIsBlacklistedTrue();
    }

    @Transactional
    public CustomerOperation createCustomerOperation(CustomerOperation co) {
        return customerOperationRepository.save(co);
    }

    @Transactional
    public CustomerOperation updateKycStatus(Long customerId, String status) {
        CustomerOperation co = getCustomerOperation(customerId);
        co.setKycStatus(status);
        if ("VERIFIED".equals(status)) {
            co.setKycVerifiedAt(java.time.LocalDateTime.now());
        }
        return customerOperationRepository.save(co);
    }

    @Transactional
    public CustomerOperation blacklistCustomer(Long customerId, String reason) {
        CustomerOperation co = getCustomerOperation(customerId);
        co.setIsBlacklisted(true);
        co.setBlacklistReason(reason);
        return customerOperationRepository.save(co);
    }

    @Transactional
    public CustomerOperation unblacklistCustomer(Long customerId) {
        CustomerOperation co = getCustomerOperation(customerId);
        co.setIsBlacklisted(false);
        co.setBlacklistReason(null);
        return customerOperationRepository.save(co);
    }

    public List<Object[]> getKycStatusCounts() {
        return customerOperationRepository.countByKycStatus();
    }
}
