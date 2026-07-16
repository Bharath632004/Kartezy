package com.kartezy.orderservice.service;

import com.kartezy.orderservice.dto.*;
import com.kartezy.orderservice.entity.*;
import com.kartezy.orderservice.repository.*;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderDeliveryInfoRepository deliveryInfoRepository;
    private final OrderTimelineRepository timelineRepository;

    @Transactional
    public OrderEnhancedDto createOrder(CreateOrderRequestDto request) {
        log.info("Creating order for user: {}", request.getUserId());

        String orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;
        for (OrderItemRequestDto item : request.getItems()) {
            BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            BigDecimal itemDiscount = item.getDiscountAmount() != null ? item.getDiscountAmount() : BigDecimal.ZERO;
            subtotal = subtotal.add(itemTotal);
            totalDiscount = totalDiscount.add(itemDiscount);
        }

        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.05));
        BigDecimal deliveryFee = BigDecimal.valueOf(20);
        BigDecimal platformFee = BigDecimal.valueOf(5);
        BigDecimal totalAmount = subtotal.add(tax).add(deliveryFee).add(platformFee).subtract(totalDiscount);

        Order order = Order.builder()
            .userId(request.getUserId())
            .orderNumber(orderNumber)
            .totalAmount(totalAmount)
            .status(OrderStatus.PENDING.name())
            .paymentStatus("PENDING")
            .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD")
            .subtotal(subtotal)
            .tax(tax)
            .deliveryFee(deliveryFee)
            .discount(totalDiscount)
            .platformFee(platformFee)
            .notes(request.getNotes())
            .build();

        order = orderRepository.save(order);

        // Create order items
        for (OrderItemRequestDto itemReq : request.getItems()) {
            BigDecimal itemTotal = itemReq.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            BigDecimal itemDiscount = itemReq.getDiscountAmount() != null ? itemReq.getDiscountAmount() : BigDecimal.ZERO;

            OrderItem orderItem = OrderItem.builder()
                .orderId(order.getId())
                .merchantId(itemReq.getMerchantId())
                .productId(itemReq.getProductId())
                .productName(itemReq.getProductName())
                .productImage(itemReq.getProductImage())
                .sku(itemReq.getSku())
                .variantName(itemReq.getVariantName())
                .quantity(itemReq.getQuantity())
                .unitPrice(itemReq.getUnitPrice())
                .totalPrice(itemTotal)
                .discountAmount(itemDiscount)
                .discountDescription(itemReq.getDiscountDescription())
                .netPrice(itemTotal.subtract(itemDiscount))
                .build();

            orderItemRepository.save(orderItem);
        }

        // Create delivery info
        if (request.getDeliveryAddress() != null) {
            OrderDeliveryInfo deliveryInfo = OrderDeliveryInfo.builder()
                .orderId(order.getId())
                .deliveryAddress(request.getDeliveryAddress())
                .deliveryCity(request.getDeliveryCity())
                .deliveryState(request.getDeliveryState())
                .deliveryPincode(request.getDeliveryPincode())
                .deliveryLatitude(request.getDeliveryLatitude())
                .deliveryLongitude(request.getDeliveryLongitude())
                .deliveryType(request.getDeliveryType() != null ? request.getDeliveryType() : "INSTANT")
                .scheduledTime(request.getScheduledTime())
                .pickupAddress(request.getPickupAddress())
                .pickupLatitude(request.getPickupLatitude())
                .pickupLongitude(request.getPickupLongitude())
                .deliveryOtp(String.format("%06d", new Random().nextInt(999999)))
                .deliveryNotes(request.getNotes())
                .build();

            deliveryInfoRepository.save(deliveryInfo);
        }

        // Add timeline entry
        addTimelineEntry(order.getId(), "PENDING", "Order placed successfully", "SYSTEM");

        log.info("Order created: {} with number: {}", order.getId(), orderNumber);
        return getOrderDetail(order.getId());
    }

    @Transactional
    public OrderEnhancedDto updateOrderStatus(UUID orderId, OrderStatusUpdateDto update) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        order.setStatus(update.getStatus());
        orderRepository.save(order);

        addTimelineEntry(orderId, update.getStatus(), update.getDescription(), update.getUpdatedBy());

        if ("DELIVERED".equals(update.getStatus())) {
            order.setDeliveredAt(LocalDateTime.now());
            order.setPaymentStatus("PAID");
            orderRepository.save(order);

            deliveryInfoRepository.findByOrderId(orderId).ifPresent(di -> {
                di.setDeliveredAt(LocalDateTime.now());
                deliveryInfoRepository.save(di);
            });
        }

        if ("CONFIRMED".equals(update.getStatus())) {
            order.setConfirmedAt(LocalDateTime.now());
            orderRepository.save(order);
        }

        log.info("Order {} status updated to: {}", orderId, update.getStatus());
        return getOrderDetail(orderId);
    }

    @Transactional
    public OrderEnhancedDto assignDriver(UUID orderId, UUID driverId, String driverName, String driverPhone) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setDriverId(driverId);
        order.setDriverName(driverName);
        order.setDriverPhone(driverPhone);
        order.setStatus(OrderStatus.ASSIGNED.name());
        orderRepository.save(order);

        addTimelineEntry(orderId, "ASSIGNED", "Delivery partner assigned: " + driverName, "SYSTEM");
        return getOrderDetail(orderId);
    }

    @Transactional
    public OrderEnhancedDto cancelOrder(UUID orderId, String reason) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(OrderStatus.CANCELLED.name());
        orderRepository.save(order);

        addTimelineEntry(orderId, "CANCELLED", reason != null ? reason : "Order cancelled", "SYSTEM");
        log.info("Order {} cancelled", orderId);
        return getOrderDetail(orderId);
    }

    @Transactional
    public OrderEnhancedDto returnOrder(UUID orderId, String reason) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(OrderStatus.RETURNED.name());
        order.setPaymentStatus("REFUNDED");
        orderRepository.save(order);

        addTimelineEntry(orderId, "RETURNED", reason != null ? reason : "Order returned", "SYSTEM");
        log.info("Order {} returned", orderId);
        return getOrderDetail(orderId);
    }

    @Transactional
    public OrderEnhancedDto refundOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(OrderStatus.REFUNDED.name());
        order.setPaymentStatus("REFUNDED");
        orderRepository.save(order);

        addTimelineEntry(orderId, "REFUNDED", "Payment refunded", "SYSTEM");
        log.info("Order {} refunded", orderId);
        return getOrderDetail(orderId);
    }

    public OrderEnhancedDto getOrderDetail(UUID id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));

        List<OrderItem> items = orderItemRepository.findByOrderId(id);

        DeliveryInfoDto deliveryInfo = deliveryInfoRepository.findByOrderId(id)
            .map(this::toDeliveryInfoDto)
            .orElse(null);

        List<TimelineEntryDto> timeline = timelineRepository.findByOrderIdOrderByCreatedAtAsc(id)
            .stream().map(this::toTimelineEntryDto).collect(Collectors.toList());

        return toOrderDto(order, items, deliveryInfo, timeline);
    }

    public List<OrderEnhancedDto> getUserOrders(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(order -> {
                List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                DeliveryInfoDto di = deliveryInfoRepository.findByOrderId(order.getId())
                    .map(this::toDeliveryInfoDto).orElse(null);
                List<TimelineEntryDto> tl = timelineRepository.findByOrderIdOrderByCreatedAtAsc(order.getId())
                    .stream().map(this::toTimelineEntryDto).collect(Collectors.toList());
                return toOrderDto(order, items, di, tl);
            }).collect(Collectors.toList());
    }

    public List<OrderEnhancedDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            DeliveryInfoDto di = deliveryInfoRepository.findByOrderId(order.getId())
                .map(this::toDeliveryInfoDto).orElse(null);
            List<TimelineEntryDto> tl = timelineRepository.findByOrderIdOrderByCreatedAtAsc(order.getId())
                .stream().map(this::toTimelineEntryDto).collect(Collectors.toList());
            return toOrderDto(order, items, di, tl);
        }).collect(Collectors.toList());
    }

    public List<OrderEnhancedDto> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status)
            .stream().map(order -> {
                List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                DeliveryInfoDto di = deliveryInfoRepository.findByOrderId(order.getId())
                    .map(this::toDeliveryInfoDto).orElse(null);
                List<TimelineEntryDto> tl = timelineRepository.findByOrderIdOrderByCreatedAtAsc(order.getId())
                    .stream().map(this::toTimelineEntryDto).collect(Collectors.toList());
                return toOrderDto(order, items, di, tl);
            }).collect(Collectors.toList());
    }

    public OrderInvoiceDto generateInvoice(UUID orderId) {
        OrderEnhancedDto order = getOrderDetail(orderId);
        return OrderInvoiceDto.builder()
            .orderId(order.getId())
            .orderNumber(order.getOrderNumber())
            .invoiceNumber("INV-" + order.getOrderNumber())
            .items(order.getItems())
            .subtotal(order.getSubtotal())
            .discount(order.getDiscount())
            .tax(order.getTax())
            .deliveryFee(order.getDeliveryFee())
            .totalAmount(order.getTotalAmount())
            .paymentMethod(order.getPaymentMethod())
            .paymentStatus(order.getPaymentStatus())
            .invoiceDate(LocalDateTime.now())
            .build();
    }

    public OrderStatsDto getOrderStats() {
        List<Order> allOrders = orderRepository.findAll();
        long total = allOrders.size();
        long pending = allOrders.stream().filter(o -> "PENDING".equals(o.getStatus())).count();
        long active = allOrders.stream().filter(o -> List.of("CONFIRMED","ACCEPTED","PICKING","PACKING","READY","ASSIGNED","PICKED_UP","OUT_FOR_DELIVERY").contains(o.getStatus())).count();
        long delivered = allOrders.stream().filter(o -> "DELIVERED".equals(o.getStatus())).count();
        long cancelled = allOrders.stream().filter(o -> "CANCELLED".equals(o.getStatus())).count();
        long returned = allOrders.stream().filter(o -> "RETURNED".equals(o.getStatus())).count();
        BigDecimal totalRevenue = allOrders.stream()
            .filter(o -> "DELIVERED".equals(o.getStatus()))
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return OrderStatsDto.builder()
            .totalOrders(total).pendingOrders(pending).activeOrders(active)
            .deliveredOrders(delivered).cancelledOrders(cancelled).returnedOrders(returned)
            .totalRevenue(totalRevenue).averageOrderValue(total > 0 ? totalRevenue.divide(BigDecimal.valueOf(total), BigDecimal.ROUND_HALF_UP).doubleValue() : 0.0)
            .totalItemsSold(allOrders.stream().mapToLong(o -> orderItemRepository.findByOrderId(o.getId()).size()).sum())
            .build();
    }

    private void addTimelineEntry(UUID orderId, String status, String description, String updatedBy) {
        OrderTimeline entry = OrderTimeline.builder()
            .orderId(orderId).status(status)
            .description(description).updatedBy(updatedBy)
            .build();
        timelineRepository.save(entry);
    }

    private OrderEnhancedDto toOrderDto(Order o, List<OrderItem> items, DeliveryInfoDto di, List<TimelineEntryDto> tl) {
        return OrderEnhancedDto.builder()
            .id(o.getId()).userId(o.getUserId()).orderNumber(o.getOrderNumber())
            .subtotal(o.getSubtotal()).tax(o.getTax()).deliveryFee(o.getDeliveryFee())
            .discount(o.getDiscount()).totalAmount(o.getTotalAmount()).platformFee(o.getPlatformFee())
            .status(o.getStatus()).paymentStatus(o.getPaymentStatus()).paymentMethod(o.getPaymentMethod())
            .items(items.stream().map(this::toItemDto).collect(Collectors.toList()))
            .deliveryInfo(di).timeline(tl)
            .driverId(o.getDriverId()).driverName(o.getDriverName()).driverPhone(o.getDriverPhone())
            .notes(o.getNotes())
            .createdAt(o.getCreatedAt()).updatedAt(o.getUpdatedAt())
            .confirmedAt(o.getConfirmedAt()).deliveredAt(o.getDeliveredAt())
            .build();
    }

    private OrderItemEnhancedDto toItemDto(OrderItem i) {
        return OrderItemEnhancedDto.builder()
            .id(i.getId()).merchantId(i.getMerchantId()).productId(i.getProductId())
            .productName(i.getProductName()).productImage(i.getProductImage())
            .sku(i.getSku()).variantName(i.getVariantName())
            .quantity(i.getQuantity()).unitPrice(i.getUnitPrice())
            .totalPrice(i.getTotalPrice()).discountAmount(i.getDiscountAmount())
            .netPrice(i.getNetPrice()).status(i.getStatus()).notes(i.getNotes()).build();
    }

    private DeliveryInfoDto toDeliveryInfoDto(OrderDeliveryInfo di) {
        return DeliveryInfoDto.builder()
            .deliveryAddress(di.getDeliveryAddress()).deliveryCity(di.getDeliveryCity())
            .deliveryState(di.getDeliveryState()).deliveryPincode(di.getDeliveryPincode())
            .deliveryLatitude(di.getDeliveryLatitude()).deliveryLongitude(di.getDeliveryLongitude())
            .deliveryType(di.getDeliveryType()).scheduledTime(di.getScheduledTime())
            .pickupAddress(di.getPickupAddress()).pickupLatitude(di.getPickupLatitude())
            .pickupLongitude(di.getPickupLongitude()).deliveryOtp(di.getDeliveryOtp())
            .deliveryNotes(di.getDeliveryNotes()).build();
    }

    private TimelineEntryDto toTimelineEntryDto(OrderTimeline t) {
        return TimelineEntryDto.builder()
            .id(t.getId()).status(t.getStatus()).description(t.getDescription())
            .updatedBy(t.getUpdatedBy()).createdAt(t.getCreatedAt()).build();
    }
}
