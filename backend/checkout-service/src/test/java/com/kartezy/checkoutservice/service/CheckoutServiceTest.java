package com.kartezy.checkoutservice.service;

import com.kartezy.checkoutservice.dto.CheckoutRequest;
import com.kartezy.checkoutservice.dto.CheckoutRequest.CheckoutItemRequest;
import com.kartezy.checkoutservice.dto.CheckoutResponse;
import com.kartezy.checkoutservice.entity.CheckoutCart;
import com.kartezy.checkoutservice.entity.CheckoutCartItem;
import com.kartezy.checkoutservice.entity.CheckoutSession;
import com.kartezy.checkoutservice.repository.CheckoutCartItemRepository;
import com.kartezy.checkoutservice.repository.CheckoutCartRepository;
import com.kartezy.checkoutservice.repository.CheckoutSessionRepository;
import com.kartezy.shared.events.KafkaEventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CheckoutServiceTest {

    @Mock
    private CheckoutCartRepository cartRepository;
    @Mock
    private CheckoutCartItemRepository cartItemRepository;
    @Mock
    private CheckoutSessionRepository sessionRepository;
    @Mock
    private KafkaEventPublisher eventPublisher;

    private CheckoutService checkoutService;

    @BeforeEach
    void setUp() {
        checkoutService = new CheckoutService(cartRepository, cartItemRepository, sessionRepository, eventPublisher);
    }

    @Test
    void initiateCheckout_ShouldCreateCartAndSession() {
        // Given
        UUID userId = UUID.randomUUID();
        UUID productId = UUID.randomUUID();
        UUID merchantId = UUID.randomUUID();

        CheckoutRequest request = CheckoutRequest.builder()
            .userId(userId)
            .paymentMethod("COD")
            .deliveryAddress("123 Test St")
            .items(List.of(CheckoutItemRequest.builder()
                .productId(productId)
                .merchantId(merchantId)
                .productName("Test Product")
                .quantity(2)
                .unitPrice(BigDecimal.valueOf(100))
                .build()))
            .build();

        CheckoutCart savedCart = CheckoutCart.builder()
            .id(UUID.randomUUID())
            .userId(userId)
            .sessionId("CHK-TEST123")
            .subtotal(BigDecimal.valueOf(200))
            .tax(BigDecimal.valueOf(10))
            .deliveryFee(BigDecimal.valueOf(20))
            .totalAmount(BigDecimal.valueOf(230))
            .status("ACTIVE")
            .build();

        CheckoutSession savedSession = CheckoutSession.builder()
            .id(UUID.randomUUID())
            .userId(userId)
            .cartId(savedCart.getId())
            .status("INITIATED")
            .totalAmount(BigDecimal.valueOf(230))
            .build();

        when(cartRepository.findByUserIdAndStatus(userId, "ACTIVE")).thenReturn(Optional.empty());
        when(cartRepository.save(any(CheckoutCart.class))).thenReturn(savedCart);
        when(cartItemRepository.save(any(CheckoutCartItem.class))).thenReturn(new CheckoutCartItem());
        when(cartItemRepository.findByCartId(any())).thenReturn(List.of());
        when(sessionRepository.save(any(CheckoutSession.class))).thenReturn(savedSession);

        // When
        CheckoutResponse response = checkoutService.initiateCheckout(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getSessionId()).isEqualTo(savedSession.getId());
        assertThat(response.getStatus()).isEqualTo("INITIATED");
        assertThat(response.getTotalAmount()).isEqualByComparingTo(BigDecimal.valueOf(230));

        verify(cartRepository).save(any(CheckoutCart.class));
        verify(sessionRepository).save(any(CheckoutSession.class));
    }

    @Test
    void getCheckoutSession_WhenNotFound_ShouldThrowException() {
        UUID sessionId = UUID.randomUUID();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> checkoutService.getCheckoutSession(sessionId))
            .hasMessageContaining("Checkout session not found");
    }
}
