package com.kartezy.userservice.repository;
import com.kartezy.userservice.entity.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
/**
 * Repository for managing CustomerProfile entities.
 */
@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, UUID>, JpaSpecificationExecutor<CustomerProfile> {
    Optional<CustomerProfile> findByUserId(UUID userId);
    boolean existsByUserId(UUID userId);
    Optional<CustomerProfile> findByEmail(String email);
    boolean existsByEmail(String email);
    CustomerProfile findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumber(String phoneNumber);
}