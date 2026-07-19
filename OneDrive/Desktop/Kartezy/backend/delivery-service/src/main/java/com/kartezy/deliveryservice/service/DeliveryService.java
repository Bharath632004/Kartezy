package com.kartezy.deliveryservice.service;

import com.kartezy.deliveryservice.dto.*;
import com.kartezy.deliveryservice.entity.*;
import com.kartezy.deliveryservice.entity.DeliveryAssignment.AssignmentStatus;
import com.kartezy.deliveryservice.entity.DeliveryAssignment.DeliveryType;
import com.kartezy.deliveryservice.entity.DeliveryEarning.EarningStatus;
import com.kartezy.deliveryservice.entity.DeliveryPartner.KycStatus;
import com.kartezy.deliveryservice.entity.DeliveryPartner.PartnerStatus;
import com.kartezy.deliveryservice.entity.DeliveryPartner.VehicleType;
import com.kartezy.deliveryservice.repository.*;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeliveryService {
    private final DeliveryPartnerRepository partnerRepository;
    private final DeliveryAssignmentRepository assignmentRepository;
    private final DeliveryEarningRepository earningRepository;

    @Transactional
    public DeliveryPartnerDto registerPartner(DeliveryPartnerRequestDto request) {
        log.info("Registering delivery partner: {}", request.getPhoneNumber());

        if (partnerRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new BadRequestException("Phone number already registered");
        }

        VehicleType vehicleType;
        try {
            vehicleType = VehicleType.valueOf(request.getVehicleType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid vehicle type: " + request.getVehicleType());
        }

        DeliveryPartner partner = DeliveryPartner.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .phoneNumber(request.getPhoneNumber())
            .email(request.getEmail())
            .status(PartnerStatus.PENDING)
            .isOnline(false)
            .isVerified(false)
            .vehicleType(vehicleType)
            .vehicleNumber(request.getVehicleNumber())
            .vehicleModel(request.getVehicleModel())
            .vehicleColor(request.getVehicleColor())
            .currentLatitude(request.getCurrentLatitude() != null ? request.getCurrentLatitude() : 0.0)
            .currentLongitude(request.getCurrentLongitude() != null ? request.getCurrentLongitude() : 0.0)
            .city(request.getCity())
            .state(request.getState())
            .pincode(request.getPincode())
            .kycStatus(KycStatus.PENDING)
            .rating(0.0)
            .totalDeliveries(0L)
            .totalRatings(0L)
            .totalEarnings(0.0)
            .todayEarnings(0.0)
            .walletBalance(0.0)
            .isAvailable(true)
            .maxDeliveryRadius(10.0)
            .build();

        partner = partnerRepository.save(partner);
        log.info("Delivery partner registered with ID: {}", partner.getId());
        return toPartnerDto(partner);
    }

    @Transactional
    public DeliveryAssignmentDto assignOrder(DeliveryAssignmentRequestDto request) {
        log.info("Assigning order {} to partner {}", request.getOrderId(), request.getPartnerId());

        DeliveryPartner partner = partnerRepository.findById(request.getPartnerId())
            .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));

        if (!partner.getIsAvailable() || !partner.getIsOnline()) {
            throw new BadRequestException("Partner is not available");
        }

        if (!partner.getStatus().equals(PartnerStatus.APPROVED)) {
            throw new BadRequestException("Partner is not approved");
        }

        DeliveryType deliveryType;
        try {
            deliveryType = DeliveryType.valueOf(request.getDeliveryType().toUpperCase());
        } catch (IllegalArgumentException e) {
            deliveryType = DeliveryType.INSTANT;
        }

        String deliveryOtp = String.format("%06d", new Random().nextInt(999999));

        DeliveryAssignment assignment = DeliveryAssignment.builder()
            .orderId(request.getOrderId())
            .partnerId(request.getPartnerId())
            .status(AssignmentStatus.PENDING)
            .deliveryType(deliveryType)
            .pickupAddress(request.getPickupAddress())
            .pickupLatitude(request.getPickupLatitude())
            .pickupLongitude(request.getPickupLongitude())
            .deliveryAddress(request.getDeliveryAddress())
            .deliveryLatitude(request.getDeliveryLatitude())
            .deliveryLongitude(request.getDeliveryLongitude())
            .estimatedDistance(request.getEstimatedDistance() != null ? request.getEstimatedDistance() : 0.0)
            .estimatedDuration(request.getEstimatedDuration() != null ? request.getEstimatedDuration() : 0)
            .actualDistance(0.0)
            .deliveryOtp(deliveryOtp)
            .build();

        assignment = assignmentRepository.save(assignment);
        log.info("Order assigned with ID: {}", assignment.getId());

        partner.setIsAvailable(false);
        partnerRepository.save(partner);

        return toAssignmentDto(assignment);
    }

    @Transactional
    public DeliveryAssignmentDto acceptOrder(UUID assignmentId) {
        DeliveryAssignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        assignment.setStatus(AssignmentStatus.ACCEPTED);
        assignment.setAcceptedAt(LocalDateTime.now());
        assignment = assignmentRepository.save(assignment);
        log.info("Assignment {} accepted", assignmentId);
        return toAssignmentDto(assignment);
    }

    @Transactional
    public DeliveryAssignmentDto pickUpOrder(UUID assignmentId) {
        DeliveryAssignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        assignment.setStatus(AssignmentStatus.PICKED_UP);
        assignment.setPickedUpAt(LocalDateTime.now());
        assignment = assignmentRepository.save(assignment);
        log.info("Order picked up for assignment {}", assignmentId);
        return toAssignmentDto(assignment);
    }

    @Transactional
    public DeliveryAssignmentDto deliverOrder(UUID assignmentId, String otp, DeliveryProofDto proof) {
        DeliveryAssignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        if (!assignment.getDeliveryOtp().equals(otp)) {
            throw new BadRequestException("Invalid delivery OTP");
        }

        assignment.setStatus(AssignmentStatus.DELIVERED);
        assignment.setDeliveredAt(LocalDateTime.now());
        assignment.setProofPhotoUrl(proof.getProofPhotoUrl());
        assignment.setCustomerSignatureUrl(proof.getCustomerSignatureUrl());
        assignment.setNotes(proof.getNotes());
        assignment = assignmentRepository.save(assignment);

        // Mark partner as available
        DeliveryPartner partner = partnerRepository.findById(assignment.getPartnerId())
            .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));
        partner.setIsAvailable(true);
        partner.setTotalDeliveries(partner.getTotalDeliveries() + 1);
        partnerRepository.save(partner);

        // Create earnings entry
        double deliveryFee = calculateDeliveryFee(assignment.getEstimatedDistance());
        DeliveryEarning earning = DeliveryEarning.builder()
            .partnerId(assignment.getPartnerId())
            .assignmentId(assignmentId)
            .deliveryFee(deliveryFee)
            .tip(0.0)
            .incentive(0.0)
            .totalAmount(deliveryFee)
            .platformCommission(deliveryFee * 0.10)
            .netAmount(deliveryFee * 0.90)
            .status(EarningStatus.PENDING)
            .build();
        earningRepository.save(earning);

        partner.setTotalEarnings(partner.getTotalEarnings() + earning.getNetAmount());
        partner.setTodayEarnings(partner.getTodayEarnings() + earning.getNetAmount());
        partner.setWalletBalance(partner.getWalletBalance() + earning.getNetAmount());
        partnerRepository.save(partner);

        log.info("Order delivered for assignment {}", assignmentId);
        return toAssignmentDto(assignment);
    }

    @Transactional
    public DeliveryAssignmentDto cancelAssignment(UUID assignmentId) {
        DeliveryAssignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        assignment.setStatus(AssignmentStatus.CANCELLED);
        assignment = assignmentRepository.save(assignment);

        DeliveryPartner partner = partnerRepository.findById(assignment.getPartnerId())
            .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));
        partner.setIsAvailable(true);
        partnerRepository.save(partner);

        log.info("Assignment {} cancelled", assignmentId);
        return toAssignmentDto(assignment);
    }

    @Transactional
    public DeliveryPartnerDto updateLocation(UUID partnerId, DeliveryLocationUpdateDto location) {
        DeliveryPartner partner = partnerRepository.findById(partnerId)
            .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));

        partner.setCurrentLatitude(location.getLatitude());
        partner.setCurrentLongitude(location.getLongitude());
        partner.setLastOnlineAt(LocalDateTime.now());
        partner = partnerRepository.save(partner);
        return toPartnerDto(partner);
    }

    @Transactional
    public DeliveryPartnerDto toggleOnlineStatus(UUID partnerId, boolean online) {
        DeliveryPartner partner = partnerRepository.findById(partnerId)
            .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));

        partner.setIsOnline(online);
        if (online) {
            partner.setLastOnlineAt(LocalDateTime.now());
        }
        partner = partnerRepository.save(partner);
        return toPartnerDto(partner);
    }

    @Transactional
    public DeliveryPartnerDto updateVerification(UUID partnerId, boolean verified) {
        DeliveryPartner partner = partnerRepository.findById(partnerId)
            .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));

        partner.setIsVerified(verified);
        if (verified) {
            partner.setKycStatus(KycStatus.VERIFIED);
            partner.setStatus(PartnerStatus.APPROVED);
        }
        partner = partnerRepository.save(partner);
        return toPartnerDto(partner);
    }

    public DeliveryPartnerDto getPartner(UUID id) {
        return partnerRepository.findById(id)
            .map(this::toPartnerDto)
            .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));
    }

    public List<DeliveryPartnerDto> getAllPartners() {
        return partnerRepository.findAll().stream()
            .map(this::toPartnerDto).collect(Collectors.toList());
    }

    public List<DeliveryAssignmentDto> getPartnerAssignments(UUID partnerId) {
        return assignmentRepository.findByPartnerIdOrderByCreatedAtDesc(partnerId)
            .stream().map(this::toAssignmentDto).collect(Collectors.toList());
    }

    public DeliveryAssignmentDto getOrderAssignment(UUID orderId) {
        return assignmentRepository.findByOrderId(orderId)
            .map(this::toAssignmentDto)
            .orElseThrow(() -> new ResourceNotFoundException("Assignment not found for order"));
    }

    public List<DeliveryEarningDto> getPartnerEarnings(UUID partnerId) {
        return earningRepository.findByPartnerIdOrderByCreatedAtDesc(partnerId)
            .stream().map(this::toEarningDto).collect(Collectors.toList());
    }

    public DeliveryPerformanceDto getPartnerPerformance(UUID partnerId) {
        DeliveryPartner partner = partnerRepository.findById(partnerId)
            .orElseThrow(() -> new ResourceNotFoundException("Partner not found"));

        long total = partner.getTotalDeliveries();
        long completed = assignmentRepository.countByPartnerIdAndStatus(partnerId, AssignmentStatus.DELIVERED);

        return DeliveryPerformanceDto.builder()
            .totalDeliveries(total)
            .completedDeliveries(completed)
            .cancelledDeliveries(total - completed)
            .averageRating(partner.getRating())
            .totalEarnings(partner.getTotalEarnings())
            .averageDeliveryTime(25.0)
            .acceptanceRate(95.0)
            .completionRate(total > 0 ? (double) completed / total * 100 : 0)
            .build();
    }

    public List<DeliveryPartnerDto> getAvailablePartners(String city) {
        return partnerRepository.findByCityAndIsAvailableTrueAndIsOnlineTrue(city)
            .stream().map(this::toPartnerDto).collect(Collectors.toList());
    }

    private double calculateDeliveryFee(double distanceKm) {
        double baseFee = 20.0;
        double perKmFee = 10.0;
        return baseFee + (distanceKm * perKmFee);
    }

    private DeliveryPartnerDto toPartnerDto(DeliveryPartner p) {
        return DeliveryPartnerDto.builder()
            .id(p.getId()).firstName(p.getFirstName()).lastName(p.getLastName())
            .phoneNumber(p.getPhoneNumber()).email(p.getEmail())
            .status(p.getStatus().name()).isOnline(p.isOnline()).isVerified(p.isVerified())
            .vehicleType(p.getVehicleType().name()).vehicleNumber(p.getVehicleNumber())
            .vehicleModel(p.getVehicleModel()).vehicleColor(p.getVehicleColor())
            .currentLatitude(p.getCurrentLatitude()).currentLongitude(p.getCurrentLongitude())
            .city(p.getCity()).state(p.getState()).pincode(p.getPincode())
            .profilePhotoUrl(p.getProfilePhotoUrl()).kycStatus(p.getKycStatus().name())
            .rating(p.getRating()).totalDeliveries(p.getTotalDeliveries())
            .totalRatings(p.getTotalRatings()).totalEarnings(p.getTotalEarnings())
            .todayEarnings(p.getTodayEarnings()).walletBalance(p.getWalletBalance())
            .isAvailable(p.getIsAvailable()).maxDeliveryRadius(p.getMaxDeliveryRadius())
            .createdAt(p.getCreatedAt()).lastOnlineAt(p.getLastOnlineAt()).build();
    }

    private DeliveryAssignmentDto toAssignmentDto(DeliveryAssignment a) {
        return DeliveryAssignmentDto.builder()
            .id(a.getId()).orderId(a.getOrderId()).partnerId(a.getPartnerId())
            .status(a.getStatus().name()).deliveryType(a.getDeliveryType().name())
            .pickupAddress(a.getPickupAddress()).pickupLatitude(a.getPickupLatitude())
            .pickupLongitude(a.getPickupLongitude()).deliveryAddress(a.getDeliveryAddress())
            .deliveryLatitude(a.getDeliveryLatitude()).deliveryLongitude(a.getDeliveryLongitude())
            .estimatedDistance(a.getEstimatedDistance()).estimatedDuration(a.getEstimatedDuration())
            .actualDistance(a.getActualDistance()).acceptedAt(a.getAcceptedAt())
            .pickedUpAt(a.getPickedUpAt()).deliveredAt(a.getDeliveredAt())
            .deliveryOtp(a.getDeliveryOtp()).proofPhotoUrl(a.getProofPhotoUrl())
            .customerSignatureUrl(a.getCustomerSignatureUrl()).notes(a.getNotes())
            .createdAt(a.getCreatedAt()).build();
    }

    private DeliveryEarningDto toEarningDto(DeliveryEarning e) {
        return DeliveryEarningDto.builder()
            .id(e.getId()).partnerId(e.getPartnerId()).assignmentId(e.getAssignmentId())
            .deliveryFee(e.getDeliveryFee()).tip(e.getTip()).incentive(e.getIncentive())
            .totalAmount(e.getTotalAmount()).platformCommission(e.getPlatformCommission())
            .netAmount(e.getNetAmount()).status(e.getStatus().name())
            .createdAt(e.getCreatedAt()).settledAt(e.getSettledAt()).build();
    }
}
