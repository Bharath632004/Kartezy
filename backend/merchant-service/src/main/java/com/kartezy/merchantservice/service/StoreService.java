package com.kartezy.merchantservice.service;

import com.kartezy.merchantservice.dto.*;
import com.kartezy.merchantservice.entity.*;
import com.kartezy.merchantservice.repository.*;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoreService {
    private final StoreRepository storeRepository;
    private final StoreBusinessHoursRepository businessHoursRepository;
    private final StoreFollowerRepository followerRepository;
    private final MerchantRepository merchantRepository;

    @Transactional
    public StoreResponseDto createStore(StoreCreateRequestDto request) {
        if (storeRepository.findByMerchantId(request.getMerchantId()).isPresent()) {
            throw new BadRequestException("Store already exists for this merchant");
        }

        Store store = Store.builder()
            .merchantId(request.getMerchantId())
            .name(request.getName())
            .description(request.getDescription())
            .category(request.getCategory())
            .logoUrl(request.getLogoUrl())
            .bannerUrl(request.getBannerUrl())
            .tagline(request.getTagline())
            .addressLine1(request.getAddressLine1())
            .addressLine2(request.getAddressLine2())
            .city(request.getCity())
            .state(request.getState())
            .pincode(request.getPincode())
            .latitude(request.getLatitude() != null ? request.getLatitude() : 0.0)
            .longitude(request.getLongitude() != null ? request.getLongitude() : 0.0)
            .phoneNumber(request.getPhoneNumber())
            .email(request.getEmail())
            .website(request.getWebsite())
            .deliveryRadius(request.getDeliveryRadius() != null ? request.getDeliveryRadius() : 5.0)
            .minimumOrderAmount(request.getMinimumOrderAmount() != null ? request.getMinimumOrderAmount() : 0.0)
            .deliveryCharge(request.getDeliveryCharge() != null ? request.getDeliveryCharge() : 0.0)
            .freeDeliveryThreshold(request.getFreeDeliveryThreshold() != null ? request.getFreeDeliveryThreshold() : 0.0)
            .cancellationPolicy(request.getCancellationPolicy())
            .returnPolicy(request.getReturnPolicy())
            .termsAndConditions(request.getTermsAndConditions())
            .build();

        store = storeRepository.save(store);
        log.info("Store created: {} for merchant: {}", store.getId(), request.getMerchantId());

        // Create business hours
        if (request.getBusinessHours() != null) {
            for (StoreBusinessHoursDto hoursDto : request.getBusinessHours()) {
                DayOfWeek day = DayOfWeek.valueOf(hoursDto.getDayOfWeek().toUpperCase());
                StoreBusinessHours hours = StoreBusinessHours.builder()
                    .storeId(store.getId())
                    .dayOfWeek(day)
                    .openTime(hoursDto.getOpenTime())
                    .closeTime(hoursDto.getCloseTime())
                    .isOpen(hoursDto.getIsOpen() != null && hoursDto.getIsOpen())
                    .build();
                businessHoursRepository.save(hours);
            }
        }

        return toStoreResponseDto(store, null);
    }

    @Transactional
    public StoreResponseDto updateStore(UUID storeId, StoreCreateRequestDto request) {
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found"));

        store.setName(request.getName());
        store.setDescription(request.getDescription());
        store.setCategory(request.getCategory());
        store.setLogoUrl(request.getLogoUrl());
        store.setBannerUrl(request.getBannerUrl());
        store.setTagline(request.getTagline());
        store.setAddressLine1(request.getAddressLine1());
        store.setAddressLine2(request.getAddressLine2());
        store.setCity(request.getCity());
        store.setState(request.getState());
        store.setPincode(request.getPincode());
        store.setLatitude(request.getLatitude() != null ? request.getLatitude() : store.getLatitude());
        store.setLongitude(request.getLongitude() != null ? request.getLongitude() : store.getLongitude());
        store.setPhoneNumber(request.getPhoneNumber());
        store.setDeliveryRadius(request.getDeliveryRadius() != null ? request.getDeliveryRadius() : store.getDeliveryRadius());
        store.setMinimumOrderAmount(request.getMinimumOrderAmount() != null ? request.getMinimumOrderAmount() : store.getMinimumOrderAmount());
        store.setDeliveryCharge(request.getDeliveryCharge() != null ? request.getDeliveryCharge() : store.getDeliveryCharge());
        store.setFreeDeliveryThreshold(request.getFreeDeliveryThreshold() != null ? request.getFreeDeliveryThreshold() : store.getFreeDeliveryThreshold());
        store.setCancellationPolicy(request.getCancellationPolicy());
        store.setReturnPolicy(request.getReturnPolicy());
        store.setTermsAndConditions(request.getTermsAndConditions());

        store = storeRepository.save(store);

        // Update business hours
        if (request.getBusinessHours() != null) {
            businessHoursRepository.findByStoreId(storeId).forEach(bh -> businessHoursRepository.delete(bh));
            for (StoreBusinessHoursDto hoursDto : request.getBusinessHours()) {
                DayOfWeek day = DayOfWeek.valueOf(hoursDto.getDayOfWeek().toUpperCase());
                StoreBusinessHours hours = StoreBusinessHours.builder()
                    .storeId(store.getId()).dayOfWeek(day)
                    .openTime(hoursDto.getOpenTime()).closeTime(hoursDto.getCloseTime())
                    .isOpen(hoursDto.getIsOpen() != null && hoursDto.getIsOpen())
                    .build();
                businessHoursRepository.save(hours);
            }
        }

        return toStoreResponseDto(store, null);
    }

    @Transactional
    public StoreResponseDto toggleStoreStatus(UUID storeId, boolean isOpen) {
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
        store.setIsOpen(isOpen);
        store = storeRepository.save(store);
        return toStoreResponseDto(store, null);
    }

    @Transactional
    public StoreResponseDto verifyStore(UUID storeId) {
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
        store.setIsVerified(true);
        store.setStatus("ACTIVE");
        store = storeRepository.save(store);
        return toStoreResponseDto(store, null);
    }

    @Transactional
    public void followStore(UUID storeId, UUID userId) {
        if (followerRepository.findByStoreIdAndUserId(storeId, userId).isPresent()) {
            throw new BadRequestException("Already following this store");
        }
        StoreFollower follower = StoreFollower.builder().storeId(storeId).userId(userId).build();
        followerRepository.save(follower);
        Store store = storeRepository.findById(storeId).orElseThrow();
        store.setTotalFollowers(store.getTotalFollowers() + 1);
        storeRepository.save(store);
    }

    @Transactional
    public void unfollowStore(UUID storeId, UUID userId) {
        StoreFollower follower = followerRepository.findByStoreIdAndUserId(storeId, userId)
            .orElseThrow(() -> new BadRequestException("Not following this store"));
        followerRepository.delete(follower);
        Store store = storeRepository.findById(storeId).orElseThrow();
        store.setTotalFollowers(Math.max(0, store.getTotalFollowers() - 1));
        storeRepository.save(store);
    }

    public StoreResponseDto getStore(UUID storeId, UUID userId) {
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
        boolean isFollowing = userId != null &&
            followerRepository.findByStoreIdAndUserId(storeId, userId).isPresent();
        return toStoreResponseDto(store, isFollowing);
    }

    public StoreResponseDto getStoreByMerchantId(UUID merchantId) {
        Store store = storeRepository.findByMerchantId(merchantId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found for merchant"));
        return toStoreResponseDto(store, null);
    }

    public List<StoreResponseDto> getNearbyStores(String city) {
        return storeRepository.findByCityAndIsOpenTrue(city).stream()
            .map(s -> toStoreResponseDto(s, false))
            .collect(Collectors.toList());
    }

    public List<StoreResponseDto> getStoresByCategory(String category) {
        return storeRepository.findByCategory(category).stream()
            .map(s -> toStoreResponseDto(s, false))
            .collect(Collectors.toList());
    }

    public List<StoreResponseDto> getFeaturedStores() {
        return storeRepository.findByIsFeaturedTrue().stream()
            .map(s -> toStoreResponseDto(s, false))
            .collect(Collectors.toList());
    }

    public List<StoreResponseDto> getAllStores() {
        return storeRepository.findAll().stream()
            .map(s -> toStoreResponseDto(s, false))
            .collect(Collectors.toList());
    }

    public StoreSearchDto toSearchDto(Store store) {
        return StoreSearchDto.builder()
            .id(store.getId()).merchantId(store.getMerchantId())
            .name(store.getName()).description(store.getDescription())
            .category(store.getCategory()).logoUrl(store.getLogoUrl())
            .bannerUrl(store.getBannerUrl()).city(store.getCity()).state(store.getState())
            .latitude(store.getLatitude()).longitude(store.getLongitude())
            .status(store.getStatus()).isOpen(store.getIsOpen())
            .rating(store.getRating()).totalRatings(store.getTotalRatings())
            .build();
    }

    private StoreResponseDto toStoreResponseDto(Store s, Boolean isFollowing) {
        List<StoreBusinessHours> hoursList = businessHoursRepository.findByStoreId(s.getId());
        List<StoreBusinessHoursDto> hoursDtos = hoursList.stream()
            .map(h -> StoreBusinessHoursDto.builder()
                .id(h.getId()).storeId(h.getStoreId())
                .dayOfWeek(h.getDayOfWeek().name())
                .openTime(h.getOpenTime()).closeTime(h.getCloseTime())
                .isOpen(h.getIsOpen()).build())
            .collect(Collectors.toList());

        return StoreResponseDto.builder()
            .id(s.getId()).merchantId(s.getMerchantId())
            .name(s.getName()).description(s.getDescription())
            .category(s.getCategory()).logoUrl(s.getLogoUrl())
            .bannerUrl(s.getBannerUrl()).tagline(s.getTagline())
            .addressLine1(s.getAddressLine1()).addressLine2(s.getAddressLine2())
            .city(s.getCity()).state(s.getState()).pincode(s.getPincode())
            .latitude(s.getLatitude()).longitude(s.getLongitude())
            .phoneNumber(s.getPhoneNumber()).email(s.getEmail()).website(s.getWebsite())
            .status(s.getStatus()).isOpen(s.getIsOpen()).isVerified(s.getIsVerified())
            .deliveryRadius(s.getDeliveryRadius()).minimumOrderAmount(s.getMinimumOrderAmount())
            .deliveryCharge(s.getDeliveryCharge()).freeDeliveryThreshold(s.getFreeDeliveryThreshold())
            .cancellationPolicy(s.getCancellationPolicy()).returnPolicy(s.getReturnPolicy())
            .termsAndConditions(s.getTermsAndConditions())
            .rating(s.getRating()).totalRatings(s.getTotalRatings())
            .totalFollowers(s.getTotalFollowers()).isFeatured(s.getIsFeatured())
            .isFollowing(isFollowing != null && isFollowing)
            .businessHours(hoursDtos).build();
    }
}
