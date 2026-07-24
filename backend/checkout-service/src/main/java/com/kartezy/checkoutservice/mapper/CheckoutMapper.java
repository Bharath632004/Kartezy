package com.kartezy.checkoutservice.mapper;

import com.kartezy.checkoutservice.dto.CheckoutResponse;
import com.kartezy.checkoutservice.dto.CheckoutSummaryDto;
import com.kartezy.checkoutservice.entity.CheckoutCart;
import com.kartezy.checkoutservice.entity.CheckoutCartItem;
import com.kartezy.checkoutservice.entity.CheckoutSession;

import java.util.List;
import java.util.stream.Collectors;

public class CheckoutMapper {

    private CheckoutMapper() {}

    public static CheckoutResponse toCheckoutResponse(CheckoutSession session, CheckoutCart cart, List<CheckoutCartItem> items) {
        if (session == null || cart == null) return null;
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
            .items(items != null ? items.stream().map(CheckoutMapper::toItemResponse).collect(Collectors.toList()) : List.of())
            .build();
    }

    public static CheckoutResponse.CheckoutItemResponse toItemResponse(CheckoutCartItem item) {
        if (item == null) return null;
        return CheckoutResponse.CheckoutItemResponse.builder()
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

    public static CheckoutSummaryDto toSummaryDto(CheckoutSession session, CheckoutCart cart, int itemCount) {
        if (session == null || cart == null) return null;
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
            .itemCount(itemCount)
            .createdAt(session.getCreatedAt())
            .updatedAt(session.getUpdatedAt())
            .build();
    }
}
