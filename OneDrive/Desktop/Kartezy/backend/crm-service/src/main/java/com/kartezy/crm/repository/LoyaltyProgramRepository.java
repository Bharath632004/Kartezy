package com.kartezy.crm.repository;

import com.kartezy.crm.entity.LoyaltyProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoyaltyProgramRepository extends JpaRepository<LoyaltyProgram, Long> {

    List<LoyaltyProgram> findByIsActiveTrue();

    List<LoyaltyProgram> findByEffectiveFromLessThanEqualAndEffectiveToGreaterThanEqual(
        java.time.LocalDate from, java.time.LocalDate to);
}
