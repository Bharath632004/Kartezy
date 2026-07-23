package com.kartezy.membershipservice.repository;

import com.kartezy.membershipservice.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, UUID> {
    Optional<Membership> findByUserIdAndStatus(UUID userId, String status);
    Optional<Membership> findTopByUserIdOrderByCreatedAtDesc(UUID userId);
}
