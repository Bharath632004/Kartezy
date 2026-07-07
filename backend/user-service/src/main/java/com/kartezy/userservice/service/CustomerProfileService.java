package com.kartezy.userservice.service;

import com.kartezy.userservice.dto.CustomerProfileDto;
import com.kartezy.userservice.entity.CustomerProfile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service interface for managing CustomerProfile entities.
 */
public interface CustomerProfileService {

    CustomerProfileDto createCustomerProfile(CustomerProfileDto customerProfileDto);

    Optional<CustomerProfileDto> getCustomerProfileById(UUID id);

    List<CustomerProfileDto> getAllCustomerProfiles();

    CustomerProfileDto updateCustomerProfile(UUID id, CustomerProfileDto customerProfileDto);

    void deleteCustomerProfile(UUID id);

    // Additional methods based on repository
    CustomerProfileDto findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);

    CustomerProfileDto findByEmail(String email);

    boolean existsByEmail(String email);

    CustomerProfileDto findByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumber(String phoneNumber);
}
