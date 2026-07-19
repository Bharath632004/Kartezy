package com.kartezy.finance.service;

import com.kartezy.finance.constants.AuditAction;
import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.constants.TransactionType;
import com.kartezy.finance.entity.*;
import com.kartezy.finance.event.KafkaEventPublisher;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.RefundRecordRepository;
import com.kartezy.finance.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefundService {

    private final RefundRecordRepository refundRepository;
    private final AccountingService accountingService;
    private final AccountRepository accountRepository;
    private final AuditService auditService;
    private final KafkaEventPublisher eventPublisher;

    @Transactional
    public RefundRecord processRefund(RefundRecord record) {
        String refundNumber = "RFD-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
            + "-" + System.currentTimeMillis() % 10000;
        record.setRefundNumber(refundNumber);
        record.setStatus("PENDING_APPROVAL");

        // Calculate net refund amount
        BigDecimal netRefund = record.getRefundAmount();
        if (record.getCommissionReversal() != null) netRefund = netRefund.subtract(record.getCommissionReversal());
        if (record.getDeliveryFeeReversal() != null) netRefund = netRefund.subtract(record.getDeliveryFeeReversal());
        if (record.getPlatformFeeReversal() != null) netRefund = netRefund.subtract(record.getPlatformFeeReversal());
        if (record.getGstReversal() != null) netRefund = netRefund.subtract(record.getGstReversal());
        record.setNetRefundAmount(netRefund);

        RefundRecord saved = refundRepository.save(record);

        // Create journal entries for refund accounting
        createRefundJournalEntries(saved);

        // Publish refund event
        eventPublisher.publishFinanceEvent("REFUND_PROCESSED", Map.of(
            "refundId", saved.getId(),
            "refundNumber", saved.getRefundNumber(),
            "orderId", saved.getOrderId(),
            "amount", saved.getRefundAmount(),
            "status", saved.getStatus()
        ));

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_REFUND,
            saved.getId(), saved.getRefundNumber(), "System",
            null, "Refund processed: " + saved.getRefundNumber());

        return saved;
    }

    @Transactional
    public RefundRecord approveRefund(Long refundId, String approvedBy) {
        RefundRecord record = refundRepository.findById(refundId)
            .orElseThrow(() -> new FinanceException("Refund not found: " + refundId));
        record.setStatus("APPROVED");
        record.setApprovedBy(approvedBy);
        record.setApprovedAt(java.time.LocalDateTime.now());
        return refundRepository.save(record);
    }

    @Transactional
    public RefundRecord completeRefund(Long refundId, String paymentRef) {
        RefundRecord record = refundRepository.findById(refundId)
            .orElseThrow(() -> new FinanceException("Refund not found: " + refundId));
        record.setStatus("COMPLETED");
        record.setPaymentReference(paymentRef);
        record.setProcessedAt(java.time.LocalDateTime.now());
        return refundRepository.save(record);
    }

    private void createRefundJournalEntries(RefundRecord record) {
        Account cashAccount = accountRepository.findByAccountCode(FinanceConstants.CASH_ACCOUNT_CODE).orElse(null);
        Account receivableAccount = accountRepository.findByAccountCode(FinanceConstants.RECEIVABLE_CODE).orElse(null);
        Account commissionRevenueAccount = accountRepository.findByAccountCode(FinanceConstants.COMMISSION_REVENUE_CODE).orElse(null);
        Account gstPayableAccount = accountRepository.findByAccountCode(FinanceConstants.GST_PAYABLE_CODE).orElse(null);

        if (cashAccount == null || receivableAccount == null) return;

        JournalEntry entry = JournalEntry.builder()
            .entryNumber("JE-RFD-" + record.getRefundNumber())
            .entryDate(LocalDate.now())
            .entryType(com.kartezy.finance.constants.JournalEntryType.STANDARD)
            .description("Refund: " + record.getRefundNumber() + " for order " + record.getOrderNumber())
            .referenceNumber(record.getRefundNumber())
            .referenceType("REFUND")
            .build();

        java.util.List<JournalEntryLine> lines = new java.util.ArrayList<>();

        // Credit: Cash (refund paid out)
        lines.add(JournalEntryLine.builder()
            .account(cashAccount)
            .description("Refund paid")
            .debitAmount(BigDecimal.ZERO)
            .creditAmount(record.getNetRefundAmount())
            .build());

        // Debit: Receivable (reversal of revenue)
        lines.add(JournalEntryLine.builder()
            .account(receivableAccount)
            .description("Refund receivable reversal")
            .debitAmount(record.getNetRefundAmount())
            .creditAmount(BigDecimal.ZERO)
            .build());

        // If commission reversal
        if (record.getCommissionReversal() != null && record.getCommissionReversal().compareTo(BigDecimal.ZERO) > 0
            && commissionRevenueAccount != null) {
            lines.add(JournalEntryLine.builder()
                .account(commissionRevenueAccount)
                .description("Commission reversal")
                .debitAmount(record.getCommissionReversal())
                .creditAmount(BigDecimal.ZERO)
                .build());
        }

        // GST reversal
        if (record.getGstReversal() != null && record.getGstReversal().compareTo(BigDecimal.ZERO) > 0
            && gstPayableAccount != null) {
            lines.add(JournalEntryLine.builder()
                .account(gstPayableAccount)
                .description("GST reversal")
                .debitAmount(record.getGstReversal())
                .creditAmount(BigDecimal.ZERO)
                .build());
        }

        accountingService.createJournalEntry(entry, lines);
    }

    @Transactional(readOnly = true)
    public Page<RefundRecord> getOrderRefunds(Long orderId, Pageable pageable) {
        return refundRepository.findByOrderIdOrderByCreatedAtDesc(orderId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<RefundRecord> getMerchantRefunds(Long merchantId, Pageable pageable) {
        return refundRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId, pageable);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRefundStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalRefunded", refundRepository.getTotalRefundedAmount());
        stats.put("completedRefunds", refundRepository.countByStatus("COMPLETED"));
        stats.put("pendingRefunds", refundRepository.countByStatus("PENDING_APPROVAL"));
        stats.put("processingRefunds", refundRepository.countByStatus("PROCESSING"));
        return stats;
    }
}
