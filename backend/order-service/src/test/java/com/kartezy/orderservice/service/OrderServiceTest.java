package com.kartezy.orderservice.service;

import com.kartezy.orderservice.dto.*;
import com.kartezy.orderservice.entity.*;
import com.kartezy.orderservice.repository.*;
import com.kartezy.orderservice.websocket.OrderStatusWebSocketHandler;
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
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private OrderDeliveryInfoRepository deliveryInfoRepository;

    @Mock
    private OrderTimelineRepository timelineRepository;

    @Mock
    private OrderStatusWebSocketHandler statusWebSocketHandler;

    @InjectMocks
    private OrderService orderService;

    @Captor
    private ArgumentCaptor<Order> orderCaptor;

    @Captor
    private ArgumentCaptor<List<OrderItem>> orderItemsCaptor;

    private UUID userId;
    private UUID orderId;
    private UUID productId;
    private UUID merchantId;
    private Order testOrder;
    private List<OrderItem> testItems;
    private OrderDeliveryInfo testDeliveryInfo;
    private List<OrderTimeline> testTimeline;
    private CreateOrderRequestDto createRequest;
    private OrderStatusUpdateDto statusUpdate;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        orderId = UUID.randomUUID();
        productId = UUID.randomUUID();
        merchantId = UUID.randomUUID();

        testOrder = Order.builder()
                .id(orderId)
                .userId(userId)
                .orderNumber("ORD-TEST1234")
                .subtotal(BigDecimal.valueOf(100))
                .tax(BigDecimal.valueOf(5))
                .deliveryFee(BigDecimal.valueOf(20))
                .discount(BigDecimal.ZERO)
                .totalAmount(BigDecimal.valueOf(125))
                .platformFee(BigDecimal.valueOf(5))
                .status("PENDING")
                .paymentStatus("PENDING")
                .paymentMethod("COD")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        OrderItem item = OrderItem.builder()
                .id(UUID.randomUUID())
                .orderId(orderId)
                .merchantId(merchantId)
                .productId(productId)
                .productName("Test Product")
                .quantity(2)
                .unitPrice(BigDecimal.valueOf(50))
                .totalPrice(BigDecimal.valueOf(100))
                .netPrice(BigDecimal.valueOf(100))
                .discountAmount(BigDecimal.ZERO)
                .build();
        testItems = List.of(item);

        testDeliveryInfo = OrderDeliveryInfo.builder()
                .id(UUID.randomUUID())
                .orderId(orderId)
                .deliveryAddress("123 Test St")
                .deliveryCity("Test City")
                .deliveryState("Test State")
                .deliveryPincode("123456")
                .deliveryOtp("123456")
                .deliveryType("INSTANT")
                .build();

        OrderTimeline timelineEntry = OrderTimeline.builder()
                .id(UUID.randomUUID())
                .orderId(orderId)
                .status("PENDING")
                .description("Order placed")
                .updatedBy("SYSTEM")
                .createdAt(LocalDateTime.now())
                .build();
        testTimeline = List.of(timelineEntry);

        OrderItemRequestDto itemReq = OrderItemRequestDto.builder()
                .merchantId(merchantId)
                .productId(productId)
                .productName("Test Product")
                .productImage("https://example.com/img.jpg")
                .quantity(2)
                .unitPrice(BigDecimal.valueOf(50))
                .build();

        createRequest = CreateOrderRequestDto.builder()
                .userId(userId)
                .deliveryAddress("123 Test St")
                .deliveryCity("Test City")
                .deliveryState("Test State")
                .deliveryPincode("123456")
                .deliveryType("INSTANT")
                .paymentMethod("COD")
                .items(List.of(itemReq))
                .build();

        statusUpdate = OrderStatusUpdateDto.builder()
                .status("CONFIRMED")
                .description("Order confirmed by merchant")
                .updatedBy("MERCHANT")
                .build();
    }

    // =====================
    // createOrder tests
    // =====================
    @Test
    void createOrder_Success() {
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(testItems.get(0));
        when(deliveryInfoRepository.save(any(OrderDeliveryInfo.class))).thenReturn(testDeliveryInfo);
        when(timelineRepository.save(any(OrderTimeline.class))).thenReturn(testTimeline.get(0));
        doNothing().when(statusWebSocketHandler).broadcastStatusUpdate(anyString(), anyString(), anyString());

        // Mock the detail query
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        OrderEnhancedDto result = orderService.createOrder(createRequest);

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        assertEquals(BigDecimal.valueOf(125), result.getTotalAmount());
        assertEquals(BigDecimal.valueOf(100), result.getSubtotal());
        assertEquals(BigDecimal.valueOf(5), result.getTax());
        assertEquals(BigDecimal.valueOf(20), result.getDeliveryFee());

        verify(orderRepository, atLeastOnce()).save(any(Order.class));
        verify(orderItemRepository, atLeastOnce()).save(any(OrderItem.class));
        verify(deliveryInfoRepository, atLeastOnce()).save(any(OrderDeliveryInfo.class));
        verify(timelineRepository, atLeastOnce()).save(any(OrderTimeline.class));
        verify(statusWebSocketHandler).broadcastStatusUpdate(anyString(), eq("PENDING"), anyString());
    }

    @Test
    void createOrder_CalculatesTotalsCorrectly() {
        OrderItemRequestDto item1 = OrderItemRequestDto.builder()
                .merchantId(merchantId).productId(productId)
                .productName("Product A").quantity(3).unitPrice(BigDecimal.valueOf(100))
                .discountAmount(BigDecimal.valueOf(20)).build();
        OrderItemRequestDto item2 = OrderItemRequestDto.builder()
                .merchantId(merchantId).productId(UUID.randomUUID())
                .productName("Product B").quantity(1).unitPrice(BigDecimal.valueOf(250))
                .build();

        CreateOrderRequestDto request = CreateOrderRequestDto.builder()
                .userId(userId).paymentMethod("COD")
                .items(List.of(item1, item2))
                .build();

        Order savedOrder = Order.builder()
                .id(orderId).userId(userId).orderNumber("ORD-TEST")
                .subtotal(BigDecimal.valueOf(550))  // 3*100 + 1*250
                .tax(BigDecimal.valueOf(27.5))      // 5% of 550
                .deliveryFee(BigDecimal.valueOf(20))
                .discount(BigDecimal.valueOf(20))   // item1 discount
                .totalAmount(BigDecimal.valueOf(582.5)) // 550+27.5+20+5-20
                .platformFee(BigDecimal.valueOf(5))
                .status("PENDING").paymentStatus("PENDING").paymentMethod("COD")
                .build();

        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(testItems.get(0));
        when(deliveryInfoRepository.findByOrderId(any())).thenReturn(Optional.empty());
        when(timelineRepository.save(any(OrderTimeline.class))).thenReturn(testTimeline.get(0));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(any())).thenReturn(List.of());
        doNothing().when(statusWebSocketHandler).broadcastStatusUpdate(anyString(), anyString(), anyString());
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(savedOrder));
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);

        OrderEnhancedDto result = orderService.createOrder(request);

        assertEquals(BigDecimal.valueOf(550), result.getSubtotal());
        assertEquals(BigDecimal.valueOf(20), result.getDiscount());
    }

    // =====================
    // updateOrderStatus tests
    // =====================
    @Test
    void updateOrderStatus_Success() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(timelineRepository.save(any(OrderTimeline.class))).thenReturn(testTimeline.get(0));
        doNothing().when(statusWebSocketHandler).broadcastStatusUpdate(anyString(), anyString(), anyString());

        // Mock detail lookup (called by internal getOrderDetail after status update)
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        OrderEnhancedDto result = orderService.updateOrderStatus(orderId, statusUpdate);

        assertNotNull(result);
        // findById is called once in updateOrderStatus and once in internal getOrderDetail
        verify(orderRepository, times(2)).findById(orderId);
        verify(orderRepository, atLeastOnce()).save(orderCaptor.capture());
        Order savedOrder = orderCaptor.getValue();
        assertEquals("CONFIRMED", savedOrder.getStatus());
        verify(timelineRepository).save(any(OrderTimeline.class));
        verify(statusWebSocketHandler).broadcastStatusUpdate(
                eq(orderId.toString()), eq("CONFIRMED"), anyString());
    }

    @Test
    void updateOrderStatus_Delivered_SetsPaymentAndTimestamps() {
        OrderStatusUpdateDto deliveredUpdate = OrderStatusUpdateDto.builder()
                .status("DELIVERED").description("Order delivered").updatedBy("SYSTEM").build();

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(timelineRepository.save(any(OrderTimeline.class))).thenReturn(testTimeline.get(0));
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(deliveryInfoRepository.save(any(OrderDeliveryInfo.class))).thenReturn(testDeliveryInfo);
        doNothing().when(statusWebSocketHandler).broadcastStatusUpdate(anyString(), anyString(), anyString());

        // Mock detail lookup
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        OrderEnhancedDto result = orderService.updateOrderStatus(orderId, deliveredUpdate);

        assertNotNull(result);
        verify(orderRepository, atLeastOnce()).save(orderCaptor.capture());
        Order savedOrder = orderCaptor.getValue();
        assertEquals("DELIVERED", savedOrder.getStatus());
        assertEquals("PAID", savedOrder.getPaymentStatus());
        assertNotNull(savedOrder.getDeliveredAt());
    }

    @Test
    void updateOrderStatus_NotFound_ThrowsException() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> orderService.updateOrderStatus(orderId, statusUpdate));
    }

    // =====================
    // assignDriver tests
    // =====================
    @Test
    void assignDriver_Success() {
        UUID driverId = UUID.randomUUID();
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(timelineRepository.save(any(OrderTimeline.class))).thenReturn(testTimeline.get(0));

        // Mock detail lookup
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        OrderEnhancedDto result = orderService.assignDriver(orderId, driverId, "John Driver", "+911234567890");

        assertNotNull(result);
        verify(orderRepository).save(orderCaptor.capture());
        Order savedOrder = orderCaptor.getValue();
        assertEquals(driverId, savedOrder.getDriverId());
        assertEquals("John Driver", savedOrder.getDriverName());
        assertEquals("+911234567890", savedOrder.getDriverPhone());
        assertEquals("ASSIGNED", savedOrder.getStatus());
    }

    @Test
    void assignDriver_OrderNotFound_ThrowsException() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> orderService.assignDriver(orderId, UUID.randomUUID(), "Driver", "+911234567890"));
    }

    // =====================
    // cancelOrder tests
    // =====================
    @Test
    void cancelOrder_Success() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(timelineRepository.save(any(OrderTimeline.class))).thenReturn(testTimeline.get(0));

        // Mock detail lookup
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        OrderEnhancedDto result = orderService.cancelOrder(orderId, "Customer changed mind");

        assertNotNull(result);
        verify(orderRepository).save(orderCaptor.capture());
        assertEquals("CANCELLED", orderCaptor.getValue().getStatus());
    }

    @Test
    void cancelOrder_WithDefaultReason() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(timelineRepository.save(any(OrderTimeline.class))).thenReturn(testTimeline.get(0));

        // Mock detail lookup
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        OrderEnhancedDto result = orderService.cancelOrder(orderId, null);

        assertNotNull(result);
        verify(timelineRepository).save(argThat(t -> "Order cancelled".equals(t.getDescription())));
    }

    @Test
    void cancelOrder_NotFound_ThrowsException() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> orderService.cancelOrder(orderId, "reason"));
    }

    // =====================
    // returnOrder tests
    // =====================
    @Test
    void returnOrder_Success() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(timelineRepository.save(any(OrderTimeline.class))).thenReturn(testTimeline.get(0));

        // Mock detail lookup
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        OrderEnhancedDto result = orderService.returnOrder(orderId, "Damaged product");

        assertNotNull(result);
        verify(orderRepository).save(orderCaptor.capture());
        Order saved = orderCaptor.getValue();
        assertEquals("RETURNED", saved.getStatus());
        assertEquals("REFUNDED", saved.getPaymentStatus());
    }

    // =====================
    // refundOrder tests
    // =====================
    @Test
    void refundOrder_Success() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(timelineRepository.save(any(OrderTimeline.class))).thenReturn(testTimeline.get(0));

        // Mock detail lookup
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        OrderEnhancedDto result = orderService.refundOrder(orderId);

        assertNotNull(result);
        verify(orderRepository).save(orderCaptor.capture());
        Order saved = orderCaptor.getValue();
        assertEquals("REFUNDED", saved.getStatus());
        assertEquals("REFUNDED", saved.getPaymentStatus());
    }

    // =====================
    // getOrderDetail tests
    // =====================
    @Test
    void getOrderDetail_Success() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        OrderEnhancedDto result = orderService.getOrderDetail(orderId);

        assertNotNull(result);
        assertEquals(orderId, result.getId());
        assertEquals(testOrder.getOrderNumber(), result.getOrderNumber());
        assertEquals(testOrder.getTotalAmount(), result.getTotalAmount());
        assertEquals(1, result.getItems().size());
        assertNotNull(result.getDeliveryInfo());
        assertEquals(1, result.getTimeline().size());
    }

    @Test
    void getOrderDetail_NotFound_ThrowsException() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> orderService.getOrderDetail(orderId));
    }

    // =====================
    // getUserOrders tests
    // =====================
    @Test
    void getUserOrders_Success() {
        List<Order> orders = List.of(testOrder);
        when(orderRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(orders);
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        List<OrderEnhancedDto> result = orderService.getUserOrders(userId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(orderId, result.get(0).getId());
    }

    @Test
    void getUserOrders_EmptyList() {
        when(orderRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(List.of());

        List<OrderEnhancedDto> result = orderService.getUserOrders(userId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // =====================
    // getAllOrders tests
    // =====================
    @Test
    void getAllOrders_Success() {
        when(orderRepository.findAll()).thenReturn(List.of(testOrder));
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        List<OrderEnhancedDto> result = orderService.getAllOrders();

        assertEquals(1, result.size());
    }

    // =====================
    // getOrdersByStatus tests
    // =====================
    @Test
    void getOrdersByStatus_Success() {
        when(orderRepository.findByStatusOrderByCreatedAtDesc("PENDING")).thenReturn(List.of(testOrder));
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        List<OrderEnhancedDto> result = orderService.getOrdersByStatus("PENDING");

        assertEquals(1, result.size());
        assertEquals("PENDING", result.get(0).getStatus());
    }

    @Test
    void getOrdersByStatus_NoMatches() {
        when(orderRepository.findByStatusOrderByCreatedAtDesc("CANCELLED")).thenReturn(List.of());

        List<OrderEnhancedDto> result = orderService.getOrdersByStatus("CANCELLED");

        assertTrue(result.isEmpty());
    }

    // =====================
    // generateInvoice tests
    // =====================
    @Test
    void generateInvoice_Success() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderItemRepository.findByOrderId(orderId)).thenReturn(testItems);
        when(deliveryInfoRepository.findByOrderId(orderId)).thenReturn(Optional.of(testDeliveryInfo));
        when(timelineRepository.findByOrderIdOrderByCreatedAtAsc(orderId)).thenReturn(testTimeline);

        OrderInvoiceDto invoice = orderService.generateInvoice(orderId);

        assertNotNull(invoice);
        assertEquals(orderId, invoice.getOrderId());
        assertEquals(testOrder.getOrderNumber(), invoice.getOrderNumber());
        assertTrue(invoice.getInvoiceNumber().startsWith("INV-"));
        assertEquals(testOrder.getTotalAmount(), invoice.getTotalAmount());
        assertEquals(testOrder.getPaymentMethod(), invoice.getPaymentMethod());
        assertEquals(1, invoice.getItems().size());
    }

    // =====================
    // getOrderStats tests
    // =====================
    @Test
    void getOrderStats_Success() {
        Order deliveredOrder = Order.builder()
                .id(UUID.randomUUID()).userId(userId)
                .orderNumber("ORD-DELIVERED")
                .totalAmount(BigDecimal.valueOf(200))
                .status("DELIVERED").paymentStatus("PAID")
                .build();

        Order cancelledOrder = Order.builder()
                .id(UUID.randomUUID()).userId(userId)
                .orderNumber("ORD-CANCELLED")
                .totalAmount(BigDecimal.valueOf(50))
                .status("CANCELLED").paymentStatus("REFUNDED")
                .build();

        when(orderRepository.findAll()).thenReturn(List.of(testOrder, deliveredOrder, cancelledOrder));
        when(orderItemRepository.findByOrderId(any())).thenReturn(testItems);

        OrderStatsDto stats = orderService.getOrderStats();

        assertEquals(3, stats.getTotalOrders());
        assertEquals(1, stats.getPendingOrders());
        assertEquals(1, stats.getDeliveredOrders());
        assertEquals(1, stats.getCancelledOrders());
        assertEquals(BigDecimal.valueOf(200), stats.getTotalRevenue());
        assertEquals(3, stats.getTotalItemsSold());
        assertTrue(stats.getAverageOrderValue() > 0);
    }

    @Test
    void getOrderStats_EmptyOrders() {
        when(orderRepository.findAll()).thenReturn(List.of());

        OrderStatsDto stats = orderService.getOrderStats();

        assertEquals(0, stats.getTotalOrders());
        assertEquals(0, stats.getTotalRevenue().doubleValue(), 0.001);
        assertEquals(0.0, stats.getAverageOrderValue(), 0.001);
        assertEquals(0, stats.getTotalItemsSold());
    }
}
