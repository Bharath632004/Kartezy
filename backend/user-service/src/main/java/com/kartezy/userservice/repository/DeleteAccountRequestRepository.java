package com.kartezy.userservice.repository;
import com.kartezy.userservice.entity.DeleteAccountRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.UUID;
/**
 * Repository for managing DeleteAccountRequest entities.
 */
@Repository
public interface DeleteAccountRequestRepository extends JpaRepository<DeleteAccountRequest, UUID>, JpaSpecificationExecutor<DeleteAccountRequest> {
}