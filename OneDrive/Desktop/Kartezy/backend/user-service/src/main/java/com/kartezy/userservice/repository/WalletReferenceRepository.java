package com.kartezy.userservice.repository;
import com.kartezy.userservice.entity.CustomerProfile;
import com.kartezy.userservice.entity.WalletReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
/**
 * Repository for managing WalletReference entities.
 */
@Repository
public interface WalletReferenceRepository extends JpaRepository<WalletReference, UUID>, JpaSpecificationExecutor<WalletReference> {
    Optional<WalletReference> findByCustomerProfileId(UUID customerProfileId);
}
