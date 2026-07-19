package com.kartezy.finance.repository;

import com.kartezy.finance.entity.JournalEntryLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JournalEntryLineRepository extends JpaRepository<JournalEntryLine, Long> {

    List<JournalEntryLine> findByJournalEntryId(Long journalEntryId);

    List<JournalEntryLine> findByAccountId(Long accountId);

    @Query("SELECT COALESCE(SUM(j.debitAmount), 0) FROM JournalEntryLine j WHERE j.account.id = :accountId")
    BigDecimal sumDebitsByAccountId(@Param("accountId") Long accountId);

    @Query("SELECT COALESCE(SUM(j.creditAmount), 0) FROM JournalEntryLine j WHERE j.account.id = :accountId")
    BigDecimal sumCreditsByAccountId(@Param("accountId") Long accountId);
}
