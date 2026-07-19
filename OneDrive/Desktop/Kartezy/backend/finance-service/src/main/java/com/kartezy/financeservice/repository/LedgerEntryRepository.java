package com.kartezy.financeservice.repository;
import com.kartezy.financeservice.entity.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, UUID> {
    List<LedgerEntry> findByAccountIdOrderByEntryDateDesc(String accountId);
}
