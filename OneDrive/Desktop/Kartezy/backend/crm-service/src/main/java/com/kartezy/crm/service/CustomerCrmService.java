package com.kartezy.crm.service;

import com.kartezy.crm.constants.CrmConstants;
import com.kartezy.crm.entity.CustomerProfile;
import com.kartezy.crm.exception.CrmException;
import com.kartezy.crm.repository.CustomerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerCrmService {

    private final CustomerProfileRepository customerRepository;
    private final LoyaltyEngineService loyaltyService;

    @Transactional
    public CustomerProfile createProfile(CustomerProfile profile) {
        if (customerRepository.findByUserId(profile.getUserId()).isPresent()) {
            throw new CrmException("Customer profile already exists for user: " + profile.getUserId());
        }
        if (profile.getReferralCode() == null) {
            profile.setReferralCode(generateReferralCode(profile.getFirstName()));
        }
        profile.setLoyaltyPoints(0);
        profile.setTotalOrders(0);
        profile.setTotalSpent(BigDecimal.ZERO);
        profile.setAvgOrderValue(BigDecimal.ZERO);
        profile.setLifetimeValue(BigDecimal.ZERO);

        return customerRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public CustomerProfile getByUserId(Long userId) {
        return customerRepository.findByUserId(userId)
            .orElseThrow(() -> new CrmException("Customer not found: " + userId));
    }

    @Transactional(readOnly = true)
    public Page<CustomerProfile> getAll(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    @Transactional
    public CustomerProfile updateProfile(Long userId, CustomerProfile updates) {
        CustomerProfile profile = getByUserId(userId);

        if (updates.getFirstName() != null) profile.setFirstName(updates.getFirstName());
        if (updates.getLastName() != null) profile.setLastName(updates.getLastName());
        if (updates.getEmail() != null) profile.setEmail(updates.getEmail());
        if (updates.getPhone() != null) profile.setPhone(updates.getPhone());
        if (updates.getCity() != null) profile.setCity(updates.getCity());
        if (updates.getState() != null) profile.setState(updates.getState());
        if (updates.getPincode() != null) profile.setPincode(updates.getPincode());
        if (updates.getDateOfBirth() != null) profile.setDateOfBirth(updates.getDateOfBirth());
        if (updates.getGender() != null) profile.setGender(updates.getGender());
        if (updates.getEmailOptIn() != profile.isEmailOptIn()) profile.setEmailOptIn(updates.isEmailOptIn());
        if (updates.getSmsOptIn() != profile.isSmsOptIn()) profile.setSmsOptIn(updates.isSmsOptIn());
        if (updates.getWhatsappOptIn() != profile.isWhatsappOptIn()) profile.setWhatsappOptIn(updates.isWhatsappOptIn());
        if (updates.getPushOptIn() != profile.isPushOptIn()) profile.setPushOptIn(updates.isPushOptIn());
        if (updates.getTags() != null) profile.setTags(updates.getTags());
        if (updates.getNotes() != null) profile.setNotes(updates.getNotes());

        return customerRepository.save(profile);
    }

    @Transactional
    public CustomerProfile recordOrder(Long userId, BigDecimal orderAmount) {
        CustomerProfile profile = getByUserId(userId);
        profile.setTotalOrders(profile.getTotalOrders() + 1);
        profile.setTotalSpent(profile.getTotalSpent().add(orderAmount));
        profile.setAvgOrderValue(profile.getTotalSpent().divide(BigDecimal.valueOf(profile.getTotalOrders()), 2, java.math.RoundingMode.HALF_UP));
        profile.setLifetimeValue(profile.getTotalSpent());
        profile.setLastOrderDate(LocalDateTime.now());

        // Award loyalty points
        loyaltyService.awardPoints(userId, orderAmount.intValue() / 10, "Order #" + profile.getTotalOrders());

        return customerRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public List<CustomerProfile> findHighValueCustomers() {
        return customerRepository.findHighValueCustomers(5);
    }

    @Transactional(readOnly = true)
    public List<CustomerProfile> findChurnedCustomers() {
        return customerRepository.findChurnedCustomers(LocalDateTime.now().minusMonths(3));
    }

    private String generateReferralCode(String name) {
        String prefix = name != null && name.length() >= 3 ? name.substring(0, 3).toUpperCase() : "USR";
        return prefix + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
