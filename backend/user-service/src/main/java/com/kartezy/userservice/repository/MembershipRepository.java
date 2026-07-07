package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for managing Membership entities.
 */
@Repository
public interface MembershipRepository extends JpaRepository<Membership, UUID>, JpaSpecificationExecutor<Membership> {
}