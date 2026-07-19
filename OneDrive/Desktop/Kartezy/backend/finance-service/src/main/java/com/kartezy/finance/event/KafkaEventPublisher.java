package com.kartezy.finance.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.entity.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void publishSettlementEvent(MerchantSettlement settlement) {
        try {
            Map<String, Object> event = new LinkedHashMap<>();
            event.put("eventType", "SETTLEMENT_" + settlement.getStatus().name());
            event.put("settlementId", settlement.getId());
            event.put("settlementNumber", settlement.getSettlementNumber());
            event.put("merchantId", settlement.getMerchantId());
            event.put("merchantName", settlement.getMerchantName());
            event.put("netAmount", settlement.getNetSettlementAmount());
            event.put("timestamp", java.time.LocalDateTime.now().toString());

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(FinanceConstants.TOPIC_SETTLEMENT_EVENTS, payload);
            log.info("Published settlement event: {}", settlement.getSettlementNumber());
        } catch (Exception e) {
            log.error("Failed to publish settlement event: {}", e.getMessage());
        }
    }

    public void publishPaymentEvent(Long orderId, String orderNumber, String paymentRef, String status) {
        try {
            Map<String, Object> event = new LinkedHashMap<>();
            event.put("eventType", "PAYMENT_" + status);
            event.put("orderId", orderId);
            event.put("orderNumber", orderNumber);
            event.put("paymentReference", paymentRef);
            event.put("timestamp", java.time.LocalDateTime.now().toString());

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(FinanceConstants.TOPIC_PAYMENT_EVENTS, payload);
            log.info("Published payment event for order: {}", orderNumber);
        } catch (Exception e) {
            log.error("Failed to publish payment event: {}", e.getMessage());
        }
    }

    public void publishWalletEvent(WalletTransaction transaction) {
        try {
            Map<String, Object> event = new LinkedHashMap<>();
            event.put("eventType", "WALLET_TRANSACTION");
            event.put("walletId", transaction.getWalletId());
            event.put("merchantId", transaction.getMerchantId());
            event.put("customerId", transaction.getCustomerId());
            event.put("amount", transaction.getAmount());
            event.put("transactionType", transaction.getTransactionType());
            event.put("referenceNumber", transaction.getReferenceNumber());
            event.put("timestamp", java.time.LocalDateTime.now().toString());

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(FinanceConstants.TOPIC_WALLET_EVENTS, payload);
            log.info("Published wallet event: {}", transaction.getReferenceNumber());
        } catch (Exception e) {
            log.error("Failed to publish wallet event: {}", e.getMessage());
        }
    }

    public void publishCommissionEvent(CommissionCalculation calculation) {
        try {
            Map<String, Object> event = new LinkedHashMap<>();
            event.put("eventType", "COMMISSION_CALCULATED");
            event.put("commissionId", calculation.getId());
            event.put("orderId", calculation.getOrderId());
            event.put("merchantId", calculation.getMerchantId());
            event.put("amount", calculation.getCalculatedAmount());
            event.put("timestamp", java.time.LocalDateTime.now().toString());

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(FinanceConstants.TOPIC_COMMISSION_EVENTS, payload);
            log.info("Published commission event for order: {}", calculation.getOrderNumber());
        } catch (Exception e) {
            log.error("Failed to publish commission event: {}", e.getMessage());
        }
    }

    public void publishAuditEvent(AuditLog auditLog) {
        try {
            Map<String, Object> event = new LinkedHashMap<>();
            event.put("eventType", "AUDIT_LOG");
            event.put("auditId", auditLog.getId());
            event.put("action", auditLog.getAction().name());
            event.put("entityType", auditLog.getEntityType());
            event.put("entityId", auditLog.getEntityId());
            event.put("performedBy", auditLog.getPerformedBy());
            event.put("timestamp", auditLog.getPerformedAt().toString());

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(FinanceConstants.TOPIC_AUDIT_EVENTS, payload);
        } catch (Exception e) {
            log.error("Failed to publish audit event: {}", e.getMessage());
        }
    }

    public void publishFinanceEvent(String eventType, Map<String, Object> data) {
        try {
            Map<String, Object> event = new LinkedHashMap<>(data);
            event.put("eventType", eventType);
            event.put("timestamp", java.time.LocalDateTime.now().toString());

            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(FinanceConstants.TOPIC_FINANCE_EVENTS, payload);
        } catch (Exception e) {
            log.error("Failed to publish finance event: {}", e.getMessage());
        }
    }
}
