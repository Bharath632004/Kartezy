package com.kartezy.crm.service;

import com.kartezy.crm.constants.CrmConstants;
import com.kartezy.crm.entity.CustomerProfile;
import com.kartezy.crm.entity.LoyaltyTransaction;
import com.kartezy.crm.entity.Referral;
import com.kartezy.crm.exception.CrmException;
import com.kartezy.crm.repository.CustomerProfileRepository;
import com.kartezy.crm.repository.ReferralRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReferralEngineService {

    private final ReferralRepository referralRepository;
    private final CustomerProfileRepository customerRepository;
    private final LoyaltyEngineService loyaltyService;

    @Transactional
    public Referral createReferral(Long referrerId, String refereeEmail, String refereePhone) {
        CustomerProfile referrer = customerRepository.findByUserId(referrerId)
            .orElseThrow(() -> new CrmException("Referrer not found: " + referrerId));

        String referralCode = generateReferralCode();

        Referral referral = Referral.builder()
            .referrerId(referrerId)
            .referrerName(referrer.getFirstName() + " " + referrer.getLastName())
            .referralCode(referralCode)
            .refereeEmail(refereeEmail)
            .refereePhone(refereePhone)
            .status("PENDING")
            .referrerReward(BigDecimal.valueOf(100))
            .refereeReward(BigDecimal.valueOf(50))
            .referrerPoints(200)
            .refereePoints(100)
            .rewardType("POINTS")
            .build();

        Referral saved = referralRepository.save(referral);
        log.info("Referral created: {} -> {}", referrerId, refereeEmail);
        return saved;
    }

    @Transactional
    public Referral convertReferral(String referralCode, Long newUserId) {
        Referral referral = referralRepository.findPendingByCode(referralCode)
            .orElseThrow(() -> new CrmException("Invalid or already used referral code: " + referralCode));

        referral.setRefereeId(newUserId);
        referral.setStatus("CONVERTED");
        referral.setConversionAt(LocalDateTime.now());

        CustomerProfile referee = customerRepository.findByUserId(newUserId).orElse(null);
        if (referee != null) {
            referral.setRefereeName(referee.getFirstName() + " " + referee.getLastName());
            referral.setRefereeEmail(referee.getEmail());

            // Award referee bonus points
            loyaltyService.awardPoints(newUserId, referral.getRefereePoints(),
                "Referral signup bonus from " + referral.getReferrerName());
        }

        // Award referrer bonus points
        loyaltyService.awardPoints(referral.getReferrerId(), referral.getReferrerPoints(),
            "Referral reward for inviting " + (referee != null ? referee.getFirstName() : "a friend"));

        Referral saved = referralRepository.save(referral);

        // Update referrer's referral count
        CustomerProfile referrer = customerRepository.findByUserId(referral.getReferrerId()).orElse(null);
        if (referrer != null) {
            referrer.setReferralCount(referrer.getReferralCount() != null ? referrer.getReferralCount() + 1 : 1);
            customerRepository.save(referrer);
        }

        log.info("Referral converted: {} -> {}", referralCode, newUserId);
        return saved;
    }

    @Transactional(readOnly = true)
    public Page<Referral> getReferrerReferrals(Long referrerId, Pageable pageable) {
        return referralRepository.findByReferrerIdOrderByCreatedAtDesc(referrerId, pageable);
    }

    @Transactional(readOnly = true)
    public long getReferralCount(Long referrerId) {
        return referralRepository.countByReferrerId(referrerId);
    }

    private String generateReferralCode() {
        return "REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
