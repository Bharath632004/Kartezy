package com.kartezy.finance.service;

import com.kartezy.finance.constants.*;
import com.kartezy.finance.entity.*;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {

    @Mock private InvoiceRepository invoiceRepository;
    @Mock private InvoicePaymentRepository paymentRepository;
    @Mock private AccountingService accountingService;
    @Mock private AccountRepository accountRepository;
    @Mock private AuditService auditService;

    private InvoiceService invoiceService;

    @BeforeEach
    void setUp() {
        invoiceService = new InvoiceService(invoiceRepository, paymentRepository,
            accountingService, accountRepository, auditService);
    }

    @Test
    @DisplayName("Should create invoice with DRAFT status")
    void createInvoice_ShouldCreateDraft() {
        Invoice invoice = Invoice.builder()
            .merchantId(1L).totalAmount(BigDecimal.valueOf(50000))
            .build();

        when(invoiceRepository.save(any(Invoice.class)))
            .thenAnswer(inv -> { Invoice i = inv.getArgument(0); i.setId(1L); return i; });

        Invoice result = invoiceService.createInvoice(invoice);

        assertNotNull(result.getInvoiceNumber());
        assertEquals(InvoiceStatus.DRAFT, result.getStatus());
        assertEquals(BigDecimal.valueOf(50000), result.getTotalAmount());
        assertEquals(BigDecimal.valueOf(50000), result.getBalanceAmount());
    }

    @Test
    @DisplayName("Should send invoice")
    void sendInvoice_ShouldSetSentStatus() {
        Invoice invoice = Invoice.builder().id(1L).status(InvoiceStatus.DRAFT).build();
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));

        Invoice result = invoiceService.sendInvoice(1L);
        assertEquals(InvoiceStatus.SENT, result.getStatus());
    }

    @Test
    @DisplayName("Should record payment and update invoice status")
    void recordPayment_ShouldUpdateBalanceAndStatus() {
        Invoice invoice = Invoice.builder()
            .id(1L).invoiceNumber("INV-001")
            .totalAmount(BigDecimal.valueOf(50000))
            .paidAmount(BigDecimal.ZERO)
            .balanceAmount(BigDecimal.valueOf(50000))
            .status(InvoiceStatus.SENT)
            .build();

        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));
        when(paymentRepository.save(any(InvoicePayment.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        InvoicePayment payment = invoiceService.recordPayment(
            1L, BigDecimal.valueOf(30000), "PAY-REF-001", "BANK_TRANSFER");

        assertNotNull(payment);
        assertEquals(BigDecimal.valueOf(30000), invoice.getPaidAmount());
        assertEquals(BigDecimal.valueOf(20000), invoice.getBalanceAmount());
        assertEquals(InvoiceStatus.PARTIALLY_PAID, invoice.getStatus());
    }

    @Test
    @DisplayName("Should mark invoice as PAID when fully paid")
    void recordPayment_ShouldMarkPaid_WhenFullyPaid() {
        Invoice invoice = Invoice.builder()
            .id(1L).invoiceNumber("INV-002")
            .totalAmount(BigDecimal.valueOf(10000))
            .paidAmount(BigDecimal.ZERO)
            .balanceAmount(BigDecimal.valueOf(10000))
            .status(InvoiceStatus.SENT)
            .build();

        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));
        when(paymentRepository.save(any(InvoicePayment.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        invoiceService.recordPayment(1L, BigDecimal.valueOf(10000), "PAY-REF-002", "CASH");

        assertEquals(InvoiceStatus.PAID, invoice.getStatus());
        assertNotNull(invoice.getPaidAt());
    }

    @Test
    @DisplayName("Should throw when paying already paid invoice")
    void recordPayment_ShouldThrow_WhenAlreadyPaid() {
        Invoice invoice = Invoice.builder().id(1L).totalAmount(BigDecimal.valueOf(1000))
            .paidAmount(BigDecimal.valueOf(1000)).balanceAmount(BigDecimal.ZERO)
            .status(InvoiceStatus.PAID).build();
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));

        assertThrows(FinanceException.class,
            () -> invoiceService.recordPayment(1L, BigDecimal.valueOf(100), "REF", "CASH"));
    }

    @Test
    @DisplayName("Should cancel invoice")
    void cancelInvoice_ShouldSetCancelledStatus() {
        Invoice invoice = Invoice.builder().id(1L).status(InvoiceStatus.SENT).build();
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));

        Invoice result = invoiceService.cancelInvoice(1L, "Test cancellation");
        assertEquals(InvoiceStatus.CANCELLED, result.getStatus());
    }

    @Test
    @DisplayName("Should throw when cancelling paid invoice")
    void cancelInvoice_ShouldThrow_WhenPaid() {
        Invoice invoice = Invoice.builder().id(1L).status(InvoiceStatus.PAID).build();
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));

        assertThrows(FinanceException.class,
            () -> invoiceService.cancelInvoice(1L, "Cannot cancel"));
    }

    @Test
    @DisplayName("Should get total outstanding amount")
    void getTotalOutstanding_ShouldReturnAmount() {
        when(invoiceRepository.getTotalOutstanding())
            .thenReturn(BigDecimal.valueOf(125000));
        assertEquals(BigDecimal.valueOf(125000), invoiceService.getTotalOutstanding());
    }
}
