package com.kartezy.crm.service;

import com.kartezy.crm.constants.CrmConstants;
import com.kartezy.crm.entity.CustomerProfile;
import com.kartezy.crm.entity.LoyaltyProgram;
import com.kartezy.crm.entity.LoyaltyTransaction;
import com.kartezy.crm.exception.CrmException;
import com.kartezy.crm.repository.CustomerProfileRepository;
import com.kartezy.crm.repository.LoyaltyProgramRepository;
import com.kartezy.crm.repository.LoyaltyTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoyaltyEngineService {

    private final LoyaltyProgramRepository programRepository;
    private final LoyaltyTransactionRepository transactionRepository;
    private final CustomerProfileRepository customerRepository;

    @Transactional
    public LoyaltyProgram createProgram(LoyaltyProgram program) {
        return programRepository.save(program);
    }

    @Transactional
    public LoyaltyTransaction awardPoints(Long customerId, int points, String description) {
        CustomerProfile profile = customerRepository.findByUserId(customerId)
            .orElseThrow(() -> new CrmException("Customer not found: " + customerId));

        int balanceBefore = profile.getLoyaltyPoints() != null ? profile.getLoyaltyPoints() : 0;
        int balanceAfter = balanceBefore + points;

        LoyaltyProgram program = programRepository.findByIsActiveTrue().stream().findFirst().orElse(null);
        LocalDate expiryDate = program != null && program.getPointsExpiryDays() != null
            ? LocalDate.now().plusDays(program.getPointsExpiryDays())
            : LocalDate.now().plusDays(CrmConstants.DEFAULT_POINTS_EXPIRY_DAYS);

        LoyaltyTransaction txn = LoyaltyTransaction.builder()
            .customerId(customerId)
            .transactionType("EARNED")
            .points(points)
            .balanceBefore(balanceBefore)
            .balanceAfter(balanceAfter)
            .description(description)
            .expiryDate(expiryDate)
            .status("ACTIVE")
            .build();

        LoyaltyTransaction saved = transactionRepository.save(txn);

        // Update profile
        profile.setLoyaltyPoints(balanceAfter);
        profile.setLoyaltyTier(determineTier(balanceAfter));
        customerRepository.save(profile);

        log.info("Awarded {} points to customer {}. New balance: {}", points, customerId, balanceAfter);
        return saved;
    }

    @Transactional
    public LoyaltyTransaction redeemPoints(Long customerId, int points, String description) {
        CustomerProfile profile = customerRepository.findByUserId(customerId)
            .orElseThrow(() -> new CrmException("Customer not found: " + customerId));

        int currentBalance = profile.getLoyaltyPoints() != null ? profile.getLoyaltyPoints() : 0;
        if (currentBalance < points) {
            throw new CrmException("Insufficient loyalty points. Available: " + currentBalance + ", Requested: " + points);
        }

        int balanceAfter = currentBalance - points;

        LoyaltyTransaction txn = LoyaltyTransaction.builder()
            .customerId(customerId)
            .transactionType("REDEEMED")
            .points(points)
            .balanceBefore(currentBalance)
            .balanceAfter(balanceAfter)
            .description(description)
            .status("COMPLETED")
            .build();

        LoyaltyTransaction saved = transactionRepository.save(txn);

        profile.setLoyaltyPoints(balanceAfter);
        customerRepository.save(profile);

        log.info("Redeemed {} points from customer {}. New balance: {}", points, customerId, balanceAfter);
        return saved;
    }

    @Transactional
    public void checkAndExpirePoints() {
        List<LoyaltyTransaction> expiring = transactionRepository.findExpiringPoints(LocalDate.now());
        for (LoyaltyTransaction txn : expiring) {
            txn.setStatus("EXPIRED");
            transactionRepository.save(txn);

            CustomerProfile profile = customerRepository.findByUserId(txn.getCustomerId()).orElse(null);
            if (profile != null) {
                profile.setLoyaltyPoints(Math.max(0, profile.getLoyaltyPoints() - txn.getPoints()));
                customerRepository.save(profile);
            }
        }
        if (!expiring.isEmpty()) {
            log.info("Expired {} loyalty point transactions", expiring.size());
        }
    }

    @Transactional(readOnly = true)
    public String determineTier(int points) {
        List<LoyaltyProgram> programs = programRepository.findByIsActiveTrue();
        if (programs.isEmpty()) return "BRONZE";

        LoyaltyProgram program = programs.get(0);
        if (program.getTierThresholdPlatinum() != null && points >= program.getTierThresholdPlatinum()) return "PLATINUM";
        if (program.getTierThresholdGold() != null && points >= program.getTierThresholdGold()) return "GOLD";
        if (program.getTierThresholdSilver() != null && points >= program.getTierThresholdSilver()) return "SILVER";
        return "BRONZE";
    }
}
