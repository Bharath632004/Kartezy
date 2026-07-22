package com.kartezy.paymentservice.integration;

import com.kartezy.paymentservice.dto.PaymentRequestDto;
import com.kartezy.paymentservice.entity.Payment;
import com.kartezy.paymentservice.entity.Payment.PaymentMethod;
import com.kartezy.paymentservice.entity.Payment.PaymentStatus;
import com.kartezy.paymentservice.repository.PaymentRepository;
import com.kartezy.shared.exception.PaymentGatewayException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for integrating with Razorpay payment gateway.
 * Handles order creation, payment verification, and webhook signature validation.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.webhook-secret}")
    private String razorpayWebhookSecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    private com.razorpay.RazorpayClient razorpayClient;

    @PostConstruct
    public void init() {
        try {
            if (razorpayKeyId != null && !razorpayKeyId.isEmpty()
                    && razorpayKeySecret != null && !razorpayKeySecret.isEmpty()
                    && !"rzp_test_placeholder".equals(razorpayKeyId)) {
                razorpayClient = new com.razorpay.RazorpayClient(razorpayKeyId, razorpayKeySecret);
                log.info("Razorpay client initialized successfully");
            } else {
                log.warn("Razorpay client not initialized - using placeholder credentials. " +
                        "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.");
            }
        } catch (Exception e) {
            log.error("Failed to initialize Razorpay client: {}", e.getMessage());
        }
    }

    /**
     * Creates a Razorpay order for the given payment request.
     * Returns the Razorpay order ID that the frontend uses to complete payment.
     */
    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(PaymentRequestDto request) {
        log.info("Creating Razorpay order for: {}", request.getOrderId());

        // Check for existing payment to avoid duplicates
        Optional<Payment> existingPayment = paymentRepository.findByOrderId(request.getOrderId());
        if (existingPayment.isPresent()) {
            Payment existing = existingPayment.get();
            if (existing.getStatus() == PaymentStatus.SUCCESS) {
                throw new PaymentGatewayException("Order already paid");
            }
            if (existing.getGatewayReference() != null && !existing.getGatewayReference().isEmpty()) {
                return RazorpayOrderResponse.builder()
                        .razorpayOrderId(existing.getGatewayReference())
                        .razorpayKeyId(razorpayKeyId)
                        .amount(existing.getAmount())
                        .currency(existing.getCurrency())
                        .status(existing.getStatus().name())
                        .build();
            }
        }

        try {
            JSONObject orderRequest = new JSONObject();
            int amountInPaise = request.getAmount().multiply(BigDecimal.valueOf(100)).intValue();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "receipt_" + request.getOrderId().toString().substring(0, 8));
            orderRequest.put("payment_capture", 1);

            JSONObject notes = new JSONObject();
            notes.put("order_id", request.getOrderId().toString());
            notes.put("user_id", request.getUserId().toString());
            if (request.getMerchantId() != null) {
                notes.put("merchant_id", request.getMerchantId().toString());
            }
            orderRequest.put("notes", notes);

            String razorpayOrderId;
            String razorpayStatus;

            if (razorpayClient != null) {
                // Real Razorpay API call
                com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
                razorpayOrderId = razorpayOrder.get("id");
                razorpayStatus = razorpayOrder.get("status");
            } else {
                // Simulate Razorpay order for development
                log.warn("Razorpay not configured - simulating order creation");
                razorpayOrderId = "order_" + UUID.randomUUID().toString().replace("-", "");
                razorpayStatus = "created";
            }

            // Create payment record
            Payment payment = Payment.builder()
                    .orderId(request.getOrderId())
                    .userId(request.getUserId())
                    .merchantId(request.getMerchantId())
                    .amount(request.getAmount())
                    .platformFee(request.getPlatformFee() != null ? request.getPlatformFee() : BigDecimal.ZERO)
                    .gatewayFee(request.getGatewayFee() != null ? request.getGatewayFee() : BigDecimal.ZERO)
                    .tax(request.getTax() != null ? request.getTax() : BigDecimal.ZERO)
                    .netAmount(calculateNetAmount(request))
                    .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()))
                    .status(PaymentStatus.PROCESSING)
                    .currency(currency)
                    .gatewayReference(razorpayOrderId)
                    .idempotencyKey(request.getIdempotencyKey())
                    .ipAddress(request.getIpAddress())
                    .userAgent(request.getUserAgent())
                    .splitPayment(request.isSplitPayment())
                    .build();

            paymentRepository.save(payment);
            log.info("Razorpay order created: {} for payment: {}", razorpayOrderId, payment.getId());

            return RazorpayOrderResponse.builder()
                    .razorpayOrderId(razorpayOrderId)
                    .razorpayKeyId(razorpayKeyId)
                    .amount(request.getAmount())
                    .currency(currency)
                    .status(razorpayStatus)
                    .build();

        } catch (Exception e) {
            log.error("Failed to create Razorpay order: {}", e.getMessage());
            throw new PaymentGatewayException("Failed to initiate payment: " + e.getMessage());
        }
    }

    /**
     * Verifies the Razorpay payment signature.
     * Called after the frontend completes the payment via Razorpay SDK.
     */
    @Transactional
    public Payment verifyAndConfirmPayment(String razorpayOrderId,
                                            String razorpayPaymentId,
                                            String razorpaySignature) {
        log.info("Verifying payment: order={}, payment={}", razorpayOrderId, razorpayPaymentId);

        if (!verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
            log.error("Invalid Razorpay signature for order: {}", razorpayOrderId);
            Optional<Payment> paymentOpt = paymentRepository.findByGatewayReference(razorpayOrderId);
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();
                payment.setStatus(PaymentStatus.FAILED);
                payment.setFailureReason("Invalid payment signature");
                paymentRepository.save(payment);
            }
            throw new PaymentGatewayException("Invalid payment signature");
        }

        Payment payment = paymentRepository.findByGatewayReference(razorpayOrderId)
                .orElseThrow(() -> new PaymentGatewayException("Payment not found for Razorpay order: " + razorpayOrderId));

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setGatewayReference(razorpayOrderId);
        payment.setUpiTransactionId(razorpayPaymentId);
        payment.setBankReference("BANK-REF-" + razorpayPaymentId.substring(0, 12).toUpperCase());
        payment.setCompletedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        log.info("Payment verified and confirmed: {}", payment.getId());
        return payment;
    }

    /**
     * Handles Razorpay webhook events (payment.captured, payment.failed, etc.).
     */
    @Transactional
    public Payment handleWebhookEvent(String payload, String signatureHeader) {
        try {
            if (!verifyWebhookSignature(payload, signatureHeader)) {
                log.error("Invalid webhook signature");
                throw new PaymentGatewayException("Invalid webhook signature");
            }

            JSONObject event = new JSONObject(payload);
            String eventType = event.optString("event", "");

            JSONObject payloadObj = event.optJSONObject("payload");
            if (payloadObj == null) {
                log.warn("No payload in webhook event: {}", eventType);
                return null;
            }

            JSONObject paymentEntity = payloadObj.optJSONObject("payment");
            if (paymentEntity == null) {
                JSONObject orderEntity = payloadObj.optJSONObject("order");
                if (orderEntity != null) {
                    paymentEntity = orderEntity;
                }
            }

            if (paymentEntity == null) {
                log.warn("No payment/order entity in webhook: {}", eventType);
                return null;
            }

            String razorpayOrderId = paymentEntity.optString("order_id");
            String razorpayPaymentId = paymentEntity.optString("id");

            if (razorpayOrderId == null || razorpayOrderId.isEmpty()) {
                log.warn("No order_id in webhook event");
                return null;
            }

            Optional<Payment> paymentOpt = paymentRepository.findByGatewayReference(razorpayOrderId);
            if (paymentOpt.isEmpty()) {
                log.warn("Payment not found for Razorpay order: {}", razorpayOrderId);
                return null;
            }

            Payment payment = paymentOpt.get();

            switch (eventType) {
                case "payment.captured":
                case "payment.authorized":
                    payment.setStatus(PaymentStatus.SUCCESS);
                    payment.setUpiTransactionId(razorpayPaymentId);
                    payment.setBankReference("BANK-REF-" + razorpayPaymentId.substring(0, 12).toUpperCase());
                    payment.setCompletedAt(LocalDateTime.now());
                    payment.setGatewayResponse(payload);
                    log.info("Webhook: Payment captured for order: {}", razorpayOrderId);
                    break;

                case "payment.failed":
                    payment.setStatus(PaymentStatus.FAILED);
                    JSONObject errorDetail = paymentEntity.optJSONObject("error");
                    if (errorDetail != null) {
                        payment.setFailureReason(errorDetail.optString("description", "Payment failed"));
                    } else {
                        payment.setFailureReason("Payment failed");
                    }
                    payment.setGatewayResponse(payload);
                    log.warn("Webhook: Payment failed for order: {} - {}", razorpayOrderId, payment.getFailureReason());
                    break;

                case "order.paid":
                    payment.setStatus(PaymentStatus.SUCCESS);
                    payment.setCompletedAt(LocalDateTime.now());
                    payment.setGatewayResponse(payload);
                    log.info("Webhook: Order paid: {}", razorpayOrderId);
                    break;

                default:
                    log.info("Unhandled webhook event type: {}", eventType);
                    payment.setGatewayResponse(payload);
                    break;
            }

            paymentRepository.save(payment);
            return payment;

        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage());
            throw new PaymentGatewayException("Webhook processing failed: " + e.getMessage());
        }
    }

    private boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String signature) {
        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes());
            String expectedSignature = Base64.getEncoder().encodeToString(hash);
            return expectedSignature.equals(signature);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            log.error("Signature verification failed: {}", e.getMessage());
            return false;
        }
    }

    private boolean verifyWebhookSignature(String payload, String signature) {
        if (signature == null || signature.isEmpty()) {
            log.warn("No webhook signature provided");
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorpayWebhookSecret.getBytes(), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes());
            String expectedSignature = Base64.getEncoder().encodeToString(hash);
            return expectedSignature.equals(signature);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            log.error("Webhook signature verification failed: {}", e.getMessage());
            return false;
        }
    }

    private BigDecimal calculateNetAmount(PaymentRequestDto request) {
        BigDecimal platformFee = request.getPlatformFee() != null ? request.getPlatformFee() : BigDecimal.ZERO;
        BigDecimal gatewayFee = request.getGatewayFee() != null ? request.getGatewayFee() : BigDecimal.ZERO;
        BigDecimal tax = request.getTax() != null ? request.getTax() : BigDecimal.ZERO;
        return request.getAmount().subtract(platformFee).subtract(gatewayFee).subtract(tax);
    }
}
