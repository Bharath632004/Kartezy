package com.kartezy.ops.repository;

import com.kartezy.ops.entity.CustomerOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerOperationRepository extends JpaRepository<CustomerOperation, Long> {
    Optional<CustomerOperation> findByCustomerId(Long customerId);
    List<CustomerOperation> findByKycStatus(String kycStatus);
    List<CustomerOperation> findByIsBlacklistedTrue();
    List<CustomerOperation> findByCityId(Long cityId);
    
    @Query("SELECT c.kycStatus, COUNT(c) FROM CustomerOperation c GROUP BY c.kycStatus")
    List<Object[]> countByKycStatus();
}
