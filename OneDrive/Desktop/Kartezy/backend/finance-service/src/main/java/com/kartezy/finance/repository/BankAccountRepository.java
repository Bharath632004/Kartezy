package com.kartezy.finance.repository;

import com.kartezy.finance.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

    List<BankAccount> findByEntityTypeAndEntityId(String entityType, Long entityId);

    List<BankAccount> findByIsPrimaryTrueAndEntityTypeAndEntityId(String entityType, Long entityId);

    List<BankAccount> findByIfscCode(String ifscCode);

    List<BankAccount> findByIsActiveTrue();
}
