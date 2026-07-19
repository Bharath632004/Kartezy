package com.kartezy.crm.service;

import com.kartezy.crm.entity.MerchantProfile;
import com.kartezy.crm.exception.CrmException;
import com.kartezy.crm.repository.MerchantProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MerchantCrmService {

    private final MerchantProfileRepository merchantRepository;

    @Transactional
    public MerchantProfile createProfile(MerchantProfile profile) {
        return merchantRepository.save(profile);
    }

    @Transactional
    public MerchantProfile updateProfile(Long merchantId, MerchantProfile updates) {
        MerchantProfile profile = merchantRepository.findByMerchantId(merchantId)
            .orElseThrow(() -> new CrmException("Merchant not found: " + merchantId));

        if (updates.getBusinessName() != null) profile.setBusinessName(updates.getBusinessName());
        if (updates.getOwnerName() != null) profile.setOwnerName(updates.getOwnerName());
        if (updates.getEmail() != null) profile.setEmail(updates.getEmail());
        if (updates.getPhone() != null) profile.setPhone(updates.getPhone());
        if (updates.getBusinessCategory() != null) profile.setBusinessCategory(updates.getBusinessCategory());
        if (updates.getCity() != null) profile.setCity(updates.getCity());
        if (updates.getState() != null) profile.setState(updates.getState());
        if (updates.getStatus() != null) profile.setStatus(updates.getStatus());
        if (updates.getTier() != null) profile.setTier(updates.getTier());
        if (updates.getAccountManager() != null) profile.setAccountManager(updates.getAccountManager());
        if (updates.getNotes() != null) profile.setNotes(updates.getNotes());
        if (updates.getTags() != null) profile.setTags(updates.getTags());

        return merchantRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public MerchantProfile getByMerchantId(Long merchantId) {
        return merchantRepository.findByMerchantId(merchantId)
            .orElseThrow(() -> new CrmException("Merchant not found: " + merchantId));
    }

    @Transactional(readOnly = true)
    public Page<MerchantProfile> getAll(String status, String tier, Pageable pageable) {
        if (status != null) return merchantRepository.findByStatus(status, pageable);
        if (tier != null) return merchantRepository.findByTier(tier, pageable);
        return merchantRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<MerchantProfile> getTopRevenueMerchants(int limit) {
        return merchantRepository.findTopRevenueMerchants(Pageable.ofSize(limit));
    }

    @Transactional(readOnly = true)
    public List<MerchantProfile> getTopRatedMerchants(double minRating) {
        return merchantRepository.findTopRatedMerchants(minRating);
    }
}
