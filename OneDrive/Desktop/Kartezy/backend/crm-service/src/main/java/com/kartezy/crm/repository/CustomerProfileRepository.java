package com.kartezy.crm.repository;

import com.kartezy.crm.entity.CustomerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> {

    Optional<CustomerProfile> findByUserId(Long userId);

    Optional<CustomerProfile> findByEmail(String email);

    Optional<CustomerProfile> findByPhone(String phone);

    Page<CustomerProfile> findByCity(String city, Pageable pageable);

    Page<CustomerProfile> findByLoyaltyTier(String loyaltyTier, Pageable pageable);

    @Query("SELECT c FROM CustomerProfile c WHERE c.totalOrders >= :minOrders ORDER BY c.totalSpent DESC")
    List<CustomerProfile> findHighValueCustomers(@Param("minOrders") Integer minOrders);

    @Query("SELECT c FROM CustomerProfile c WHERE c.lastOrderDate IS NULL OR c.lastOrderDate < :since")
    List<CustomerProfile> findChurnedCustomers(@Param("since") LocalDateTime since);

    @Query("SELECT c FROM CustomerProfile c WHERE c.lastOrderDate >= :from AND c.lastOrderDate <= :to")
    List<CustomerProfile> findActiveCustomersInPeriod(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT COALESCE(SUM(c.lifetimeValue), 0) FROM CustomerProfile c")
    BigDecimal getTotalCustomerLifetimeValue();

    @Query("SELECT c FROM CustomerProfile c WHERE c.referralCode = :code")
    Optional<CustomerProfile> findByReferralCode(@Param("code") String code);

    long countByLoyaltyTier(String loyaltyTier);

    @Query("SELECT c FROM CustomerProfile c WHERE c.emailOptIn = true AND c.isActive = true")
    List<CustomerProfile> findEmailOptedIn();

    @Query("SELECT c FROM CustomerProfile c WHERE c.smsOptIn = true AND c.isActive = true")
    List<CustomerProfile> findSmsOptedIn();

    @Query("SELECT c FROM CustomerProfile c WHERE c.whatsappOptIn = true AND c.isActive = true")
    List<CustomerProfile> findWhatsappOptedIn();

    @Query("SELECT c FROM CustomerProfile c WHERE c.pushOptIn = true AND c.isActive = true")
    List<CustomerProfile> findPushOptedIn();
}
