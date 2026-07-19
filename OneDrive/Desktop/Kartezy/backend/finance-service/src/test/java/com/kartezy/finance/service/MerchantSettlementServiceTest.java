package com.kartezy.finance.service;

import com.kartezy.finance.constants.*;
import com.kartezy.finance.entity.*;
import com.kartezy.finance.event.KafkaEventPublisher;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MerchantSettlementServiceTest {

    @Mock private MerchantSettlementRepository settlementRepository;
    @Mock private SettlementTransactionRepository settlementTransactionRepository;
    @Mock private CommissionCalculationRepository commissionCalculationRepository;
    @Mock private AccountingService accountingService;
    @Mock private AccountRepository accountRepository;
    @Mock private AuditService auditService;
    @Mock private KafkaEventPublisher eventPublisher;

    private MerchantSettlementService settlementService;

    @BeforeEach
    void setUp() {
        settlementService = new MerchantSettlementService(
            settlementRepository, settlementTransactionRepository,
            commissionCalculationRepository, accountingService,
            accountRepository, auditService, eventPublisher);
    }

    @Test
    @DisplayName("Should create settlement with correct net amount calculations")
    void createSettlement_ShouldCalculateCorrectNetAmount() {
        when(settlementRepository.save(any(MerchantSettlement.class)))
            .thenAnswer(inv -> { MerchantSettlement s = inv.getArgument(0); s.setId(1L); return s; });
        when(settlementTransactionRepository.save(any(SettlementTransaction.class)))
            .thenAnswer(inv -> inv.getArgument(0));
        when(accountRepository.findByAccountCode(anyString())).thenReturn(Optional.empty());

        var transaction = SettlementTransaction.builder()
            .orderId(1L).orderNumber("ORD-001")
            .orderAmount(BigDecimal.valueOf(100000))
            .commissionAmount(BigDecimal.valueOf(5000))
            .deliveryFee(BigDecimal.valueOf(2000))
            .platformFee(BigDecimal.valueOf(1000))
            .gstAmount(BigDecimal.valueOf(1800))
            .tdsAmount(BigDecimal.valueOf(1000))
            .adjustmentAmount(BigDecimal.valueOf(500))
            .build();

        MerchantSettlement result = settlementService.createSettlement(
            1001L, "Test Merchant",
            LocalDate.now().minusDays(7), LocalDate.now(),
            List.of(transaction));

        assertNotNull(result);
        assertEquals(SettlementStatus.PENDING, result.getStatus());
        assertEquals(1, result.getOrderCount());

        // Net = 100000 - 5000 - 2000 - 1000 - 1800 - 1000 + 500 = 89700
        BigDecimal expectedNet = BigDecimal.valueOf(89700).setScale(2, java.math.RoundingMode.HALF_UP);
        assertEquals(expectedNet, result.getNetSettlementAmount());

        verify(settlementRepository, times(1)).save(any(MerchantSettlement.class));
        verify(settlementTransactionRepository, times(1)).save(any(SettlementTransaction.class));
        verify(eventPublisher, times(1)).publishSettlementEvent(any(MerchantSettlement.class));
    }

    @Test
    @DisplayName("Should throw when processing non-pending settlement")
    void processSettlement_ShouldThrow_WhenNotPending() {
        MerchantSettlement settlement = MerchantSettlement.builder()
            .id(1L).status(SettlementStatus.COMPLETED).build();
        when(settlementRepository.findById(1L)).thenReturn(Optional.of(settlement));

        assertThrows(FinanceException.class,
            () -> settlementService.processSettlement(1L, null));
    }

    @Test
    @DisplayName("Should process pending settlement")
    void processSettlement_ShouldSucceed_WhenPending() {
        MerchantSettlement settlement = MerchantSettlement.builder()
            .id(1L).settlementNumber("STL-001")
            .status(SettlementStatus.PENDING).build();
        when(settlementRepository.findById(1L)).thenReturn(Optional.of(settlement));
        when(settlementRepository.save(any(MerchantSettlement.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        MerchantSettlement result = settlementService.processSettlement(1L, 100L);

        assertEquals(SettlementStatus.PROCESSING, result.getStatus());
        assertEquals(100L, result.getBankAccountId());
    }

    @Test
    @DisplayName("Should complete settlement")
    void completeSettlement_ShouldSetCompletedStatus() {
        MerchantSettlement settlement = MerchantSettlement.builder()
            .id(1L).settlementNumber("STL-001")
            .status(SettlementStatus.PROCESSING).build();
        when(settlementRepository.findById(1L)).thenReturn(Optional.of(settlement));
        when(settlementRepository.save(any(MerchantSettlement.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        MerchantSettlement result = settlementService.completeSettlement(1L, "PAY-REF-001");

        assertEquals(SettlementStatus.COMPLETED, result.getStatus());
        assertEquals("PAY-REF-001", result.getPaymentReference());
        verify(eventPublisher, times(1)).publishSettlementEvent(any(MerchantSettlement.class));
    }

    @Test
    @DisplayName("Should get pending settlements")
    void getPendingSettlements_ShouldReturnList() {
        when(settlementRepository.findByStatus(SettlementStatus.PENDING))
            .thenReturn(List.of(MerchantSettlement.builder().id(1L).build()));

        List<MerchantSettlement> result = settlementService.getPendingSettlements();
        assertEquals(1, result.size());
    }
}
