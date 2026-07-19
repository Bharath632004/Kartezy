package com.kartezy.finance.service;

import com.kartezy.finance.constants.*;
import com.kartezy.finance.entity.*;
import com.kartezy.finance.event.KafkaEventPublisher;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MerchantSettlementService {

    private final MerchantSettlementRepository settlementRepository;
    private final SettlementTransactionRepository settlementTransactionRepository;
    private final CommissionCalculationRepository commissionCalculationRepository;
    private final AccountingService accountingService;
    private final AccountRepository accountRepository;
    private final AuditService auditService;
    private final KafkaEventPublisher eventPublisher;

    @Transactional
    public MerchantSettlement createSettlement(Long merchantId, String merchantName,
                                                LocalDate cycleStart, LocalDate cycleEnd,
                                                List<SettlementTransaction> transactions) {
        String settlementNumber = "STL-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
            + "-" + System.currentTimeMillis() % 10000;

        BigDecimal totalOrderAmount = transactions.stream()
            .map(t -> t.getOrderAmount() != null ? t.getOrderAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCommission = transactions.stream()
            .map(t -> t.getCommissionAmount() != null ? t.getCommissionAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDeliveryFee = transactions.stream()
            .map(t -> t.getDeliveryFee() != null ? t.getDeliveryFee() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPlatformFee = transactions.stream()
            .map(t -> t.getPlatformFee() != null ? t.getPlatformFee() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalGst = transactions.stream()
            .map(t -> t.getGstAmount() != null ? t.getGstAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTds = transactions.stream()
            .map(t -> t.getTdsAmount() != null ? t.getTdsAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalAdjustments = transactions.stream()
            .map(t -> t.getAdjustmentAmount() != null ? t.getAdjustmentAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netAmount = totalOrderAmount
            .subtract(totalCommission)
            .subtract(totalDeliveryFee)
            .subtract(totalPlatformFee)
            .subtract(totalGst)
            .subtract(totalTds)
            .add(totalAdjustments)
            .setScale(2, RoundingMode.HALF_UP);

        MerchantSettlement settlement = MerchantSettlement.builder()
            .settlementNumber(settlementNumber)
            .merchantId(merchantId)
            .merchantName(merchantName)
            .cycleStartDate(cycleStart)
            .cycleEndDate(cycleEnd)
            .settlementDate(LocalDate.now())
            .status(SettlementStatus.PENDING)
            .totalOrderAmount(totalOrderAmount)
            .totalCommission(totalCommission)
            .totalDeliveryFees(totalDeliveryFee)
            .totalPlatformFees(totalPlatformFee)
            .totalGst(totalGst)
            .totalTds(totalTds)
            .totalAdjustments(totalAdjustments)
            .netSettlementAmount(netAmount)
            .orderCount(transactions.size())
            .build();

        MerchantSettlement saved = settlementRepository.save(settlement);

        for (SettlementTransaction txn : transactions) {
            txn.setSettlement(saved);
            settlementTransactionRepository.save(txn);
        }

        // Create journal entries for the settlement
        createSettlementJournalEntries(saved, totalOrderAmount, totalCommission, totalDeliveryFee, totalPlatformFee, totalGst, netAmount);

        // Publish settlement event
        eventPublisher.publishSettlementEvent(saved);

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_SETTLEMENT,
            saved.getId(), saved.getSettlementNumber(), "System",
            null, "Created settlement for merchant: " + merchantName);

        return saved;
    }

    @Transactional
    public MerchantSettlement processSettlement(Long settlementId, Long bankAccountId) {
        MerchantSettlement settlement = settlementRepository.findById(settlementId)
            .orElseThrow(() -> new FinanceException("Settlement not found: " + settlementId));

        if (settlement.getStatus() != SettlementStatus.PENDING) {
            throw new FinanceException("Settlement is not in PENDING status");
        }

        settlement.setStatus(SettlementStatus.PROCESSING);
        settlement.setBankAccountId(bankAccountId);
        settlement.setProcessedAt(LocalDateTime.now());
        settlement = settlementRepository.save(settlement);

        auditService.log(AuditAction.UPDATE, FinanceConstants.ENTITY_SETTLEMENT,
            settlement.getId(), settlement.getSettlementNumber(), "System",
            "PENDING", "PROCESSING");

        return settlement;
    }

    @Transactional
    public MerchantSettlement completeSettlement(Long settlementId, String paymentReference) {
        MerchantSettlement settlement = settlementRepository.findById(settlementId)
            .orElseThrow(() -> new FinanceException("Settlement not found: " + settlementId));

        settlement.setStatus(SettlementStatus.COMPLETED);
        settlement.setPaymentReference(paymentReference);
        settlement = settlementRepository.save(settlement);

        eventPublisher.publishSettlementEvent(settlement);

        return settlement;
    }

    @Transactional(readOnly = true)
    public Page<MerchantSettlement> getMerchantSettlements(Long merchantId, Pageable pageable) {
        return settlementRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId, pageable);
    }

    @Transactional(readOnly = true)
    public List<MerchantSettlement> getPendingSettlements() {
        return settlementRepository.findByStatus(SettlementStatus.PENDING);
    }

    private void createSettlementJournalEntries(MerchantSettlement settlement, BigDecimal totalOrderAmount,
                                                 BigDecimal totalCommission, BigDecimal totalDeliveryFee,
                                                 BigDecimal totalPlatformFee, BigDecimal totalGst,
                                                 BigDecimal netAmount) {
        // Debit: Settlement Receivable (Asset)
        // Credit: Merchant Payable (Liability) for net amount
        // Various expense/income accounts for deductions

        Account receivableAcct = accountRepository.findByAccountCode(FinanceConstants.RECEIVABLE_CODE)
            .orElse(null);
        Account payableAcct = accountRepository.findByAccountCode(FinanceConstants.PAYABLE_CODE)
            .orElse(null);
        Account commissionRevenueAcct = accountRepository.findByAccountCode(FinanceConstants.COMMISSION_REVENUE_CODE)
            .orElse(null);
        Account platformFeeAcct = accountRepository.findByAccountCode(FinanceConstants.PLATFORM_FEE_CODE)
            .orElse(null);
        Account deliveryFeeAcct = accountRepository.findByAccountCode(FinanceConstants.DELIVERY_FEE_CODE)
            .orElse(null);
        Account gstPayableAcct = accountRepository.findByAccountCode(FinanceConstants.GST_PAYABLE_CODE)
            .orElse(null);

        if (receivableAcct == null || payableAcct == null) {
            log.warn("Required accounts not found for settlement journal entry");
            return;
        }

        JournalEntry entry = JournalEntry.builder()
            .entryNumber("JE-" + settlement.getSettlementNumber())
            .entryDate(LocalDate.now())
            .entryType(JournalEntryType.STANDARD)
            .description("Settlement: " + settlement.getSettlementNumber() + " - Merchant: " + settlement.getMerchantName())
            .referenceNumber(settlement.getSettlementNumber())
            .referenceType("SETTLEMENT")
            .build();

        List<JournalEntryLine> lines = new java.util.ArrayList<>();

        // Debit receivable for total order amount
        lines.add(JournalEntryLine.builder()
            .account(receivableAcct)
            .description("Settlement receivable")
            .debitAmount(netAmount)
            .creditAmount(BigDecimal.ZERO)
            .referenceId(settlement.getSettlementNumber())
            .referenceType("SETTLEMENT")
            .build());

        // Credit merchant payable
        lines.add(JournalEntryLine.builder()
            .account(payableAcct)
            .description("Merchant payable")
            .debitAmount(BigDecimal.ZERO)
            .creditAmount(netAmount)
            .referenceId(settlement.getSettlementNumber())
            .referenceType("SETTLEMENT")
            .build());

        // Commission revenue
        if (commissionRevenueAcct != null && totalCommission.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(JournalEntryLine.builder()
                .account(commissionRevenueAcct)
                .description("Platform commission")
                .debitAmount(BigDecimal.ZERO)
                .creditAmount(totalCommission)
                .build());
        }

        // Platform fee revenue
        if (platformFeeAcct != null && totalPlatformFee.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(JournalEntryLine.builder()
                .account(platformFeeAcct)
                .description("Platform fees")
                .debitAmount(BigDecimal.ZERO)
                .creditAmount(totalPlatformFee)
                .build());
        }

        // Delivery fee revenue
        if (deliveryFeeAcct != null && totalDeliveryFee.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(JournalEntryLine.builder()
                .account(deliveryFeeAcct)
                .description("Delivery fees")
                .debitAmount(BigDecimal.ZERO)
                .creditAmount(totalDeliveryFee)
                .build());
        }

        // GST payable
        if (gstPayableAcct != null && totalGst.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(JournalEntryLine.builder()
                .account(gstPayableAcct)
                .description("GST collected")
                .debitAmount(BigDecimal.ZERO)
                .creditAmount(totalGst)
                .build());
        }

        accountingService.createJournalEntry(entry, lines);
    }
}
