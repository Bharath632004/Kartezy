package com.kartezy.loyaltyservice.service;

import com.kartezy.loyaltyservice.dto.LoyaltyPointsDto;
import com.kartezy.loyaltyservice.dto.LoyaltyTransactionDto;
import com.kartezy.loyaltyservice.entity.LoyaltyPoints;
import com.kartezy.loyaltyservice.entity.LoyaltyTransaction;
import com.kartezy.loyaltyservice.repository.LoyaltyPointsRepository;
import com.kartezy.loyaltyservice.repository.LoyaltyTransactionRepository;
import com.kartezy.shared.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoyaltyService {

    private final LoyaltyPointsRepository pointsRepository;
    private final LoyaltyTransactionRepository transactionRepository;

    public LoyaltyPointsDto getPoints(UUID userId) {
        LoyaltyPoints points = pointsRepository.findByUserId(userId)
            .orElseGet(() -> pointsRepository.save(
                LoyaltyPoints.builder().userId(userId).build()));
        return toDto(points);
    }

    @Transactional
    public LoyaltyPointsDto addPoints(UUID userId, int points, String description, UUID referenceId) {
        LoyaltyPoints lp = pointsRepository.findByUserId(userId)
            .orElseGet(() -> pointsRepository.save(
                LoyaltyPoints.builder().userId(userId).build()));

        lp.setTotalPoints(lp.getTotalPoints() + points);
        lp.setAvailablePoints(lp.getAvailablePoints() + points);
        pointsRepository.save(lp);

        LoyaltyTransaction txn = LoyaltyTransaction.builder()
            .userId(userId).points(points).transactionType("EARNED")
            .description(description).referenceId(referenceId).referenceType("ORDER")
            .build();
        transactionRepository.save(txn);

        log.info("Loyalty points added: userId={} points={}", userId, points);
        return toDto(lp);
    }

    @Transactional
    public LoyaltyPointsDto redeemPoints(UUID userId, int points, String description) {
        LoyaltyPoints lp = pointsRepository.findByUserId(userId)
            .orElseThrow(() -> new BadRequestException("No loyalty points found"));

        if (lp.getAvailablePoints() < points) {
            throw new BadRequestException("Insufficient loyalty points. Available: " + lp.getAvailablePoints());
        }

        lp.setAvailablePoints(lp.getAvailablePoints() - points);
        lp.setRedeemedPoints(lp.getRedeemedPoints() + points);
        pointsRepository.save(lp);

        LoyaltyTransaction txn = LoyaltyTransaction.builder()
            .userId(userId).points(points).transactionType("REDEEMED")
            .description(description).build();
        transactionRepository.save(txn);

        log.info("Loyalty points redeemed: userId={} points={}", userId, points);
        return toDto(lp);
    }

    public List<LoyaltyTransactionDto> getTransactionHistory(UUID userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(t -> LoyaltyTransactionDto.builder()
                .id(t.getId()).points(t.getPoints())
                .transactionType(t.getTransactionType())
                .description(t.getDescription())
                .referenceId(t.getReferenceId())
                .referenceType(t.getReferenceType())
                .createdAt(t.getCreatedAt()).build())
            .collect(Collectors.toList());
    }

    private LoyaltyPointsDto toDto(LoyaltyPoints lp) {
        return LoyaltyPointsDto.builder()
            .userId(lp.getUserId()).totalPoints(lp.getTotalPoints())
            .availablePoints(lp.getAvailablePoints())
            .redeemedPoints(lp.getRedeemedPoints())
            .expiredPoints(lp.getExpiredPoints()).tier(lp.getTier())
            .build();
    }
}
