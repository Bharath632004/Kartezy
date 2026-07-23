package com.kartezy.membershipservice.service;

import com.kartezy.membershipservice.dto.MembershipDto;
import com.kartezy.membershipservice.dto.MembershipPlanDto;
import com.kartezy.membershipservice.entity.Membership;
import com.kartezy.membershipservice.entity.MembershipPlan;
import com.kartezy.membershipservice.repository.MembershipPlanRepository;
import com.kartezy.membershipservice.repository.MembershipRepository;
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
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final MembershipPlanRepository planRepository;

    public List<MembershipPlanDto> getAllPlans() {
        return planRepository.findByActiveTrueOrderByPriceAsc()
            .stream().map(this::toPlanDto).collect(Collectors.toList());
    }

    @Transactional
    public MembershipDto createMembership(UUID userId, UUID planId, String paymentReference) {
        MembershipPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("Plan not found: " + planId));

        Membership membership = Membership.builder()
            .userId(userId).planId(planId).tier(plan.getTier())
            .status("ACTIVE").startDate(LocalDateTime.now())
            .endDate(LocalDateTime.now().plusDays(plan.getDurationDays()))
            .paymentReference(paymentReference)
            .autoRenew(true).build();
        membership = membershipRepository.save(membership);
        log.info("Membership created: userId={} plan={}", userId, plan.getName());
        return toMembershipDto(membership);
    }

    public MembershipDto getMembership(UUID userId) {
        Membership membership = membershipRepository.findByUserIdAndStatus(userId, "ACTIVE")
            .orElseThrow(() -> new ResourceNotFoundException("No active membership for user: " + userId));
        return toMembershipDto(membership);
    }

    @Transactional
    public void cancelMembership(UUID userId) {
        Membership membership = membershipRepository.findByUserIdAndStatus(userId, "ACTIVE")
            .orElseThrow(() -> new ResourceNotFoundException("No active membership for user: " + userId));
        membership.setStatus("CANCELLED");
        membership.setAutoRenew(false);
        membershipRepository.save(membership);
        log.info("Membership cancelled: userId={}", userId);
    }

    private MembershipDto toMembershipDto(Membership m) {
        return MembershipDto.builder()
            .id(m.getId()).userId(m.getUserId()).planId(m.getPlanId())
            .tier(m.getTier()).status(m.getStatus())
            .startDate(m.getStartDate()).endDate(m.getEndDate())
            .autoRenew(m.isAutoRenew()).paymentReference(m.getPaymentReference())
            .createdAt(m.getCreatedAt()).build();
    }

    private MembershipPlanDto toPlanDto(MembershipPlan plan) {
        return MembershipPlanDto.builder()
            .id(plan.getId()).name(plan.getName()).tier(plan.getTier())
            .price(plan.getPrice()).durationDays(plan.getDurationDays())
            .description(plan.getDescription()).benefits(plan.getBenefits())
            .active(plan.isActive()).build();
    }
}
