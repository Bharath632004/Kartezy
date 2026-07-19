package com.kartezy.finance.constants;

import java.math.RoundingMode;

public final class FinanceConstants {

    private FinanceConstants() {}

    // Decimal precision
    public static final int AMOUNT_SCALE = 4;
    public static final int DISPLAY_SCALE = 2;
    public static final int TAX_PERCENTAGE_SCALE = 4;
    public static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;

    // Default pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;

    // Settlement cycles (in days)
    public static final int DEFAULT_SETTLEMENT_CYCLE_DAYS = 7;
    public static final int EXPRESS_SETTLEMENT_CYCLE_DAYS = 1;
    public static final int STANDARD_SETTLEMENT_CYCLE_DAYS = 14;

    // Tax defaults
    public static final double DEFAULT_GST_CGST_RATE = 9.0;
    public static final double DEFAULT_GST_SGST_RATE = 9.0;
    public static final double DEFAULT_GST_IGST_RATE = 18.0;
    public static final double DEFAULT_TDS_RATE = 1.0;
    public static final double DEFAULT_TDS_SECTION_194C = 1.0;

    // Kafka topics
    public static final String TOPIC_FINANCE_EVENTS = "finance-events";
    public static final String TOPIC_SETTLEMENT_EVENTS = "settlement-events";
    public static final String TOPIC_PAYMENT_EVENTS = "payment-events";
    public static final String TOPIC_WALLET_EVENTS = "wallet-events";
    public static final String TOPIC_COMMISSION_EVENTS = "commission-events";
    public static final String TOPIC_AUDIT_EVENTS = "audit-events";

    // Cache names
    public static final String CACHE_ACCOUNTS = "accounts";
    public static final String CACHE_CHART_OF_ACCOUNTS = "chartOfAccounts";
    public static final String CACHE_LEDGER = "ledger";
    public static final String CACHE_BALANCES = "balances";

    // Account codes range
    public static final String ASSET_CODE_PREFIX = "1";
    public static final String LIABILITY_CODE_PREFIX = "2";
    public static final String EQUITY_CODE_PREFIX = "3";
    public static final String REVENUE_CODE_PREFIX = "4";
    public static final String EXPENSE_CODE_PREFIX = "5";

    // System account codes
    public static final String CASH_ACCOUNT_CODE = "101001";
    public static final String BANK_ACCOUNT_CODE = "102001";
    public static final String WALLET_ACCOUNT_CODE = "103001";
    public static final String RECEIVABLE_CODE = "104001";
    public static final String PAYABLE_CODE = "201001";
    public static final String GST_PAYABLE_CODE = "202001";
    public static final String GST_RECEIVABLE_CODE = "105001";
    public static final String COMMISSION_REVENUE_CODE = "401001";
    public static final String PLATFORM_FEE_CODE = "402001";
    public static final String DELIVERY_FEE_CODE = "403001";
    public static final String SALES_REVENUE_CODE = "400001";
    public static final String COGS_CODE = "501001";
    public static final String COMMISSION_EXPENSE_CODE = "502001";
    public static final String PAYMENT_GATEWAY_EXPENSE_CODE = "503001";

    // Entity types for audit
    public static final String ENTITY_ACCOUNT = "ACCOUNT";
    public static final String ENTITY_JOURNAL_ENTRY = "JOURNAL_ENTRY";
    public static final String ENTITY_LEDGER = "LEDGER";
    public static final String ENTITY_SETTLEMENT = "SETTLEMENT";
    public static final String ENTITY_INVOICE = "INVOICE";
    public static final String ENTITY_PURCHASE_ORDER = "PURCHASE_ORDER";
    public static final String ENTITY_VENDOR = "VENDOR";
    public static final String ENTITY_SUPPLIER = "SUPPLIER";
    public static final String ENTITY_TAX = "TAX";
    public static final String ENTITY_GST = "GST";
    public static final String ENTITY_COMMISSION = "COMMISSION";
    public static final String ENTITY_BANK = "BANK";
    public static final String ENTITY_RECONCILIATION = "RECONCILIATION";
    public static final String ENTITY_REFUND = "REFUND";
    public static final String ENTITY_FINANCIAL_REPORT = "FINANCIAL_REPORT";
}
