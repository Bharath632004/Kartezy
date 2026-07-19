package com.kartezy.finance.constants;

public enum TransactionType {
    // Core Transactions
    SALE,
    PURCHASE,
    PAYMENT_RECEIVED,
    PAYMENT_MADE,
    REFUND,
    REFUND_PROCESSED,
    SETTLEMENT,
    COMMISSION,
    COMMISSION_PAID,
    WITHDRAWAL,
    DEPOSIT,
    TRANSFER,
    // Adjustments
    ADJUSTMENT_CREDIT,
    ADJUSTMENT_DEBIT,
    // Fees & Charges
    PLATFORM_FEE,
    DELIVERY_FEE,
    PAYMENT_GATEWAY_FEE,
    LATE_FEE,
    PENALTY,
    // Tax
    GST_COLLECTED,
    GST_PAID,
    TDS_DEDUCTED,
    TDS_DEPOSITED,
    TAX_PAYMENT,
    // Internal
    INTERNAL_TRANSFER,
    OPENING_BALANCE,
    CLOSING_ENTRY,
    REVERSAL
}
