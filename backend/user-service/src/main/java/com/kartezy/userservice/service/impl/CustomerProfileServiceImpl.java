package com.kartezy.userservice.service.impl;

import com.kartezy.userservice.dto.CustomerProfileDto;
import com.kartezy.userservice.entity.CustomerProfile;
import com.kartezy.userservice.repository.CustomerProfileRepository;
import com.kartezy.userservice.service.CustomerProfileService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service implementation for managing CustomerProfile entities.
 */
@Service
@AllArgsConstructor
public class CustomerProfileServiceImpl implements CustomerProfileService {

    private final CustomerProfileRepository customerProfileRepository;

    @Override
    public CustomerProfileDto createCustomerProfile(CustomerProfileDto customerProfileDto) {
        CustomerProfile customerProfile = CustomerProfile.builder()
                .userId(customerProfileDto.getUserId())
                .email(customerProfileDto.getEmail())
                .phoneNumber(customerProfileDto.getPhoneNumber())
                // Assuming other fields are set via builder or setters
                .build();
        // If there are more fields, map them here.
        // For simplicity, we map only the ones we know.
        // In a real scenario, we would map all fields.
        CustomerProfile saved = customerProfileRepository.save(customerProfile);
        return mapToDto(saved);
    }

    @Override
    public Optional<CustomerProfileDto> getCustomerProfileById(UUID id) {
        return customerProfileRepository.findById(id).map(this::mapToDto);
    }

    @Override
    public List<CustomerProfileDto> getAllCustomerProfiles() {
        return customerProfileRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerProfileDto updateCustomerProfile(UUID id, CustomerProfileDto customerProfileDto) {
        CustomerProfile existing = customerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CustomerProfile not found with id: " + id));
        // Update fields
        existing.setUserId(customerProfileDto.getUserId());
        existing.setEmail(customerProfileDto.getEmail());
        existing.setPhoneNumber(customerProfileDto.getPhoneNumber());
        // Update other fields as needed
        CustomerProfile updated = customerProfileRepository.save(existing);
        return mapToDto(updated);
    }

    @Override
    public void deleteCustomerProfile(UUID id) {
        customerProfileRepository.deleteById(id);
    }

    @Override
    public CustomerProfileDto findByUserId(UUID userId) {
        return customerProfileRepository.findByUserId(userId)
                .map(this::mapToDto)
                .orElse(null);
    }

    @Override
    public boolean existsByUserId(UUID userId) {
        return customerProfileRepository.existsByUserId(userId);
    }

    @Override
    public CustomerProfileDto findByEmail(String email) {
        return customerProfileRepository.findByEmail(email)
                .map(this::mapToDto)
                .orElse(null);
    }

    @Override
    public boolean existsByEmail(String email) {
        return customerProfileRepository.existsByEmail(email);
    }

    @Override
    public CustomerProfileDto findByPhoneNumber(String phoneNumber) {
        return customerProfileRepository.findByPhoneNumber(phoneNumber)
                .map(this::mapToDto)
                .orElse(null);
    }

    @Override
    public boolean existsByPhoneNumber(String phoneNumber) {
        return customerProfileRepository.existsByPhoneNumber(phoneNumber);
    }

    private CustomerProfileDto mapToDto(CustomerProfile customerProfile) {
        return CustomerProfileDto.builder()
                .id(customerProfile.getId())
                .userId(customerProfile.getUserId())
                .email(customerProfile.getEmail())
                .phoneNumber(customerProfile.getPhoneNumber())
                // Map other fields if present
                .build();
    }
}
