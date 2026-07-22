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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final SettlementRepository settlementRepository;
    private final RazorpayService razorpayService;

    /**
     * Processes a payment.
     * For COD: creates a PENDING payment record (collected on delivery).
     * For Razorpay/online: creates a Razorpay order via the gateway service
     *                      (which also creates the payment record internally).
     */
    @Transactional
    public Object processPayment(PaymentRequestDto request) {
        log.info("Processing payment for order: {}, method: {}, amount: {}",
            request.getOrderId(), request.getPaymentMethod(), request.getAmount());

        // Check idempotency
        if (request.getIdempotencyKey() != null) {
            var existing = paymentRepository.findByIdempotencyKey(request.getIdempotencyKey());
            if (existing.isPresent()) {
                log.info("Idempotent request detected for key: {}", request.getIdempotencyKey());
                return toDto(existing.get());
            }
        }

        PaymentMethod method;
        try {
            method = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid payment method: " + request.getPaymentMethod());
        }

        // Check if payment already exists for this order
        var existingPayment = paymentRepository.findByOrderId(request.getOrderId());
        if (existingPayment.isPresent()) {
            Payment existing = existingPayment.get();
            if (existing.getStatus() == PaymentStatus.SUCCESS) {
                throw new BadRequestException("Order already paid");
            }
            return toDto(existing);
        }

        // COD: create PENDING payment record (collected on delivery)
        if (method == PaymentMethod.COD) {
            Payment payment = createPaymentRecord(request, method, PaymentStatus.PENDING);
            payment = paymentRepository.save(payment);
            log.info("COD payment created: {} for order: {}", payment.getId(), request.getOrderId());
            return toDto(payment);
        }

        // Razorpay/online: delegate to RazorpayService which creates both the
        // Razorpay order AND the payment record in a single transaction.
        try {
            RazorpayOrderResponse gatewayResponse = razorpayService.createRazorpayOrder(request);
            log.info("Payment initiated via Razorpay for order: {}", request.getOrderId());
            return gatewayResponse;
        } catch (Exception e) {
            log.error("Failed to initiate payment via Razorpay: {}", e.getMessage(), e);
            throw new BadRequestException("Payment gateway unavailable: " + e.getMessage());
        }
    }

    /**
     * Creates a payment record for COD payments.
     * For Razorpay payments, the record is created inside {@link RazorpayService#createRazorpayOrder}.
     */
    private Payment createPaymentRecord(PaymentRequestDto request, PaymentMethod method, PaymentStatus status) {
        return Payment.builder()
            .orderId(request.getOrderId())
            .userId(request.getUserId())
            .merchantId(request.getMerchantId())
            .amount(request.getAmount())
            .platformFee(request.getPlatformFee() != null ? request.getPlatformFee() : BigDecimal.ZERO)
            .gatewayFee(request.getGatewayFee() != null ? request.getGatewayFee() : BigDecimal.ZERO)
            .tax(request.getTax() != null ? request.getTax() : BigDecimal.ZERO)
            .netAmount(request.getAmount()
                .subtract(request.getPlatformFee() != null ? request.getPlatformFee() : BigDecimal.ZERO)
                .subtract(request.getGatewayFee() != null ? request.getGatewayFee() : BigDecimal.ZERO)
                .subtract(request.getTax() != null ? request.getTax() : BigDecimal.ZERO))
            .paymentMethod(method)
            .status(status)
            .currency("INR")
            .idempotencyKey(request.getIdempotencyKey())
            .ipAddress(request.getIpAddress())
            .userAgent(request.getUserAgent())
            .splitPayment(request.isSplitPayment())
            .build();
    }

    /**
     * Confirms a COD payment after delivery is completed.
     * Called by the delivery service when the order is delivered with COD.
     */
    @Transactional
    public PaymentDto confirmCodPayment(UUID orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));

        if (payment.getPaymentMethod() != PaymentMethod.COD) {
            throw new BadRequestException("Payment is not COD for order: " + orderId);
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setCompletedAt(LocalDateTime.now());
        payment.setBankReference("COD-COL-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        payment = paymentRepository.save(payment);

        log.info("COD payment confirmed for order: {}", orderId);
        return toDto(payment);
    }

    @Transactional
    public RefundDto processRefund(UUID paymentId, RefundRequestDto request) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));

        if (payment.isRefunded() && payment.getRefundedAmount().compareTo(payment.getAmount()) >= 0) {
            throw new BadRequestException("Payment already fully refunded");
        }

        BigDecimal refundAmount = request.getAmount() != null ? request.getAmount() : payment.getAmount();
        if (refundAmount.compareTo(payment.getAmount().subtract(
            payment.getRefundedAmount() != null ? payment.getRefundedAmount() : BigDecimal.ZERO)) > 0) {
            throw new BadRequestException("Refund amount exceeds available amount");
        }

        RefundReason reason;
        try {
            reason = RefundReason.valueOf(request.getReason().toUpperCase());
        } catch (IllegalArgumentException e) {
            reason = RefundReason.OTHERS;
        }

        Refund refund = Refund.builder()
            .paymentId(paymentId)
            .orderId(payment.getOrderId())
            .amount(refundAmount)
            .reason(reason)
            .reasonDetail(request.getReasonDetail())
            .status(RefundStatus.PENDING)
            .initiatedBy(request.getInitiatedBy())
            .build();

        refund = refundRepository.save(refund);

        // Process refund
        refund.setStatus(RefundStatus.PROCESSING);
        refund = refundRepository.save(refund);

        refund.setStatus(RefundStatus.COMPLETED);
        refund.setCompletedAt(LocalDateTime.now());
        refund = refundRepository.save(refund);

        // Update payment
        BigDecimal totalRefunded = payment.getRefundedAmount() != null
            ? payment.getRefundedAmount().add(refundAmount) : refundAmount;
        payment.setRefunded(true);
        payment.setRefundedAmount(totalRefunded);
        payment.setRefundedAt(LocalDateTime.now());
        if (totalRefunded.compareTo(payment.getAmount()) >= 0) {
            payment.setStatus(PaymentStatus.REFUNDED);
        } else {
            payment.setStatus(PaymentStatus.PARTIALLY_REFUNDED);
        }
        paymentRepository.save(payment);

        log.info("Refund completed: {} for payment: {}", refund.getId(), paymentId);
        return toRefundDto(refund);
    }

    @Transactional
    public SettlementDto createSettlement(UUID merchantId, UUID orderId, SettlementRequestDto request) {
        Settlement settlement = Settlement.builder()
            .merchantId(merchantId)
            .orderId(orderId)
            .orderAmount(request.getOrderAmount())
            .commissionAmount(request.getCommissionAmount())
            .platformFee(request.getPlatformFee())
            .taxAmount(request.getTaxAmount())
            .settlementAmount(request.getOrderAmount()
                .subtract(request.getCommissionAmount())
                .subtract(request.getPlatformFee())
                .subtract(request.getTaxAmount()))
            .status(SettlementStatus.PENDING)
            .cycle(request.getCycle() != null
                ? SettlementCycle.valueOf(request.getCycle().toUpperCase()) : SettlementCycle.WEEKLY)
            .cycleStartDate(request.getCycleStartDate())
            .cycleEndDate(request.getCycleEndDate())
            .bankAccountNumber(request.getBankAccountNumber())
            .bankIfscCode(request.getBankIfscCode())
            .bankName(request.getBankName())
            .notes(request.getNotes())
            .build();

        settlement = settlementRepository.save(settlement);
        log.info("Settlement created: {} for merchant: {}", settlement.getId(), merchantId);
        return toSettlementDto(settlement);
    }

    @Transactional
    public SettlementDto processSettlement(UUID settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
            .orElseThrow(() -> new ResourceNotFoundException("Settlement not found: " + settlementId));

        settlement.setStatus(SettlementStatus.PROCESSING);
        settlement = settlementRepository.save(settlement);

        settlement.setStatus(SettlementStatus.COMPLETED);
        settlement.setProcessedAt(LocalDateTime.now());
        settlement.setCompletedAt(LocalDateTime.now());
        settlement = settlementRepository.save(settlement);

        log.info("Settlement processed: {}", settlementId);
        return toSettlementDto(settlement);
    }

    public PaymentDto getPayment(UUID id) {
        return paymentRepository.findById(id)
            .map(this::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
    }

    public PaymentDto getPaymentByOrderId(UUID orderId) {
        return paymentRepository.findByOrderId(orderId)
            .map(this::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));
    }

    public List<PaymentDto> getUserPayments(UUID userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<PaymentDto> getMerchantPayments(UUID merchantId) {
        return paymentRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<RefundDto> getPaymentRefunds(UUID paymentId) {
        return refundRepository.findByPaymentId(paymentId)
            .stream().map(this::toRefundDto).collect(Collectors.toList());
    }

    public List<SettlementDto> getMerchantSettlements(UUID merchantId) {
        return settlementRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId)
            .stream().map(this::toSettlementDto).collect(Collectors.toList());
    }

    public PaymentOverviewDto getOverview() {
        long totalPayments = paymentRepository.count();
        long successfulPayments = paymentRepository.countByStatus(PaymentStatus.SUCCESS);
        long failedPayments = paymentRepository.countByStatus(PaymentStatus.FAILED);
        long refundedPayments = paymentRepository.countByStatus(PaymentStatus.REFUNDED);
        long pendingRefunds = refundRepository.countByStatus(RefundStatus.PENDING);
        long pendingSettlements = settlementRepository.countByStatus(SettlementStatus.PENDING);

        return PaymentOverviewDto.builder()
            .totalPayments(totalPayments)
            .successfulPayments(successfulPayments)
            .failedPayments(failedPayments)
            .refundedPayments(refundedPayments)
            .pendingRefunds(pendingRefunds)
            .pendingSettlements(pendingSettlements)
            .upiPayments(paymentRepository.countByPaymentMethod(PaymentMethod.UPI))
            .codPayments(paymentRepository.countByPaymentMethod(PaymentMethod.COD))
            .cardPayments(paymentRepository.countByPaymentMethod(PaymentMethod.CREDIT_CARD)
                + paymentRepository.countByPaymentMethod(PaymentMethod.DEBIT_CARD))
            .walletPayments(paymentRepository.countByPaymentMethod(PaymentMethod.WALLET))
            .build();
    }

    public PaymentDto toDto(Payment payment) {
        return PaymentDto.builder()
            .id(payment.getId())
            .orderId(payment.getOrderId())
            .userId(payment.getUserId())
            .merchantId(payment.getMerchantId())
            .transactionId(payment.getTransactionId())
            .amount(payment.getAmount())
            .platformFee(payment.getPlatformFee())
            .gatewayFee(payment.getGatewayFee())
            .tax(payment.getTax())
            .netAmount(payment.getNetAmount())
            .paymentMethod(payment.getPaymentMethod().name())
            .status(payment.getStatus().name())
            .currency(payment.getCurrency())
            .gatewayReference(payment.getGatewayReference())
            .failureReason(payment.getFailureReason())
            .bankReference(payment.getBankReference())
            .upiTransactionId(payment.getUpiTransactionId())
            .cardLastFour(payment.getCardLastFour())
            .cardBrand(payment.getCardBrand())
            .refunded(payment.isRefunded())
            .refundedAmount(payment.getRefundedAmount())
            .splitPayment(payment.isSplitPayment())
            .createdAt(payment.getCreatedAt())
            .completedAt(payment.getCompletedAt())
            .build();
    }

    private RefundDto toRefundDto(Refund refund) {
        return RefundDto.builder()
            .id(refund.getId())
            .paymentId(refund.getPaymentId())
            .orderId(refund.getOrderId())
            .refundReference(refund.getRefundReference())
            .amount(refund.getAmount())
            .reason(refund.getReason().name())
            .reasonDetail(refund.getReasonDetail())
            .status(refund.getStatus().name())
            .gatewayRefundId(refund.getGatewayRefundId())
            .failureReason(refund.getFailureReason())
            .initiatedBy(refund.getInitiatedBy())
            .approvedBy(refund.getApprovedBy())
            .createdAt(refund.getCreatedAt())
            .completedAt(refund.getCompletedAt())
            .build();
    }

    private SettlementDto toSettlementDto(Settlement settlement) {
        return SettlementDto.builder()
            .id(settlement.getId())
            .merchantId(settlement.getMerchantId())
            .orderId(settlement.getOrderId())
            .settlementReference(settlement.getSettlementReference())
            .orderAmount(settlement.getOrderAmount())
            .commissionAmount(settlement.getCommissionAmount())
            .platformFee(settlement.getPlatformFee())
            .taxAmount(settlement.getTaxAmount())
            .settlementAmount(settlement.getSettlementAmount())
            .status(settlement.getStatus().name())
            .cycle(settlement.getCycle().name())
            .cycleStartDate(settlement.getCycleStartDate())
            .cycleEndDate(settlement.getCycleEndDate())
            .bankAccountNumber(settlement.getBankAccountNumber())
            .bankIfscCode(settlement.getBankIfscCode())
            .bankName(settlement.getBankName())
            .notes(settlement.getNotes())
            .createdAt(settlement.getCreatedAt())
            .processedAt(settlement.getProcessedAt())
            .completedAt(settlement.getCompletedAt())
            .build();
    }
}
