package com.kartezy.financeservice.service;

import com.kartezy.financeservice.dto.InvoiceDto;
import com.kartezy.financeservice.dto.SettlementDto;
import com.kartezy.financeservice.dto.TransactionDto;
import com.kartezy.financeservice.entity.Invoice;
import com.kartezy.financeservice.entity.Settlement;
import com.kartezy.financeservice.entity.Transaction;
import com.kartezy.financeservice.repository.InvoiceRepository;
import com.kartezy.financeservice.repository.SettlementRepository;
import com.kartezy.financeservice.repository.TransactionRepository;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FinanceService {

    private final TransactionRepository transactionRepository;
    private final InvoiceRepository invoiceRepository;
    private final SettlementRepository settlementRepository;

    // ========== Transactions ==========

    @Transactional
    public TransactionDto createTransaction(TransactionDto request) {
        Transaction txn = Transaction.builder()
            .transactionType(request.getTransactionType())
            .amount(request.getAmount())
            .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
            .status("PENDING")
            .userId(request.getUserId())
            .merchantId(request.getMerchantId())
            .orderId(request.getOrderId())
            .referenceId(request.getReferenceId())
            .referenceType(request.getReferenceType())
            .description(request.getDescription())
            .build();
        txn = transactionRepository.save(txn);
        log.info("Transaction created: {} type={} amount={}", txn.getTransactionNumber(), txn.getTransactionType(), txn.getAmount());
        return toTransactionDto(txn);
    }

    @Transactional
    public TransactionDto completeTransaction(UUID id) {
        Transaction txn = transactionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + id));
        txn.setStatus("COMPLETED");
        txn.setCompletedAt(LocalDateTime.now());
        txn = transactionRepository.save(txn);
        log.info("Transaction completed: {}", txn.getTransactionNumber());
        return toTransactionDto(txn);
    }

    public TransactionDto getTransaction(UUID id) {
        return toTransactionDto(transactionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + id)));
    }

    public List<TransactionDto> getUserTransactions(UUID userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toTransactionDto).collect(Collectors.toList());
    }

    public List<TransactionDto> getMerchantTransactions(UUID merchantId) {
        return transactionRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId)
            .stream().map(this::toTransactionDto).collect(Collectors.toList());
    }

    // ========== Invoices ==========

    @Transactional
    public InvoiceDto createInvoice(InvoiceDto request) {
        Invoice invoice = Invoice.builder()
            .orderId(request.getOrderId())
            .merchantId(request.getMerchantId())
            .userId(request.getUserId())
            .amount(request.getAmount())
            .tax(request.getTax())
            .totalAmount(request.getTotalAmount() != null ? request.getTotalAmount() : request.getAmount())
            .status("DRAFT")
            .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
            .notes(request.getNotes())
            .dueDate(request.getDueDate())
            .build();
        invoice = invoiceRepository.save(invoice);
        log.info("Invoice created: {}", invoice.getInvoiceNumber());
        return toInvoiceDto(invoice);
    }

    public InvoiceDto getInvoice(UUID id) {
        return toInvoiceDto(invoiceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id)));
    }

    public List<InvoiceDto> getMerchantInvoices(UUID merchantId) {
        return invoiceRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId)
            .stream().map(this::toInvoiceDto).collect(Collectors.toList());
    }

    // ========== Settlements ==========

    @Transactional
    public SettlementDto createSettlement(SettlementDto request) {
        Settlement settlement = Settlement.builder()
            .merchantId(request.getMerchantId())
            .totalAmount(request.getTotalAmount())
            .commissionAmount(request.getCommissionAmount())
            .netAmount(request.getNetAmount())
            .adjustmentAmount(request.getAdjustmentAmount())
            .status("PENDING")
            .settlementPeriod(request.getSettlementPeriod())
            .bankAccountNumber(request.getBankAccountNumber())
            .bankIfscCode(request.getBankIfscCode())
            .notes(request.getNotes())
            .build();
        settlement = settlementRepository.save(settlement);
        log.info("Settlement created: {} for merchant={}", settlement.getSettlementNumber(), settlement.getMerchantId());
        return toSettlementDto(settlement);
    }

    public List<SettlementDto> getMerchantSettlements(UUID merchantId) {
        return settlementRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId)
            .stream().map(this::toSettlementDto).collect(Collectors.toList());
    }

    // ========== Mappers ==========

    private TransactionDto toTransactionDto(Transaction txn) {
        return TransactionDto.builder()
            .id(txn.getId()).transactionNumber(txn.getTransactionNumber())
            .transactionType(txn.getTransactionType()).amount(txn.getAmount())
            .currency(txn.getCurrency()).status(txn.getStatus())
            .userId(txn.getUserId()).merchantId(txn.getMerchantId())
            .orderId(txn.getOrderId()).referenceId(txn.getReferenceId())
            .referenceType(txn.getReferenceType()).description(txn.getDescription())
            .createdAt(txn.getCreatedAt()).completedAt(txn.getCompletedAt()).build();
    }

    private InvoiceDto toInvoiceDto(Invoice inv) {
        return InvoiceDto.builder()
            .id(inv.getId()).invoiceNumber(inv.getInvoiceNumber())
            .orderId(inv.getOrderId()).merchantId(inv.getMerchantId())
            .userId(inv.getUserId()).amount(inv.getAmount()).tax(inv.getTax())
            .totalAmount(inv.getTotalAmount()).status(inv.getStatus())
            .currency(inv.getCurrency()).notes(inv.getNotes())
            .createdAt(inv.getCreatedAt()).updatedAt(inv.getUpdatedAt())
            .paidAt(inv.getPaidAt()).dueDate(inv.getDueDate()).build();
    }

    private SettlementDto toSettlementDto(Settlement s) {
        return SettlementDto.builder()
            .id(s.getId()).settlementNumber(s.getSettlementNumber())
            .merchantId(s.getMerchantId()).totalAmount(s.getTotalAmount())
            .commissionAmount(s.getCommissionAmount()).netAmount(s.getNetAmount())
            .adjustmentAmount(s.getAdjustmentAmount()).status(s.getStatus())
            .settlementPeriod(s.getSettlementPeriod())
            .bankAccountNumber(s.getBankAccountNumber())
            .bankIfscCode(s.getBankIfscCode()).notes(s.getNotes())
            .createdAt(s.getCreatedAt()).settledAt(s.getSettledAt()).build();
    }
}
