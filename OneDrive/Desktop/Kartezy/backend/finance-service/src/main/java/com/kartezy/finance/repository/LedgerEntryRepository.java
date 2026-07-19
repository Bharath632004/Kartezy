package com.kartezy.finance.repository;

import com.kartezy.finance.constants.TransactionType;
import com.kartezy.finance.entity.LedgerEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, Long> {

    Page<LedgerEntry> findByAccountIdOrderByEntryDateDesc(Long accountId, Pageable pageable);

    List<LedgerEntry> findByAccountIdAndEntryDateBetweenOrderByEntryDateAsc(Long accountId, LocalDate start, LocalDate end);

    List<LedgerEntry> findByReferenceNumber(String referenceNumber);

    @Query("SELECT l FROM LedgerEntry l WHERE l.account.id = :accountId AND l.entryDate >= :from AND l.entryDate <= :to ORDER BY l.entryDate ASC")
    List<LedgerEntry> getAccountStatement(@Param("accountId") Long accountId, @Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT COALESCE(SUM(l.debitAmount), 0) FROM LedgerEntry l WHERE l.account.id = :accountId AND l.entryDate <= :date")
    BigDecimal getBalanceUpToDate(@Param("accountId") Long accountId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(l.debitAmount - l.creditAmount), 0) FROM LedgerEntry l WHERE l.account.id = :accountId")
    BigDecimal getAccountBalance(@Param("accountId") Long accountId);

    @Query("SELECT l FROM LedgerEntry l WHERE l.reconciled = false AND l.account.isBankAccount = true ORDER BY l.entryDate")
    List<LedgerEntry> findUnreconciledBankEntries();

    @Query("SELECT l FROM LedgerEntry l WHERE l.transactionType = :type ORDER BY l.entryDate DESC")
    List<LedgerEntry> findByTransactionType(@Param("type") TransactionType type);

    long countByAccountIdAndEntryDateBetween(Long accountId, LocalDate start, LocalDate end);
}
