package com.kartezy.finance.repository;

import com.kartezy.finance.constants.JournalEntryType;
import com.kartezy.finance.entity.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {

    Optional<JournalEntry> findByEntryNumber(String entryNumber);

    Page<JournalEntry> findByEntryDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    List<JournalEntry> findJournalEntriesByDateBetween(LocalDate startDate, LocalDate endDate);

    List<JournalEntry> findByEntryType(JournalEntryType entryType);

    List<JournalEntry> findByStatus(String status);

    @Query("SELECT j FROM JournalEntry j WHERE j.referenceNumber = :refNumber AND j.referenceType = :refType")
    List<JournalEntry> findByReference(@Param("refNumber") String refNumber, @Param("refType") String refType);

    @Query("SELECT j FROM JournalEntry j WHERE j.entryDate >= :from AND j.entryDate <= :to AND j.isBalanced = true ORDER BY j.entryDate")
    List<JournalEntry> findBalancedEntriesBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT COUNT(j) FROM JournalEntry j WHERE j.entryDate = :date")
    long countEntriesOnDate(@Param("date") LocalDate date);
}
