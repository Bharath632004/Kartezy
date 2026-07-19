package com.kartezy.crm.repository;

import com.kartezy.crm.entity.Referral;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, Long> {

    Page<Referral> findByReferrerIdOrderByCreatedAtDesc(Long referrerId, Pageable pageable);

    List<Referral> findByReferrerIdAndStatus(Long referrerId, String status);

    Optional<Referral> findByReferralCode(String referralCode);

    Optional<Referral> findByRefereeId(Long refereeId);

    long countByReferrerId(Long referrerId);

    @Query("SELECT COUNT(r) FROM Referral r WHERE r.referrerId = :referrerId AND r.status = 'CONVERTED'")
    long countConvertedByReferrerId(@Param("referrerId") Long referrerId);

    @Query("SELECT r FROM Referral r WHERE r.referralCode = :code AND r.status = 'PENDING'")
    Optional<Referral> findPendingByCode(@Param("code") String code);

    @Query("SELECT COALESCE(SUM(r.referrerReward), 0) FROM Referral r WHERE r.referrerId = :referrerId AND r.rewardClaimed = true")
    Double getTotalReferralReward(@Param("referrerId") Long referrerId);
}
