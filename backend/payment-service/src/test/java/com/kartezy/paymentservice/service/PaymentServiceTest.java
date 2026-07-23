package com.kartezy.paymentservice.service;

import com.kartezy.paymentservice.dto.*;
import com.kartezy.paymentservice.entity.*;
import com.kartezy.paymentservice.entity.Payment.PaymentMethod;
import com.kartezy.paymentservice.entity.Payment.PaymentStatus;
import com.kartezy.paymentservice.entity.Refund.RefundReason;
import com.kartezy.paymentservice.entity.Refund.RefundStatus;
import com.kartezy.paymentservice.entity.Settlement.SettlementCycle;
import com.kartezy.paymentservice.entity.Settlement.SettlementStatus;
import com.kartezy.paymentservice.integration.RazorpayOrderResponse;
import com.kartezy.paymentservice.integration.RazorpayService;
import com.kartezy.paymentservice.repository.*;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private RefundRepository refundRepository;

    @Mock
    private SettlementRepository settlementRepository;

    @Mock
    private RazorpayService razorpayService;

    @InjectMocks
    private PaymentService paymentService;

    @Captor
    private ArgumentCaptor<Payment> paymentCaptor;

    @Captor
    private ArgumentCaptor<Refund> refundCaptor;

    @Captor
    private ArgumentCaptor<Settlement> settlementCaptor;

    private UUID paymentId;
    private UUID orderId;
    private UUID userId;
    private UUID merchantId;
    private Payment testPayment;
    private PaymentRequestDto codRequest;
    private PaymentRequestDto upiRequest;

    @BeforeEach
    void setUp() {
        paymentId = UUID.randomUUID();
        orderId = UUID.randomUUID();
        userId = UUID.randomUUID();
        merchantId = UUID.randomUUID();

        testPayment = Payment.builder()
                .id(paymentId)
                .orderId(orderId)
                .userId(userId)
                .merchantId(merchantId)
                .transactionId("TXN-TEST123456")
                .amount(BigDecimal.valueOf(500))
                .platformFee(BigDecimal.valueOf(10))
                .gatewayFee(BigDecimal.valueOf(5))
                .tax(BigDecimal.valueOf(2))
                .netAmount(BigDecimal.valueOf(483))
                .paymentMethod(PaymentMethod.COD)
                .status(PaymentStatus.PENDING)
                .currency("INR")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .refunded(false)
                .refundedAmount(BigDecimal.ZERO)
                .splitPayment(false)
                .build();

        codRequest = PaymentRequestDto.builder()
                .orderId(orderId)
                .userId(userId)
                .merchantId(merchantId)
                .amount(BigDecimal.valueOf(500))
                .paymentMethod("COD")
                .platformFee(BigDecimal.valueOf(10))
                .gatewayFee(BigDecimal.valueOf(5))
                .tax(BigDecimal.valueOf(2))
                .idempotencyKey("IDEM-001")
                .build();

        upiRequest = PaymentRequestDto.builder()
                .orderId(orderId)
                .userId(userId)
                .merchantId(merchantId)
                .amount(BigDecimal.valueOf(500))
                .paymentMethod("UPI")
                .platformFee(BigDecimal.valueOf(10))
                .gatewayFee(BigDecimal.valueOf(5))
                .tax(BigDecimal.valueOf(2))
                .build();
    }

    // =====================
    // processPayment tests
    // =====================
    @Test
    void processPayment_COD_Success() {
        when(paymentRepository.findByIdempotencyKey("IDEM-001")).thenReturn(Optional.empty());
        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        Object result = paymentService.processPayment(codRequest);

        assertTrue(result instanceof PaymentDto);
        PaymentDto dto = (PaymentDto) result;
        assertEquals(orderId, dto.getOrderId());
        assertEquals("COD", dto.getPaymentMethod());
        assertEquals("PENDING", dto.getStatus());
        assertEquals(BigDecimal.valueOf(500), dto.getAmount());

        verify(paymentRepository).save(paymentCaptor.capture());
        Payment saved = paymentCaptor.getValue();
        assertEquals(PaymentMethod.COD, saved.getPaymentMethod());
        assertEquals(PaymentStatus.PENDING, saved.getStatus());
    }

    @Test
    void processPayment_IdempotentRequest_ReturnsExisting() {
        when(paymentRepository.findByIdempotencyKey("IDEM-001")).thenReturn(Optional.of(testPayment));

        Object result = paymentService.processPayment(codRequest);

        assertTrue(result instanceof PaymentDto);
        PaymentDto dto = (PaymentDto) result;
        assertEquals(paymentId, dto.getId());

        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void processPayment_AlreadyPaid_ThrowsException() {
        Payment paidPayment = Payment.builder()
                .id(paymentId).orderId(orderId)
                .amount(BigDecimal.valueOf(500))
                .status(PaymentStatus.SUCCESS)
                .paymentMethod(PaymentMethod.COD)
                .build();

        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.of(paidPayment));

        assertThrows(BadRequestException.class,
                () -> paymentService.processPayment(codRequest));
    }

    @Test
    void processPayment_InvalidMethod_ThrowsException() {
        PaymentRequestDto invalidRequest = PaymentRequestDto.builder()
                .orderId(orderId).userId(userId).merchantId(merchantId)
                .amount(BigDecimal.valueOf(100))
                .paymentMethod("CRYPTOCURRENCY")
                .build();

        assertThrows(BadRequestException.class,
                () -> paymentService.processPayment(invalidRequest));
    }

    @Test
    void processPayment_Razorpay_Success() {
        RazorpayOrderResponse gatewayResponse = RazorpayOrderResponse.builder()
                .razorpayOrderId("order_rzp_test123")
                .razorpayKeyId("rzp_key_test")
                .amount(BigDecimal.valueOf(500))
                .currency("INR")
                .status("created")
                .build();

        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.empty());
        when(razorpayService.createRazorpayOrder(upiRequest)).thenReturn(gatewayResponse);

        Object result = paymentService.processPayment(upiRequest);

        assertTrue(result instanceof RazorpayOrderResponse);
        RazorpayOrderResponse response = (RazorpayOrderResponse) result;
        assertEquals("order_rzp_test123", response.getRazorpayOrderId());
        assertEquals("rzp_key_test", response.getRazorpayKeyId());
    }

    @Test
    void processPayment_Razorpay_GatewayError() {
        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.empty());
        when(razorpayService.createRazorpayOrder(upiRequest))
                .thenThrow(new RuntimeException("Gateway timeout"));

        assertThrows(BadRequestException.class,
                () -> paymentService.processPayment(upiRequest));
    }

    // =====================
    // confirmCodPayment tests
    // =====================
    @Test
    void confirmCodPayment_Success() {
        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        PaymentDto result = paymentService.confirmCodPayment(orderId);

        assertNotNull(result);
        verify(paymentRepository).save(paymentCaptor.capture());
        Payment saved = paymentCaptor.getValue();
        assertEquals(PaymentStatus.SUCCESS, saved.getStatus());
        assertNotNull(saved.getCompletedAt());
        assertTrue(saved.getBankReference().startsWith("COD-COL-"));
    }

    @Test
    void confirmCodPayment_NotFound_ThrowsException() {
        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> paymentService.confirmCodPayment(orderId));
    }

    @Test
    void confirmCodPayment_NotCOD_ThrowsException() {
        Payment upiPayment = Payment.builder()
                .id(paymentId).orderId(orderId)
                .amount(BigDecimal.valueOf(500))
                .paymentMethod(PaymentMethod.UPI)
                .status(PaymentStatus.PROCESSING)
                .build();

        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.of(upiPayment));

        assertThrows(BadRequestException.class,
                () -> paymentService.confirmCodPayment(orderId));
    }

    // =====================
    // processRefund tests
    // =====================
    @Test
    void processRefund_FullRefund_Success() {
        RefundRequestDto refundRequest = RefundRequestDto.builder()
                .paymentId(paymentId)
                .amount(null) // Full refund
                .reason("CUSTOMER_REQUEST")
                .reasonDetail("Customer changed mind")
                .initiatedBy("CUSTOMER")
                .build();

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(testPayment));
        when(refundRepository.save(any(Refund.class))).thenAnswer(invocation -> {
            Refund r = invocation.getArgument(0);
            if (r.getId() == null) r.setId(UUID.randomUUID());
            return r;
        });
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        RefundDto result = paymentService.processRefund(paymentId, refundRequest);

        assertNotNull(result);
        assertEquals("COMPLETED", result.getStatus());
        assertEquals("CUSTOMER_REQUEST", result.getReason());
        assertEquals(BigDecimal.valueOf(500), result.getAmount());

        verify(refundRepository, atLeast(3)).save(any(Refund.class));
        verify(paymentRepository, atLeastOnce()).save(paymentCaptor.capture());
        Payment updatedPayment = paymentCaptor.getValue();
        assertTrue(updatedPayment.isRefunded());
        assertEquals(PaymentStatus.REFUNDED, updatedPayment.getStatus());
    }

    @Test
    void processRefund_PartialRefund_Success() {
        RefundRequestDto refundRequest = RefundRequestDto.builder()
                .paymentId(paymentId)
                .amount(BigDecimal.valueOf(200))
                .reason("CUSTOMER_REQUEST")
                .initiatedBy("CUSTOMER")
                .build();

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(testPayment));
        when(refundRepository.save(any(Refund.class))).thenAnswer(invocation -> {
            Refund r = invocation.getArgument(0);
            if (r.getId() == null) r.setId(UUID.randomUUID());
            return r;
        });
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        RefundDto result = paymentService.processRefund(paymentId, refundRequest);

        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(200), result.getAmount());
    }

    @Test
    void processRefund_AlreadyFullyRefunded_ThrowsException() {
        Payment refundedPayment = Payment.builder()
                .id(paymentId).orderId(orderId)
                .amount(BigDecimal.valueOf(500))
                .refunded(true)
                .refundedAmount(BigDecimal.valueOf(500))
                .build();

        RefundRequestDto refundRequest = RefundRequestDto.builder()
                .paymentId(paymentId).amount(BigDecimal.valueOf(100))
                .reason("CUSTOMER_REQUEST").initiatedBy("CUSTOMER")
                .build();

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(refundedPayment));

        assertThrows(BadRequestException.class,
                () -> paymentService.processRefund(paymentId, refundRequest));
    }

    @Test
    void processRefund_AmountExceedsAvailable_ThrowsException() {
        Payment partiallyRefunded = Payment.builder()
                .id(paymentId).orderId(orderId)
                .amount(BigDecimal.valueOf(500))
                .refunded(true)
                .refundedAmount(BigDecimal.valueOf(400))
                .build();

        RefundRequestDto refundRequest = RefundRequestDto.builder()
                .paymentId(paymentId).amount(BigDecimal.valueOf(200))
                .reason("CUSTOMER_REQUEST").initiatedBy("CUSTOMER")
                .build();

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(partiallyRefunded));

        assertThrows(BadRequestException.class,
                () -> paymentService.processRefund(paymentId, refundRequest));
    }

    @Test
    void processRefund_InvalidReason_FallsBackToOthers() {
        RefundRequestDto refundRequest = RefundRequestDto.builder()
                .paymentId(paymentId)
                .amount(BigDecimal.valueOf(100))
                .reason("INVALID_REASON")
                .initiatedBy("SYSTEM")
                .build();

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(testPayment));
        when(refundRepository.save(any(Refund.class))).thenAnswer(invocation -> {
            Refund r = invocation.getArgument(0);
            if (r.getId() == null) r.setId(UUID.randomUUID());
            return r;
        });
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        RefundDto result = paymentService.processRefund(paymentId, refundRequest);

        assertNotNull(result);
        // save is called 3 times: PENDING → PROCESSING → COMPLETED
        // Capture all saves and verify the first one has OTHERS reason
        verify(refundRepository, times(3)).save(refundCaptor.capture());
        List<Refund> allSavedRefunds = refundCaptor.getAllValues();
        assertEquals(3, allSavedRefunds.size());
        assertEquals(RefundReason.OTHERS, allSavedRefunds.get(0).getReason());
    }

    // =====================
    // Settlement tests
    // =====================
    @Test
    void createSettlement_Success() {
        SettlementRequestDto settlementReq = SettlementRequestDto.builder()
                .merchantId(merchantId)
                .orderId(orderId)
                .orderAmount(BigDecimal.valueOf(500))
                .commissionAmount(BigDecimal.valueOf(50))
                .platformFee(BigDecimal.valueOf(10))
                .taxAmount(BigDecimal.valueOf(5))
                .cycle("WEEKLY")
                .cycleStartDate(LocalDateTime.now().minusDays(7))
                .cycleEndDate(LocalDateTime.now())
                .bankAccountNumber("1234567890")
                .bankIfscCode("HDFC0001234")
                .bankName("HDFC Bank")
                .build();

        Settlement settlement = Settlement.builder()
                .id(UUID.randomUUID())
                .merchantId(merchantId).orderId(orderId)
                .orderAmount(BigDecimal.valueOf(500))
                .commissionAmount(BigDecimal.valueOf(50))
                .platformFee(BigDecimal.valueOf(10))
                .taxAmount(BigDecimal.valueOf(5))
                .settlementAmount(BigDecimal.valueOf(435)) // 500-50-10-5
                .status(SettlementStatus.PENDING)
                .cycle(SettlementCycle.WEEKLY)
                .build();

        when(settlementRepository.save(any(Settlement.class))).thenReturn(settlement);

        SettlementDto result = paymentService.createSettlement(merchantId, orderId, settlementReq);

        assertNotNull(result);
        verify(settlementRepository).save(settlementCaptor.capture());
        Settlement saved = settlementCaptor.getValue();
        assertEquals(BigDecimal.valueOf(435), saved.getSettlementAmount());
        assertEquals(SettlementStatus.PENDING, saved.getStatus());
        assertEquals(SettlementCycle.WEEKLY, saved.getCycle());
    }

    @Test
    void processSettlement_Success() {
        UUID settlementId = UUID.randomUUID();
        Settlement settlement = Settlement.builder()
                .id(settlementId).merchantId(merchantId)
                .orderId(orderId).orderAmount(BigDecimal.valueOf(500))
                .settlementAmount(BigDecimal.valueOf(435))
                .status(SettlementStatus.PENDING)
                .cycle(SettlementCycle.WEEKLY)
                .build();

        when(settlementRepository.findById(settlementId)).thenReturn(Optional.of(settlement));
        when(settlementRepository.save(any(Settlement.class))).thenReturn(settlement);

        SettlementDto result = paymentService.processSettlement(settlementId);

        assertNotNull(result);
        verify(settlementRepository, atLeast(2)).save(any(Settlement.class));
    }

    @Test
    void processSettlement_NotFound_ThrowsException() {
        when(settlementRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> paymentService.processSettlement(UUID.randomUUID()));
    }

    // =====================
    // Query tests
    // =====================
    @Test
    void getPayment_Success() {
        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(testPayment));

        PaymentDto result = paymentService.getPayment(paymentId);

        assertNotNull(result);
        assertEquals(paymentId, result.getId());
        assertEquals(orderId, result.getOrderId());
    }

    @Test
    void getPayment_NotFound_ThrowsException() {
        when(paymentRepository.findById(paymentId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> paymentService.getPayment(paymentId));
    }

    @Test
    void getPaymentByOrderId_Success() {
        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.of(testPayment));

        PaymentDto result = paymentService.getPaymentByOrderId(orderId);

        assertNotNull(result);
        assertEquals(orderId, result.getOrderId());
    }

    @Test
    void getPaymentByOrderId_NotFound_ThrowsException() {
        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> paymentService.getPaymentByOrderId(orderId));
    }

    @Test
    void getUserPayments_Success() {
        List<Payment> payments = List.of(testPayment);
        when(paymentRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(payments);

        List<PaymentDto> result = paymentService.getUserPayments(userId);

        assertEquals(1, result.size());
        assertEquals(userId, result.get(0).getUserId());
    }

    @Test
    void getUserPayments_EmptyList() {
        when(paymentRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(List.of());

        List<PaymentDto> result = paymentService.getUserPayments(userId);

        assertTrue(result.isEmpty());
    }

    @Test
    void getMerchantPayments_Success() {
        List<Payment> payments = List.of(testPayment);
        when(paymentRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId)).thenReturn(payments);

        List<PaymentDto> result = paymentService.getMerchantPayments(merchantId);

        assertEquals(1, result.size());
    }

    @Test
    void getPaymentRefunds_Success() {
        Refund refund = Refund.builder()
                .id(UUID.randomUUID()).paymentId(paymentId).orderId(orderId)
                .amount(BigDecimal.valueOf(200))
                .reason(RefundReason.CUSTOMER_REQUEST)
                .status(RefundStatus.COMPLETED)
                .build();

        when(refundRepository.findByPaymentId(paymentId)).thenReturn(List.of(refund));

        List<RefundDto> result = paymentService.getPaymentRefunds(paymentId);

        assertEquals(1, result.size());
        assertEquals(paymentId, result.get(0).getPaymentId());
    }

    @Test
    void getMerchantSettlements_Success() {
        Settlement settlement = Settlement.builder()
                .id(UUID.randomUUID()).merchantId(merchantId).orderId(orderId)
                .settlementAmount(BigDecimal.valueOf(435))
                .orderAmount(BigDecimal.valueOf(500))
                .commissionAmount(BigDecimal.valueOf(50))
                .platformFee(BigDecimal.valueOf(10))
                .taxAmount(BigDecimal.valueOf(5))
                .status(SettlementStatus.PENDING)
                .cycle(SettlementCycle.WEEKLY)
                .bankAccountNumber("1234567890")
                .bankIfscCode("HDFC0001234")
                .bankName("HDFC Bank")
                .build();

        when(settlementRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId)).thenReturn(List.of(settlement));

        List<SettlementDto> result = paymentService.getMerchantSettlements(merchantId);

        assertEquals(1, result.size());
        assertEquals(SettlementCycle.WEEKLY.name(), result.get(0).getCycle());
    }

    // =====================
    // getOverview tests
    // =====================
    @Test
    void getOverview_Success() {
        when(paymentRepository.count()).thenReturn(100L);
        when(paymentRepository.countByStatus(PaymentStatus.SUCCESS)).thenReturn(80L);
        when(paymentRepository.countByStatus(PaymentStatus.FAILED)).thenReturn(10L);
        when(paymentRepository.countByStatus(PaymentStatus.REFUNDED)).thenReturn(5L);
        when(refundRepository.countByStatus(RefundStatus.PENDING)).thenReturn(3L);
        when(settlementRepository.countByStatus(SettlementStatus.PENDING)).thenReturn(2L);
        when(paymentRepository.countByPaymentMethod(PaymentMethod.UPI)).thenReturn(40L);
        when(paymentRepository.countByPaymentMethod(PaymentMethod.COD)).thenReturn(30L);
        when(paymentRepository.countByPaymentMethod(PaymentMethod.CREDIT_CARD)).thenReturn(15L);
        when(paymentRepository.countByPaymentMethod(PaymentMethod.DEBIT_CARD)).thenReturn(10L);
        when(paymentRepository.countByPaymentMethod(PaymentMethod.WALLET)).thenReturn(5L);

        PaymentOverviewDto overview = paymentService.getOverview();

        assertEquals(100, overview.getTotalPayments());
        assertEquals(80, overview.getSuccessfulPayments());
        assertEquals(10, overview.getFailedPayments());
        assertEquals(5, overview.getRefundedPayments());
        assertEquals(3, overview.getPendingRefunds());
        assertEquals(2, overview.getPendingSettlements());
        assertEquals(40, overview.getUpiPayments());
        assertEquals(30, overview.getCodPayments());
        assertEquals(25, overview.getCardPayments());
        assertEquals(5, overview.getWalletPayments());
    }

    @Test
    void getOverview_ZeroCounts() {
        when(paymentRepository.count()).thenReturn(0L);
        when(paymentRepository.countByStatus(any())).thenReturn(0L);
        when(refundRepository.countByStatus(any())).thenReturn(0L);
        when(settlementRepository.countByStatus(any())).thenReturn(0L);
        when(paymentRepository.countByPaymentMethod(any())).thenReturn(0L);

        PaymentOverviewDto overview = paymentService.getOverview();

        assertEquals(0, overview.getTotalPayments());
        assertEquals(0, overview.getSuccessfulPayments());
    }
}
