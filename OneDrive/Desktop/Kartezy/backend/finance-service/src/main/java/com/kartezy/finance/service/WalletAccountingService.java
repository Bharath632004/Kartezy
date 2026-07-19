package com.kartezy.finance.service;

import com.kartezy.finance.constants.AuditAction;
import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.entity.*;
import com.kartezy.finance.event.KafkaEventPublisher;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletAccountingService {

    private final WalletTransactionRepository walletTransactionRepository;
    private final AccountingService accountingService;
    private final AccountRepository accountRepository;
    private final AuditService auditService;
    private final KafkaEventPublisher eventPublisher;

    @Transactional
    public WalletTransaction recordWalletTransaction(WalletTransaction transaction) {
        transaction.setStatus("RECORDED");
        WalletTransaction saved = walletTransactionRepository.save(transaction);

        // Create corresponding journal entry
        Account walletAccount = accountRepository.findByAccountCode(FinanceConstants.WALLET_ACCOUNT_CODE)
            .orElse(null);

        if (walletAccount != null) {
            JournalEntry entry = JournalEntry.builder()
                .entryNumber("JE-WLT-" + saved.getId())
                .entryDate(java.time.LocalDate.now())
                .entryType(com.kartezy.finance.constants.JournalEntryType.STANDARD)
                .description("Wallet tx: " + transaction.getDescription())
                .referenceNumber(transaction.getReferenceNumber())
                .referenceType("WALLET")
                .build();

            JournalEntryLine debitLine = JournalEntryLine.builder()
                .account(walletAccount)
                .description("Wallet transaction")
                .debitAmount("CREDIT".equals(transaction.getTransactionType()) ? transaction.getAmount() : BigDecimal.ZERO)
                .creditAmount("DEBIT".equals(transaction.getTransactionType()) ? transaction.getAmount() : BigDecimal.ZERO)
                .referenceId(String.valueOf(saved.getId()))
                .referenceType("WALLET_TRANSACTION")
                .build();

            accountingService.createJournalEntry(entry, java.util.List.of(debitLine));
        }

        // Sync with wallet-service via Kafka
        eventPublisher.publishWalletEvent(saved);

        return saved;
    }

    @Transactional
    public WalletTransaction reconcileWalletTransaction(Long walletTransactionId, Long journalEntryId) {
        WalletTransaction txn = walletTransactionRepository.findById(walletTransactionId)
            .orElseThrow(() -> new FinanceException("Wallet transaction not found"));
        txn.setIsReconciled(true);
        txn.setJournalEntryId(journalEntryId);
        return walletTransactionRepository.save(txn);
    }

    @Transactional(readOnly = true)
    public Page<WalletTransaction> getMerchantWalletTransactions(Long merchantId, Pageable pageable) {
        return walletTransactionRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<WalletTransaction> getCustomerWalletTransactions(Long customerId, Pageable pageable) {
        return walletTransactionRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
    }
}
