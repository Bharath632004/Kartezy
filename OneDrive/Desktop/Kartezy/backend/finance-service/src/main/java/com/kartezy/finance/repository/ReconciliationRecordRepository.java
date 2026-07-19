package com.kartezy.finance.repository;

import com.kartezy.finance.constants.ReconciliationStatus;
import com.kartezy.finance.entity.ReconciliationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReconciliationRecordRepository extends JpaRepository<ReconciliationRecord, Long> {

    List<ReconciliationRecord> findByBankTransactionId(Long bankTransactionId);

    List<ReconciliationRecord> findBySystemTransactionId(Long systemTransactionId);

    List<ReconciliationRecord> findByStatus(ReconciliationStatus status);

    List<ReconciliationRecord> findByIsAutoMatchedTrue();

    long countByStatus(ReconciliationStatus status);
}
