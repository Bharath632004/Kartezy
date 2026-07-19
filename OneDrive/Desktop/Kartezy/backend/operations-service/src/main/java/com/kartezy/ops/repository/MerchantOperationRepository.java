package com.kartezy.ops.repository;

import com.kartezy.ops.entity.MerchantOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantOperationRepository extends JpaRepository<MerchantOperation, Long> {
    Optional<MerchantOperation> findByMerchantId(Long merchantId);
    List<MerchantOperation> findByVerificationStatus(String status);
    List<MerchantOperation> findByCityId(Long cityId);
    List<MerchantOperation> findByIsActiveTrue();
    long countByVerificationStatus(String status);
    
    @Query("SELECT m.verificationStatus, COUNT(m) FROM MerchantOperation m GROUP BY m.verificationStatus")
    List<Object[]> countByVerificationStatus();
    
    @Query("SELECT m.businessType, COUNT(m) FROM MerchantOperation m GROUP BY m.businessType")
    List<Object[]> countByBusinessType();
}
