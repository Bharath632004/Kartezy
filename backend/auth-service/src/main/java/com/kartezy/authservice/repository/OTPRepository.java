package com.kartezy.authservice.repository;

import com.kartezy.authservice.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface OTPRepository extends JpaRepository<OTP, Long> {

    // Find OTP by email and purpose
    Optional<OTP> findByEmailAndPurpose(String email, String purpose);

    // Find OTP by phone and purpose
    Optional<OTP> findByPhoneAndPurpose(String phone, String purpose);

    // Find OTP by otp value and purpose and used status
    Optional<OTP> findByOtpAndPurposeAndUsedFalse(String otp, String purpose);

    // Find valid OTP (not expired and not used)
    @Query("SELECT o FROM OTP o WHERE o.email = :email AND o.purpose = :purpose AND o.used = false AND o.expiryDate > :now")
    Optional<OTP> findValidByEmailAndPurpose(@Param("email") String email, @Param("purpose") String purpose, @Param("now") Instant now);

    // Find valid OTP by phone
    @Query("SELECT o FROM OTP o WHERE o.phone = :phone AND o.purpose = :purpose AND o.used = false AND o.expiryDate > :now")
    Optional<OTP> findValidByPhoneAndPurpose(@Param("phone") String phone, @Param("purpose") String purpose, @Param("now") Instant now);

    // Mark OTP as used
    @Modifying
    @Query("UPDATE OTP o SET o.used = true WHERE o.id = :id")
    void markAsUsed(@Param("id") Long id);

    // Delete expired OTPs
    @Modifying
    @Query("DELETE FROM OTP o WHERE o.expiryDate < :now")
    int deleteExpired(@Param("now") Instant now);
}
