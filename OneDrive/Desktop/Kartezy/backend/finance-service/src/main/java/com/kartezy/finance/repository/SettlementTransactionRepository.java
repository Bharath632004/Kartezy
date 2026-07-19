package com.kartezy.finance.repository;

import com.kartezy.finance.entity.SettlementTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementTransactionRepository extends JpaRepository<SettlementTransaction, Long> {

    List<SettlementTransaction> findBySettlementId(Long settlementId);

    List<SettlementTransaction> findByOrderId(Long orderId);

    long countBySettlementId(Long settlementId);
}
