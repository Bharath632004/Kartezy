package com.kartezy.finance.repository;

import com.kartezy.finance.constants.AccountSubType;
import com.kartezy.finance.constants.AccountType;
import com.kartezy.finance.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountCode(String accountCode);

    List<Account> findByAccountType(AccountType accountType);

    List<Account> findByAccountSubType(AccountSubType accountSubType);

    List<Account> findByParentAccountId(Long parentId);

    List<Account> findByIsActiveTrue();

    @Query("SELECT a FROM Account a WHERE a.isActive = true AND a.isDeleted = false ORDER BY a.accountCode")
    List<Account> findAllActiveAccounts();

    @Query("SELECT a FROM Account a WHERE a.parentAccount IS NULL AND a.isActive = true ORDER BY a.accountCode")
    List<Account> findRootAccounts();

    @Query("SELECT a FROM Account a WHERE a.isBankAccount = true AND a.isActive = true")
    List<Account> findBankAccounts();

    @Query("SELECT a FROM Account a WHERE a.accountCode LIKE :prefix% ORDER BY a.accountCode")
    List<Account> findByAccountCodePrefix(@Param("prefix") String prefix);

    @Query("SELECT a FROM Account a WHERE a.level = :level AND a.isActive = true ORDER BY a.accountCode")
    List<Account> findByLevel(@Param("level") Integer level);

    @Query("SELECT COALESCE(SUM(l.creditAmount - l.debitAmount), 0) FROM LedgerEntry l WHERE l.account.id = :accountId")
    java.math.BigDecimal getAccountBalance(@Param("accountId") Long accountId);
}
