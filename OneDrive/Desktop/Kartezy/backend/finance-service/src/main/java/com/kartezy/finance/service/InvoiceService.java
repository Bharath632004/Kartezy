package com.kartezy.finance.service;

import com.kartezy.finance.constants.*;
import com.kartezy.finance.entity.*;
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
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoicePaymentRepository paymentRepository;
    private final AccountingService accountingService;
    private final AccountRepository accountRepository;
    private final AuditService auditService;

    @Transactional
    public Invoice createInvoice(Invoice invoice) {
        String invoiceNumber = "INV-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
            + "-" + System.currentTimeMillis() % 10000;

        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setStatus(InvoiceStatus.DRAFT);
        invoice.setBalanceAmount(invoice.getTotalAmount());

        Invoice saved = invoiceRepository.save(invoice);

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_INVOICE,
            saved.getId(), saved.getInvoiceNumber(), "System",
            null, "Created invoice: " + saved.getInvoiceNumber());

        return saved;
    }

    @Transactional
    public Invoice sendInvoice(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new FinanceException("Invoice not found: " + invoiceId));
        invoice.setStatus(InvoiceStatus.SENT);
        return invoiceRepository.save(invoice);
    }

    @Transactional
    public InvoicePayment recordPayment(Long invoiceId, BigDecimal amount, String paymentReference, String paymentMethod) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new FinanceException("Invoice not found: " + invoiceId));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new FinanceException("Invoice is already paid");
        }

        BigDecimal newPaidAmount = invoice.getPaidAmount().add(amount);
        BigDecimal newBalance = invoice.getTotalAmount().subtract(newPaidAmount);

        invoice.setPaidAmount(newPaidAmount);
        invoice.setBalanceAmount(newBalance);

        if (newBalance.compareTo(BigDecimal.ZERO) <= 0) {
            invoice.setStatus(InvoiceStatus.PAID);
            invoice.setPaidAt(java.time.LocalDateTime.now());
        } else {
            invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
        }

        invoiceRepository.save(invoice);

        InvoicePayment payment = InvoicePayment.builder()
            .invoice(invoice)
            .paymentDate(LocalDate.now())
            .paymentMethod(paymentMethod)
            .paymentReference(paymentReference)
            .amount(amount)
            .status("COMPLETED")
            .build();

        InvoicePayment saved = paymentRepository.save(payment);

        // Create journal entry for payment received
        createPaymentJournalEntry(invoice, amount);

        auditService.log(AuditAction.UPDATE, FinanceConstants.ENTITY_INVOICE,
            invoice.getId(), invoice.getInvoiceNumber(), "System",
            null, "Payment recorded: " + amount + " ref: " + paymentReference);

        return saved;
    }

    private void createPaymentJournalEntry(Invoice invoice, BigDecimal amount) {
        Account receivableAcct = accountRepository.findByAccountCode(FinanceConstants.RECEIVABLE_CODE).orElse(null);
        Account cashAcct = accountRepository.findByAccountCode(FinanceConstants.CASH_ACCOUNT_CODE).orElse(null);

        if (receivableAcct == null || cashAcct == null) return;

        JournalEntry entry = JournalEntry.builder()
            .entryNumber("JE-INV-" + invoice.getInvoiceNumber())
            .entryDate(LocalDate.now())
            .entryType(JournalEntryType.STANDARD)
            .description("Payment for invoice: " + invoice.getInvoiceNumber())
            .referenceNumber(invoice.getInvoiceNumber())
            .referenceType("INVOICE_PAYMENT")
            .build();

        JournalEntryLine debitLine = JournalEntryLine.builder()
            .account(cashAcct)
            .description("Payment received")
            .debitAmount(amount)
            .creditAmount(BigDecimal.ZERO)
            .build();

        JournalEntryLine creditLine = JournalEntryLine.builder()
            .account(receivableAcct)
            .description("Invoice payment applied")
            .debitAmount(BigDecimal.ZERO)
            .creditAmount(amount)
            .build();

        accountingService.createJournalEntry(entry, List.of(debitLine, creditLine));
    }

    @Transactional(readOnly = true)
    public Page<Invoice> getInvoices(Long merchantId, Long vendorId, InvoiceStatus status, Pageable pageable) {
        if (merchantId != null) return invoiceRepository.findByMerchantIdOrderByInvoiceDateDesc(merchantId, pageable);
        if (vendorId != null) return invoiceRepository.findByVendorIdOrderByInvoiceDateDesc(vendorId, pageable);
        if (status != null) return invoiceRepository.findByStatus(status, pageable);
        return invoiceRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Invoice getInvoice(Long id) {
        return invoiceRepository.findById(id)
            .orElseThrow(() -> new FinanceException("Invoice not found: " + id));
    }

    @Transactional
    public Invoice cancelInvoice(Long invoiceId, String reason) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new FinanceException("Invoice not found: " + invoiceId));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new FinanceException("Cannot cancel a paid invoice");
        }

        invoice.setStatus(InvoiceStatus.CANCELLED);
        invoice.setNotes(invoice.getNotes() + "\nCancelled: " + reason);
        return invoiceRepository.save(invoice);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalOutstanding() {
        return invoiceRepository.getTotalOutstanding();
    }

    @Transactional(readOnly = true)
    public BigDecimal getMerchantOutstanding(Long merchantId) {
        return invoiceRepository.getMerchantOutstanding(merchantId);
    }
}
