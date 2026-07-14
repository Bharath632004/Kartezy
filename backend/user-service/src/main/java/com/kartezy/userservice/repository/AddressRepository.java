package com.kartezy.userservice.repository;
import com.kartezy.userservice.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.UUID;
/**
 * Repository for managing Address entities.
 */
@Repository
public interface AddressRepository extends JpaRepository<Address, UUID>, JpaSpecificationExecutor<Address> {
    // Find addresses by customer profile
    java.util.List<Address> findByCustomerProfileId(UUID customerProfileId);
    // Find default address for a customer
    Address findByCustomerProfileIdAndIsDefaultTrue(UUID customerProfileId);
}