package com.kartezy.finance.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kartezy.finance.constants.AuditAction;
import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.constants.TransactionType;
import com.kartezy.finance.entity.Account;
import com.kartezy.finance.entity.JournalEntry;
import com.kartezy.finance.entity.JournalEntryLine;
import com.kartezy.finance.entity.WalletTransaction;
import com.kartezy.finance.repository.AccountRepository;
import com.kartezy.finance.repository.WalletTransactionRepository;
import com.kartezy.finance.service.AccountingService;
import com.kartezy.finance.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final ObjectMapper objectMapper;
    private final AccountingService accountingService;
    private final AccountRepository accountRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final AuditService auditService;

    @KafkaListener(topics = FinanceConstants.TOPIC_PAYMENT_EVENTS, groupId = "finance-group")
    @Transactional
    public void consumePaymentEvent(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String eventType = (String) event.get("eventType");
            log.info("Received payment event: {}", eventType);

            switch (eventType) {
                case "PAYMENT_SUCCESS" -> handlePaymentSuccess(event);
                case "PAYMENT_FAILED" -> handlePaymentFailed(event);
                case "PAYMENT_REFUNDED" -> handlePaymentRefunded(event);
                default -> log.warn("Unknown payment event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Error processing payment event: {}", e.getMessage());
        }
    }

    private void handlePaymentSuccess(Map<String, Object> event) {
        Long orderId = event.get("orderId") != null ? Long.valueOf(event.get("orderId").toString()) : null;
        String orderNumber = (String) event.get("orderNumber");
        String paymentRef = (String) event.get("paymentReference");
        BigDecimal amount = event.get("amount") != null ? new BigDecimal(event.get("amount").toString()) : BigDecimal.ZERO;

        Account cashAccount = accountRepository.findByAccountCode(FinanceConstants.CASH_ACCOUNT_CODE).orElse(null);
        Account receivableAccount = accountRepository.findByAccountCode(FinanceConstants.RECEIVABLE_CODE).orElse(null);

        if (cashAccount != null && receivableAccount != null && orderId != null) {
            JournalEntry entry = JournalEntry.builder()
                .entryNumber("JE-PAY-" + orderNumber)
                .entryDate(LocalDate.now())
                .entryType(com.kartezy.finance.constants.JournalEntryType.STANDARD)
                .description("Payment received for order: " + orderNumber)
                .referenceNumber(paymentRef)
                .referenceType("PAYMENT")
                .build();

            accountingService.createJournalEntry(entry, List.of(
                JournalEntryLine.builder().account(cashAccount)
                    .description("Payment received").debitAmount(amount).creditAmount(BigDecimal.ZERO).build(),
                JournalEntryLine.builder().account(receivableAccount)
                    .description("Order payment").debitAmount(BigDecimal.ZERO).creditAmount(amount).build()
            ));

            auditService.log(AuditAction.CREATE, "PAYMENT",
                orderId, orderNumber, "SYSTEM", null, "Payment success: " + paymentRef);
        }
    }

    private void handlePaymentFailed(Map<String, Object> event) {
        log.warn("Payment failed: {}", event.get("paymentReference"));
    }

    private void handlePaymentRefunded(Map<String, Object> event) {
        // Handle refund from payment service - create reversal entry
        Long orderId = event.get("orderId") != null ? Long.valueOf(event.get("orderId").toString()) : null;
        BigDecimal amount = event.get("amount") != null ? new BigDecimal(event.get("amount").toString()) : BigDecimal.ZERO;

        log.info("Processing payment refund for order: {}, amount: {}", orderId, amount);
    }

    @KafkaListener(topics = FinanceConstants.TOPIC_WALLET_EVENTS, groupId = "finance-group")
    @Transactional
    public void consumeWalletEvent(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String eventType = (String) event.get("eventType");
            log.info("Received wallet event: {}", eventType);

            WalletTransaction txn = WalletTransaction.builder()
                .walletId(event.get("walletId") != null ? Long.valueOf(event.get("walletId").toString()) : null)
                .merchantId(event.get("merchantId") != null ? Long.valueOf(event.get("merchantId").toString()) : null)
                .customerId(event.get("customerId") != null ? Long.valueOf(event.get("customerId").toString()) : null)
                .amount(event.get("amount") != null ? new BigDecimal(event.get("amount").toString()) : BigDecimal.ZERO)
                .transactionType((String) event.get("transactionType"))
                .referenceNumber((String) event.get("referenceNumber"))
                .description("Synced from wallet service")
                .status("SYNCED")
                .build();

            walletTransactionRepository.save(txn);
            log.info("Wallet transaction synced to finance records");

        } catch (Exception e) {
            log.error("Error processing wallet event: {}", e.getMessage());
        }
    }
}
