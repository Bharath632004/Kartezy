package com.kartezy.subscriptionservice.service;

import com.kartezy.subscriptionservice.dto.SubscriptionDto;
import com.kartezy.subscriptionservice.entity.Subscription;
import com.kartezy.subscriptionservice.repository.SubscriptionRepository;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Transactional
    public SubscriptionDto createSubscription(SubscriptionDto request) {
        Subscription sub = Subscription.builder()
            .userId(request.getUserId()).merchantId(request.getMerchantId())
            .planName(request.getPlanName()).planType(request.getPlanType())
            .billingCycle(request.getBillingCycle() != null ? request.getBillingCycle() : "MONTHLY")
            .amount(request.getAmount()).currency(request.getCurrency() != null ? request.getCurrency() : "INR")
            .status("ACTIVE").startDate(LocalDateTime.now())
            .endDate(LocalDateTime.now().plusMonths(1))
            .nextBillingDate(LocalDateTime.now().plusMonths(1))
            .autoRenew(true).paymentReference(request.getPaymentReference())
            .build();
        sub = subscriptionRepository.save(sub);
        log.info("Subscription created: userId={} plan={}", request.getUserId(), request.getPlanName());
        return toDto(sub);
    }

    public SubscriptionDto getSubscription(UUID id) {
        return toDto(subscriptionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Subscription not found: " + id)));
    }

    public List<SubscriptionDto> getUserSubscriptions(UUID userId) {
        return subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void cancelSubscription(UUID id) {
        Subscription sub = subscriptionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Subscription not found: " + id));
        sub.setStatus("CANCELLED");
        sub.setAutoRenew(false);
        subscriptionRepository.save(sub);
        log.info("Subscription cancelled: {}", id);
    }

    private SubscriptionDto toDto(Subscription sub) {
        return SubscriptionDto.builder()
            .id(sub.getId()).userId(sub.getUserId()).merchantId(sub.getMerchantId())
            .planName(sub.getPlanName()).planType(sub.getPlanType())
            .billingCycle(sub.getBillingCycle()).amount(sub.getAmount())
            .currency(sub.getCurrency()).status(sub.getStatus())
            .startDate(sub.getStartDate()).endDate(sub.getEndDate())
            .nextBillingDate(sub.getNextBillingDate()).autoRenew(sub.isAutoRenew())
            .paymentReference(sub.getPaymentReference()).createdAt(sub.getCreatedAt()).build();
    }
}
