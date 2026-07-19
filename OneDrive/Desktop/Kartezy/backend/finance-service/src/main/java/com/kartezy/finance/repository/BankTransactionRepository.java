package com.kartezy.finance.repository;

import com.kartezy.finance.entity.BankTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BankTransactionRepository extends JpaRepository<BankTransaction, Long> {

    Page<BankTransaction> findByBankAccountIdOrderByTransactionDateDesc(Long bankAccountId, Pageable pageable);

    List<BankTransaction> findByBankAccountIdAndTransactionDateBetween(Long bankAccountId, LocalDate start, LocalDate end);

    List<BankTransaction> findByIsReconciledFalseAndBankAccountId(Long bankAccountId);

    List<BankTransaction> findByBankReference(String bankReference);

    @Query("SELECT bt FROM BankTransaction bt WHERE bt.bankAccount.id = :accountId AND bt.isReconciled = false ORDER BY bt.transactionDate")
    List<BankTransaction> findUnreconciledByBankAccountId(@Param("accountId") Long accountId);

    long countByBankAccountIdAndIsReconciledFalse(Long bankAccountId);
}
