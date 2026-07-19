package com.kartezy.userservice.repository;
import com.kartezy.userservice.entity.CustomerProfile;
import com.kartezy.userservice.entity.Referral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
/**
 * Repository for managing Referral entities.
 */
@Repository
public interface ReferralRepository extends JpaRepository<Referral, UUID>, JpaSpecificationExecutor<Referral> {
    Optional<Referral> findByReferralCode(String referralCode);
    Optional<Referral> findByReferrerId(UUID referrerId);
    Optional<Referral> findByRefereeId(UUID refereeId);
}
