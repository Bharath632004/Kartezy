package com.kartezy.checkoutservice.service;

import com.kartezy.checkoutservice.dto.CheckoutRequest;
import com.kartezy.checkoutservice.dto.CheckoutRequest.CheckoutItemRequest;
import com.kartezy.checkoutservice.dto.CheckoutResponse;
import com.kartezy.checkoutservice.dto.CheckoutResponse.CheckoutItemResponse;
import com.kartezy.checkoutservice.dto.CheckoutSummaryDto;
import com.kartezy.checkoutservice.entity.CheckoutCart;
import com.kartezy.checkoutservice.entity.CheckoutCartItem;
import com.kartezy.checkoutservice.entity.CheckoutSession;
import com.kartezy.checkoutservice.repository.CheckoutCartItemRepository;
import com.kartezy.checkoutservice.repository.CheckoutCartRepository;
import com.kartezy.checkoutservice.repository.CheckoutSessionRepository;
import com.kartezy.shared.events.EventConstants;
import com.kartezy.shared.events.KafkaEventPublisher;
import com.kartezy.shared.events.OrderEvent;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final CheckoutCartRepository cartRepository;
    private final CheckoutCartItemRepository cartItemRepository;
    private final CheckoutSessionRepository sessionRepository;
    private final KafkaEventPublisher eventPublisher;

    @Transactional
    public CheckoutResponse initiateCheckout(CheckoutRequest request) {
        log.info("Initiating checkout for user: {}", request.getUserId());

        // Check for existing active cart
        cartRepository.findByUserIdAndStatus(request.getUserId(), "ACTIVE")
            .ifPresent(cart -> {
                cart.setStatus("ABANDONED");
                cartRepository.save(cart);
                cartItemRepository.deleteByCartId(cart.getId());
            });

        // Calculate totals
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;
        for (CheckoutItemRequest item : request.getItems()) {
            BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            BigDecimal itemDiscount = item.getDiscountAmount() != null ? item.getDiscountAmount() : BigDecimal.ZERO;
            subtotal = subtotal.add(itemTotal);
            totalDiscount = totalDiscount.add(itemDiscount);
        }

        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.05)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal deliveryFee = BigDecimal.valueOf(20);
        BigDecimal totalAmount = subtotal.add(tax).add(deliveryFee).subtract(totalDiscount);

        // Create checkout cart
        CheckoutCart cart = CheckoutCart.builder()
            .userId(request.getUserId())
            .sessionId("CHK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .subtotal(subtotal)
            .tax(tax)
            .deliveryFee(deliveryFee)
            .discount(totalDiscount)
            .totalAmount(totalAmount)
            .paymentMethod(request.getPaymentMethod())
            .couponCode(request.getCouponCode())
            .notes(request.getNotes())
            .status("ACTIVE")
            .expiredAt(LocalDateTime.now().plusMinutes(30))
            .build();
        cart = cartRepository.save(cart);

        // Create cart items
        final UUID cartId = cart.getId();
        for (CheckoutItemRequest itemReq : request.getItems()) {
            BigDecimal itemTotal = itemReq.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            BigDecimal itemDiscount = itemReq.getDiscountAmount() != null ? itemReq.getDiscountAmount() : BigDecimal.ZERO;

            CheckoutCartItem cartItem = CheckoutCartItem.builder()
                .cartId(cartId)
                .productId(itemReq.getProductId())
                .merchantId(itemReq.getMerchantId())
                .productName(itemReq.getProductName())
                .productImage(itemReq.getProductImage())
                .sku(itemReq.getSku())
                .variantName(itemReq.getVariantName())
                .quantity(itemReq.getQuantity())
                .unitPrice(itemReq.getUnitPrice())
                .totalPrice(itemTotal)
                .discountAmount(itemDiscount)
                .netPrice(itemTotal.subtract(itemDiscount))
                .build();
            cartItemRepository.save(cartItem);
        }

        // Create checkout session
        CheckoutSession session = CheckoutSession.builder()
            .userId(request.getUserId())
            .cartId(cart.getId())
            .status("INITIATED")
            .sessionToken(UUID.randomUUID().toString())
            .totalAmount(totalAmount)
            .paymentMethod(request.getPaymentMethod())
            .deliveryAddress(request.getDeliveryAddress())
            .deliveryCity(request.getDeliveryCity())
            .deliveryState(request.getDeliveryState())
            .deliveryPincode(request.getDeliveryPincode())
            .deliveryLatitude(request.getDeliveryLatitude())
            .deliveryLongitude(request.getDeliveryLongitude())
            .notes(request.getNotes())
            .build();
        session = sessionRepository.save(session);

        log.info("Checkout initiated: cartId={}, sessionId={}", cart.getId(), session.getId());
        return buildCheckoutResponse(session, cart);
    }

    @Transactional
    public CheckoutResponse completeCheckout(UUID sessionId, UUID orderId) {
        CheckoutSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Checkout session not found: " + sessionId));

        session.setStatus("COMPLETED");
        session.setOrderId(orderId);
        session.setCompletedAt(LocalDateTime.now());
        sessionRepository.save(session);

        CheckoutCart cart = cartRepository.findById(session.getCartId())
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found: " + session.getCartId()));
        cart.setStatus("COMPLETED");
        cartRepository.save(cart);

        // Publish order event
        OrderEvent event = OrderEvent.builder()
            .eventType(EventConstants.TOPIC_ORDER_CREATED)
            .sourceService("checkout-service")
            .orderId(orderId)
            .userId(session.getUserId())
            .totalAmount(session.getTotalAmount())
            .paymentMethod(session.getPaymentMethod())
            .build();
        eventPublisher.publish(EventConstants.TOPIC_ORDER_CREATED, event);

        log.info("Checkout completed: sessionId={}, orderId={}", sessionId, orderId);
        return buildCheckoutResponse(session, cart);
    }

    @Transactional
    public void failCheckout(UUID sessionId, String reason) {
        CheckoutSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Checkout session not found: " + sessionId));

        session.setStatus("FAILED");
        session.setNotes(reason);
        session.setFailedAt(LocalDateTime.now());
        sessionRepository.save(session);

        CheckoutCart cart = cartRepository.findById(session.getCartId())
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found: " + session.getCartId()));
        cart.setStatus("FAILED");
        cartRepository.save(cart);

        log.warn("Checkout failed: sessionId={}, reason={}", sessionId, reason);
    }

    public CheckoutResponse getCheckoutSession(UUID sessionId) {
        CheckoutSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Checkout session not found: " + sessionId));

        CheckoutCart cart = cartRepository.findById(session.getCartId())
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found: " + session.getCartId()));

        return buildCheckoutResponse(session, cart);
    }

    public CheckoutSummaryDto getCheckoutSummary(UUID sessionId) {
        CheckoutSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Checkout session not found: " + sessionId));

        CheckoutCart cart = cartRepository.findById(session.getCartId())
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found: " + session.getCartId()));

        List<CheckoutCartItem> items = cartItemRepository.findByCartId(cart.getId());

        return CheckoutSummaryDto.builder()
            .sessionId(session.getId())
            .status(session.getStatus())
            .subtotal(cart.getSubtotal())
            .tax(cart.getTax())
            .deliveryFee(cart.getDeliveryFee())
            .discount(cart.getDiscount())
            .totalAmount(cart.getTotalAmount())
            .couponCode(cart.getCouponCode())
            .couponDiscount(cart.getCouponDiscount())
            .paymentMethod(cart.getPaymentMethod())
            .itemCount(items.size())
            .createdAt(session.getCreatedAt())
            .updatedAt(session.getUpdatedAt())
            .build();
    }

    public List<CheckoutSession> getUserCheckoutSessions(UUID userId) {
        return List.of();
    }

    private CheckoutResponse buildCheckoutResponse(CheckoutSession session, CheckoutCart cart) {
        List<CheckoutCartItem> items = cartItemRepository.findByCartId(cart.getId());

        return CheckoutResponse.builder()
            .sessionId(session.getId())
            .cartId(cart.getId())
            .orderId(session.getOrderId())
            .sessionToken(session.getSessionToken())
            .status(session.getStatus())
            .subtotal(cart.getSubtotal())
            .tax(cart.getTax())
            .deliveryFee(cart.getDeliveryFee())
            .discount(cart.getDiscount())
            .totalAmount(cart.getTotalAmount())
            .couponCode(cart.getCouponCode())
            .couponDiscount(cart.getCouponDiscount())
            .paymentMethod(cart.getPaymentMethod())
            .deliveryAddress(session.getDeliveryAddress())
            .createdAt(session.getCreatedAt())
            .expiresAt(cart.getExpiredAt())
            .items(items.stream().map(this::toItemResponse).collect(Collectors.toList()))
            .build();
    }

    private CheckoutItemResponse toItemResponse(CheckoutCartItem item) {
        return CheckoutItemResponse.builder()
            .id(item.getId())
            .productId(item.getProductId())
            .merchantId(item.getMerchantId())
            .productName(item.getProductName())
            .productImage(item.getProductImage())
            .sku(item.getSku())
            .variantName(item.getVariantName())
            .quantity(item.getQuantity())
            .unitPrice(item.getUnitPrice())
            .totalPrice(item.getTotalPrice())
            .discountAmount(item.getDiscountAmount())
            .netPrice(item.getNetPrice())
            .build();
    }
}
