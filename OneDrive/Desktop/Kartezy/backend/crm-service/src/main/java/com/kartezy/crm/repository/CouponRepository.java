package com.kartezy.crm.repository;

import com.kartezy.crm.entity.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCode(String code);

    Page<Coupon> findByCustomerId(Long customerId, Pageable pageable);

    Page<Coupon> findByCampaignId(Long campaignId, Pageable pageable);

    List<Coupon> findByStatus(String status);

    List<Coupon> findByExpiryDateBeforeAndStatus(LocalDate date, String status);

    long countByCustomerIdAndStatus(Long customerId, String status);

    @Query("SELECT c FROM Coupon c WHERE c.isPublic = true AND c.status = 'ACTIVE' AND c.expiryDate >= CURRENT_DATE")
    List<Coupon> findActivePublicCoupons();

    @Query("SELECT COALESCE(SUM(c.discountValue), 0) FROM Coupon c WHERE c.status = 'USED' AND c.usedAt >= :from")
    Double getTotalDiscountGiven(@Param("from") LocalDate from);
}
