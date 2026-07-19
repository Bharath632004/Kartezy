-- Kartezy Finance & ERP Platform - Initial Schema
-- Flyway Migration V1

-- ============================================
-- 1. CHART OF ACCOUNTS
-- ============================================
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    account_code VARCHAR(20) NOT NULL UNIQUE,
    account_name VARCHAR(200) NOT NULL,
    account_description VARCHAR(500),
    account_type VARCHAR(30) NOT NULL,
    account_sub_type VARCHAR(30),
    parent_account_id BIGINT REFERENCES accounts(id),
    is_control_account BOOLEAN DEFAULT FALSE,
    opening_balance DECIMAL(20,4) DEFAULT 0,
    current_balance DECIMAL(20,4) DEFAULT 0,
    credit_limit DECIMAL(20,4),
    currency VARCHAR(3) DEFAULT 'INR',
    is_bank_account BOOLEAN DEFAULT FALSE,
    bank_name VARCHAR(200),
    account_number_encrypted VARCHAR(500),
    ifsc_code VARCHAR(20),
    sort_order INTEGER,
    level INTEGER,
    path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 2. JOURNAL ENTRIES (Double-entry bookkeeping)
-- ============================================
CREATE TABLE journal_entries (
    id BIGSERIAL PRIMARY KEY,
    entry_number VARCHAR(50) NOT NULL UNIQUE,
    entry_date DATE NOT NULL,
    posting_date DATE,
    entry_type VARCHAR(20) NOT NULL,
    description VARCHAR(1000),
    reference_number VARCHAR(100),
    reference_type VARCHAR(50),
    total_debit DECIMAL(20,4) DEFAULT 0,
    total_credit DECIMAL(20,4) DEFAULT 0,
    is_balanced BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'DRAFT',
    approved_by VARCHAR(100),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE journal_entry_lines (
    id BIGSERIAL PRIMARY KEY,
    journal_entry_id BIGINT NOT NULL REFERENCES journal_entries(id),
    line_number INTEGER,
    account_id BIGINT NOT NULL REFERENCES accounts(id),
    description VARCHAR(500),
    debit_amount DECIMAL(20,4) DEFAULT 0,
    credit_amount DECIMAL(20,4) DEFAULT 0,
    is_debit BOOLEAN DEFAULT FALSE,
    reference_id VARCHAR(100),
    reference_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 3. LEDGER
-- ============================================
CREATE TABLE ledger_entries (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(id),
    entry_date DATE NOT NULL,
    transaction_type VARCHAR(30) NOT NULL,
    description VARCHAR(500),
    debit_amount DECIMAL(20,4) DEFAULT 0,
    credit_amount DECIMAL(20,4) DEFAULT 0,
    running_balance DECIMAL(20,4) DEFAULT 0,
    reference_number VARCHAR(100),
    reference_type VARCHAR(50),
    journal_entry_id BIGINT REFERENCES journal_entries(id),
    reconciled BOOLEAN DEFAULT FALSE,
    reconciliation_date DATE,
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 4. MERCHANT SETTLEMENTS
-- ============================================
CREATE TABLE merchant_settlements (
    id BIGSERIAL PRIMARY KEY,
    settlement_number VARCHAR(50) NOT NULL UNIQUE,
    merchant_id BIGINT NOT NULL,
    merchant_name VARCHAR(200),
    settlement_cycle_id VARCHAR(50),
    cycle_start_date DATE,
    cycle_end_date DATE,
    settlement_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    total_order_amount DECIMAL(20,4) DEFAULT 0,
    total_commission DECIMAL(20,4) DEFAULT 0,
    total_delivery_fees DECIMAL(20,4) DEFAULT 0,
    total_platform_fees DECIMAL(20,4) DEFAULT 0,
    total_gst DECIMAL(20,4) DEFAULT 0,
    total_tds DECIMAL(20,4) DEFAULT 0,
    total_adjustments DECIMAL(20,4) DEFAULT 0,
    net_settlement_amount DECIMAL(20,4) DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    settlement_batch_id VARCHAR(100),
    bank_account_id BIGINT,
    payment_reference VARCHAR(200),
    processed_at TIMESTAMP,
    failure_reason VARCHAR(1000),
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE settlement_transactions (
    id BIGSERIAL PRIMARY KEY,
    settlement_id BIGINT NOT NULL REFERENCES merchant_settlements(id),
    order_id BIGINT NOT NULL,
    order_number VARCHAR(50),
    order_amount DECIMAL(20,4) DEFAULT 0,
    commission_amount DECIMAL(20,4) DEFAULT 0,
    delivery_fee DECIMAL(20,4) DEFAULT 0,
    platform_fee DECIMAL(20,4) DEFAULT 0,
    gst_amount DECIMAL(20,4) DEFAULT 0,
    tds_amount DECIMAL(20,4) DEFAULT 0,
    adjustment_amount DECIMAL(20,4) DEFAULT 0,
    net_amount DECIMAL(20,4) DEFAULT 0,
    status VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 5. VENDORS
-- ============================================
CREATE TABLE vendors (
    id BIGSERIAL PRIMARY KEY,
    vendor_code VARCHAR(50) NOT NULL UNIQUE,
    vendor_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(20),
    gstin VARCHAR(20),
    pan VARCHAR(20),
    address_line1 VARCHAR(500),
    address_line2 VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'India',
    bank_name VARCHAR(200),
    bank_account_number_encrypted VARCHAR(500),
    ifsc_code VARCHAR(20),
    payment_terms VARCHAR(100),
    credit_days INTEGER DEFAULT 30,
    credit_limit DECIMAL(20,4),
    outstanding_amount DECIMAL(20,4) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    rating INTEGER,
    category VARCHAR(100),
    notes VARCHAR(2000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 6. SUPPLIERS
-- ============================================
CREATE TABLE suppliers (
    id BIGSERIAL PRIMARY KEY,
    supplier_code VARCHAR(50) NOT NULL UNIQUE,
    supplier_name VARCHAR(200) NOT NULL,
    company_name VARCHAR(200),
    contact_person VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(20),
    gstin VARCHAR(20),
    pan VARCHAR(20),
    address_line1 VARCHAR(500),
    address_line2 VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    bank_name VARCHAR(200),
    bank_account_number_encrypted VARCHAR(500),
    ifsc_code VARCHAR(20),
    payment_terms VARCHAR(100),
    credit_days INTEGER DEFAULT 30,
    credit_limit DECIMAL(20,4),
    outstanding_amount DECIMAL(20,4) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    rating INTEGER,
    supply_categories VARCHAR(500),
    contract_start_date DATE,
    contract_end_date DATE,
    is_preferred BOOLEAN DEFAULT FALSE,
    notes VARCHAR(2000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 7. PURCHASE ORDERS
-- ============================================
CREATE TABLE purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    vendor_id BIGINT REFERENCES vendors(id),
    vendor_name VARCHAR(200),
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    delivery_date DATE,
    status VARCHAR(30) NOT NULL,
    subtotal DECIMAL(20,4) DEFAULT 0,
    discount_amount DECIMAL(20,4) DEFAULT 0,
    tax_amount DECIMAL(20,4) DEFAULT 0,
    shipping_charges DECIMAL(20,4) DEFAULT 0,
    total_amount DECIMAL(20,4) DEFAULT 0,
    paid_amount DECIMAL(20,4) DEFAULT 0,
    balance_amount DECIMAL(20,4) DEFAULT 0,
    notes VARCHAR(2000),
    terms_conditions VARCHAR(5000),
    approved_by VARCHAR(100),
    approved_at TIMESTAMP,
    shipping_address VARCHAR(1000),
    billing_address VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE purchase_order_items (
    id BIGSERIAL PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL REFERENCES purchase_orders(id),
    line_number INTEGER,
    product_name VARCHAR(200),
    product_code VARCHAR(50),
    description VARCHAR(500),
    quantity INTEGER DEFAULT 0,
    received_quantity INTEGER DEFAULT 0,
    unit_price DECIMAL(20,4) DEFAULT 0,
    discount_percentage DECIMAL(10,4) DEFAULT 0,
    discount_amount DECIMAL(20,4) DEFAULT 0,
    tax_percentage DECIMAL(10,4) DEFAULT 0,
    tax_amount DECIMAL(20,4) DEFAULT 0,
    total_amount DECIMAL(20,4) DEFAULT 0,
    unit VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 8. INVOICES
-- ============================================
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    merchant_id BIGINT,
    merchant_name VARCHAR(200),
    vendor_id BIGINT,
    vendor_name VARCHAR(200),
    order_id BIGINT,
    order_number VARCHAR(50),
    purchase_order_id BIGINT,
    invoice_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    invoice_type VARCHAR(30),
    subtotal DECIMAL(20,4) DEFAULT 0,
    discount_amount DECIMAL(20,4) DEFAULT 0,
    taxable_amount DECIMAL(20,4) DEFAULT 0,
    cgst_amount DECIMAL(20,4) DEFAULT 0,
    sgst_amount DECIMAL(20,4) DEFAULT 0,
    igst_amount DECIMAL(20,4) DEFAULT 0,
    cess_amount DECIMAL(20,4) DEFAULT 0,
    total_tax_amount DECIMAL(20,4) DEFAULT 0,
    total_amount DECIMAL(20,4) DEFAULT 0,
    paid_amount DECIMAL(20,4) DEFAULT 0,
    balance_amount DECIMAL(20,4) DEFAULT 0,
    gstin VARCHAR(20),
    place_of_supply VARCHAR(100),
    is_interstate BOOLEAN DEFAULT FALSE,
    notes VARCHAR(2000),
    payment_terms VARCHAR(100),
    payment_reference VARCHAR(200),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE invoice_payments (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL REFERENCES invoices(id),
    payment_date DATE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(200),
    amount DECIMAL(20,4) DEFAULT 0,
    bank_account_id BIGINT,
    status VARCHAR(20),
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 9. GST RECORDS
-- ============================================
CREATE TABLE gst_records (
    id BIGSERIAL PRIMARY KEY,
    gstin VARCHAR(20),
    gst_type VARCHAR(10),
    return_period VARCHAR(10),
    filing_date DATE,
    transaction_date DATE,
    transaction_type VARCHAR(30),
    invoice_reference VARCHAR(100),
    invoice_id BIGINT,
    order_id BIGINT,
    party_name VARCHAR(200),
    party_gstin VARCHAR(20),
    taxable_value DECIMAL(20,4) DEFAULT 0,
    tax_rate DECIMAL(10,4) DEFAULT 0,
    tax_amount DECIMAL(20,4) DEFAULT 0,
    cess_amount DECIMAL(20,4) DEFAULT 0,
    total_tax DECIMAL(20,4) DEFAULT 0,
    is_input_credit BOOLEAN DEFAULT FALSE,
    is_output_liability BOOLEAN DEFAULT FALSE,
    return_filed BOOLEAN DEFAULT FALSE,
    return_type VARCHAR(20),
    status VARCHAR(30),
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 10. TAX RECORDS (TDS, etc.)
-- ============================================
CREATE TABLE tax_records (
    id BIGSERIAL PRIMARY KEY,
    tax_type VARCHAR(30) NOT NULL,
    tax_name VARCHAR(100),
    description VARCHAR(500),
    tax_rate DECIMAL(10,4) DEFAULT 0,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    entity_number VARCHAR(50),
    taxable_amount DECIMAL(20,4) DEFAULT 0,
    tax_amount DECIMAL(20,4) DEFAULT 0,
    transaction_date DATE,
    due_date DATE,
    paid_date DATE,
    status VARCHAR(20),
    is_deducted_at_source BOOLEAN DEFAULT FALSE,
    tds_section VARCHAR(20),
    tds_rate DECIMAL(10,4) DEFAULT 0,
    payment_reference VARCHAR(200),
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 11. COMMISSION RULES & CALCULATIONS
-- ============================================
CREATE TABLE commission_rules (
    id BIGSERIAL PRIMARY KEY,
    rule_name VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    commission_type VARCHAR(30) NOT NULL,
    merchant_id BIGINT,
    category_id BIGINT,
    sub_category_id BIGINT,
    fixed_amount DECIMAL(20,4),
    percentage DECIMAL(10,4),
    min_amount DECIMAL(20,4),
    max_amount DECIMAL(20,4),
    tier_from DECIMAL(20,4),
    tier_to DECIMAL(20,4),
    priority INTEGER DEFAULT 0,
    effective_from DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    apply_on VARCHAR(30),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE commission_calculations (
    id BIGSERIAL PRIMARY KEY,
    rule_id BIGINT REFERENCES commission_rules(id),
    order_id BIGINT NOT NULL,
    order_number VARCHAR(50),
    merchant_id BIGINT,
    merchant_name VARCHAR(200),
    order_amount DECIMAL(20,4) DEFAULT 0,
    calculated_amount DECIMAL(20,4) DEFAULT 0,
    commission_rate DECIMAL(10,4) DEFAULT 0,
    commission_type VARCHAR(30),
    category_name VARCHAR(100),
    sub_category_name VARCHAR(100),
    status VARCHAR(30) DEFAULT 'CALCULATED',
    settlement_id BIGINT,
    is_settled BOOLEAN DEFAULT FALSE,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 12. BANK ACCOUNTS (Multi-bank support)
-- ============================================
CREATE TABLE bank_accounts (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(30) NOT NULL,
    entity_id BIGINT NOT NULL,
    account_holder_name VARCHAR(200),
    bank_name VARCHAR(200) NOT NULL,
    branch_name VARCHAR(200),
    account_number_encrypted VARCHAR(500) NOT NULL,
    account_type VARCHAR(30),
    ifsc_code VARCHAR(20) NOT NULL,
    micr_code VARCHAR(20),
    upi_id VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date DATE,
    current_balance DECIMAL(20,4) DEFAULT 0,
    available_balance DECIMAL(20,4) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'INR',
    last_synced_at TIMESTAMP,
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 13. BANK TRANSACTIONS
-- ============================================
CREATE TABLE bank_transactions (
    id BIGSERIAL PRIMARY KEY,
    bank_account_id BIGINT NOT NULL REFERENCES bank_accounts(id),
    transaction_date DATE NOT NULL,
    value_date DATE,
    description VARCHAR(500),
    reference_number VARCHAR(100),
    bank_reference VARCHAR(200),
    cheque_number VARCHAR(50),
    debit_amount DECIMAL(20,4) DEFAULT 0,
    credit_amount DECIMAL(20,4) DEFAULT 0,
    running_balance DECIMAL(20,4) DEFAULT 0,
    transaction_type VARCHAR(50),
    transaction_category VARCHAR(50),
    is_reconciled BOOLEAN DEFAULT FALSE,
    reconciliation_id BIGINT,
    reconciled_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'IMPORTED',
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 14. RECONCILIATION RECORDS
-- ============================================
CREATE TABLE reconciliation_records (
    id BIGSERIAL PRIMARY KEY,
    bank_transaction_id BIGINT REFERENCES bank_transactions(id),
    system_transaction_id BIGINT,
    system_transaction_type VARCHAR(50),
    bank_amount DECIMAL(20,4) DEFAULT 0,
    system_amount DECIMAL(20,4) DEFAULT 0,
    difference_amount DECIMAL(20,4) DEFAULT 0,
    match_type VARCHAR(30),
    status VARCHAR(30) NOT NULL DEFAULT 'UNMATCHED',
    matched_by VARCHAR(100),
    matched_at TIMESTAMP,
    discrepancy_reason VARCHAR(1000),
    resolution_notes VARCHAR(2000),
    is_auto_matched BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 15. WALLET TRANSACTIONS (Finance-side tracking)
-- ============================================
CREATE TABLE wallet_transactions (
    id BIGSERIAL PRIMARY KEY,
    wallet_id BIGINT NOT NULL,
    wallet_type VARCHAR(30),
    merchant_id BIGINT,
    customer_id BIGINT,
    transaction_type VARCHAR(30) NOT NULL,
    amount DECIMAL(20,4) DEFAULT 0,
    balance_before DECIMAL(20,4) DEFAULT 0,
    balance_after DECIMAL(20,4) DEFAULT 0,
    reference_number VARCHAR(100),
    reference_type VARCHAR(50),
    order_id BIGINT,
    payment_id BIGINT,
    settlement_id BIGINT,
    description VARCHAR(500),
    status VARCHAR(30) DEFAULT 'RECORDED',
    is_reconciled BOOLEAN DEFAULT FALSE,
    journal_entry_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 16. REFUND RECORDS
-- ============================================
CREATE TABLE refund_records (
    id BIGSERIAL PRIMARY KEY,
    refund_number VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL,
    order_number VARCHAR(50),
    merchant_id BIGINT,
    customer_id BIGINT,
    payment_id BIGINT,
    payment_reference VARCHAR(200),
    refund_reason VARCHAR(1000),
    refund_type VARCHAR(30),
    original_order_amount DECIMAL(20,4) DEFAULT 0,
    refund_amount DECIMAL(20,4) DEFAULT 0,
    commission_reversal DECIMAL(20,4) DEFAULT 0,
    delivery_fee_reversal DECIMAL(20,4) DEFAULT 0,
    platform_fee_reversal DECIMAL(20,4) DEFAULT 0,
    gst_reversal DECIMAL(20,4) DEFAULT 0,
    net_refund_amount DECIMAL(20,4) DEFAULT 0,
    refund_method VARCHAR(30),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_APPROVAL',
    initiated_by VARCHAR(100),
    approved_by VARCHAR(100),
    approved_at TIMESTAMP,
    processed_at TIMESTAMP,
    failure_reason VARCHAR(1000),
    journal_entry_id BIGINT,
    notes VARCHAR(2000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 17. REVENUE RECORDS
-- ============================================
CREATE TABLE revenue_records (
    id BIGSERIAL PRIMARY KEY,
    revenue_date DATE NOT NULL,
    revenue_type VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    order_id BIGINT,
    order_number VARCHAR(50),
    merchant_id BIGINT,
    merchant_name VARCHAR(200),
    category VARCHAR(100),
    gross_amount DECIMAL(20,4) DEFAULT 0,
    discount_amount DECIMAL(20,4) DEFAULT 0,
    net_amount DECIMAL(20,4) DEFAULT 0,
    commission_amount DECIMAL(20,4) DEFAULT 0,
    platform_fee DECIMAL(20,4) DEFAULT 0,
    delivery_fee DECIMAL(20,4) DEFAULT 0,
    gst_amount DECIMAL(20,4) DEFAULT 0,
    net_revenue DECIMAL(20,4) DEFAULT 0,
    is_recognized BOOLEAN DEFAULT FALSE,
    recognition_date DATE,
    status VARCHAR(20) DEFAULT 'RECORDED',
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 18. CASH FLOW ENTRIES
-- ============================================
CREATE TABLE cash_flow_entries (
    id BIGSERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    sub_category VARCHAR(50),
    description VARCHAR(500),
    inflow_amount DECIMAL(20,4) DEFAULT 0,
    outflow_amount DECIMAL(20,4) DEFAULT 0,
    net_amount DECIMAL(20,4) DEFAULT 0,
    reference_type VARCHAR(50),
    reference_id BIGINT,
    is_recurring BOOLEAN DEFAULT FALSE,
    report_id BIGINT,
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 19. FINANCIAL REPORTS
-- ============================================
CREATE TABLE financial_reports (
    id BIGSERIAL PRIMARY KEY,
    report_name VARCHAR(200) NOT NULL,
    report_type VARCHAR(30) NOT NULL,
    report_sub_type VARCHAR(30),
    entity_type VARCHAR(30),
    entity_id BIGINT,
    period_start DATE,
    period_end DATE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by VARCHAR(100),
    total_revenue DECIMAL(20,4) DEFAULT 0,
    total_expenses DECIMAL(20,4) DEFAULT 0,
    gross_profit DECIMAL(20,4) DEFAULT 0,
    net_profit DECIMAL(20,4) DEFAULT 0,
    total_assets DECIMAL(20,4) DEFAULT 0,
    total_liabilities DECIMAL(20,4) DEFAULT 0,
    total_equity DECIMAL(20,4) DEFAULT 0,
    operating_cash_flow DECIMAL(20,4) DEFAULT 0,
    investing_cash_flow DECIMAL(20,4) DEFAULT 0,
    financing_cash_flow DECIMAL(20,4) DEFAULT 0,
    report_data JSONB,
    status VARCHAR(20) DEFAULT 'GENERATED',
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by VARCHAR(100),
    approved_at TIMESTAMP,
    notes VARCHAR(2000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- 20. AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(30) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    entity_number VARCHAR(100),
    performed_by VARCHAR(100) NOT NULL,
    performed_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    old_value TEXT,
    new_value TEXT,
    changes_summary VARCHAR(2000),
    description VARCHAR(2000),
    is_system_generated BOOLEAN DEFAULT FALSE,
    request_id VARCHAR(100),
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_le_account_date ON ledger_entries(account_id, entry_date);
CREATE INDEX idx_le_transaction ON ledger_entries(transaction_type);
CREATE INDEX idx_le_reference ON ledger_entries(reference_number);
CREATE INDEX idx_je_date ON journal_entries(entry_date);
CREATE INDEX idx_je_reference ON journal_entries(reference_number);
CREATE INDEX idx_jel_account ON journal_entry_lines(account_id);
CREATE INDEX idx_jel_entry ON journal_entry_lines(journal_entry_id);
CREATE INDEX idx_ms_merchant ON merchant_settlements(merchant_id);
CREATE INDEX idx_ms_status ON merchant_settlements(status);
CREATE INDEX idx_inv_merchant ON invoices(merchant_id);
CREATE INDEX idx_inv_status ON invoices(status);
CREATE INDEX idx_inv_due_date ON invoices(due_date);
CREATE INDEX idx_bt_account ON bank_transactions(bank_account_id);
CREATE INDEX idx_bt_date ON bank_transactions(transaction_date);
CREATE INDEX idx_bt_ref ON bank_transactions(bank_reference);
CREATE INDEX idx_gst_return ON gst_records(return_period);
CREATE INDEX idx_gst_gstin ON gst_records(gstin);
CREATE INDEX idx_al_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_al_action ON audit_logs(action);
CREATE INDEX idx_al_user ON audit_logs(performed_by);
CREATE INDEX idx_al_timestamp ON audit_logs(performed_at);
CREATE INDEX idx_rr_status ON reconciliation_records(status);
CREATE INDEX idx_cfe_category ON cash_flow_entries(category);
CREATE INDEX idx_cfe_date ON cash_flow_entries(entry_date);
CREATE INDEX idx_fr_type ON financial_reports(report_type);
CREATE INDEX idx_fr_period ON financial_reports(period_start, period_end);
CREATE INDEX idx_wt_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wt_merchant ON wallet_transactions(merchant_id);
CREATE INDEX idx_cc_order ON commission_calculations(order_id);
CREATE INDEX idx_cc_merchant ON commission_calculations(merchant_id);
CREATE INDEX idx_po_number ON purchase_orders(po_number);
CREATE INDEX idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_ref_order ON refund_records(order_id);

-- ============================================
-- SEED DATA - Default Chart of Accounts
-- ============================================
INSERT INTO accounts (account_code, account_name, account_type, account_sub_type, is_control_account, level, sort_order) VALUES
('1', 'Assets', 'ASSET', NULL, TRUE, 1, 1),
('2', 'Liabilities', 'LIABILITY', NULL, TRUE, 1, 2),
('3', 'Equity', 'EQUITY', NULL, TRUE, 1, 3),
('4', 'Revenue', 'REVENUE', NULL, TRUE, 1, 4),
('5', 'Expenses', 'EXPENSE', NULL, TRUE, 1, 5);

INSERT INTO accounts (account_code, account_name, account_type, account_sub_type, parent_account_id, level, sort_order, is_control_account) VALUES
('101', 'Current Assets', 'ASSET', NULL, (SELECT id FROM accounts WHERE account_code = '1'), 2, 1, TRUE);

INSERT INTO accounts (account_code, account_name, account_type, account_sub_type, parent_account_id, level, sort_order) VALUES
('101001', 'Cash', 'ASSET', 'CASH', (SELECT id FROM accounts WHERE account_code = '101'), 3, 1),
('102001', 'Bank Accounts', 'ASSET', 'BANK', (SELECT id FROM accounts WHERE account_code = '101'), 3, 2),
('103001', 'Wallet Balance', 'ASSET', 'WALLET_BALANCE', (SELECT id FROM accounts WHERE account_code = '101'), 3, 3),
('104001', 'Accounts Receivable', 'ASSET', 'ACCOUNTS_RECEIVABLE', (SELECT id FROM accounts WHERE account_code = '101'), 3, 4),
('105001', 'GST Input Credit', 'ASSET', 'GST_INPUT_CREDIT', (SELECT id FROM accounts WHERE account_code = '101'), 3, 5),
('201001', 'Accounts Payable', 'LIABILITY', 'ACCOUNTS_PAYABLE', (SELECT id FROM accounts WHERE account_code = '2'), 2, 1),
('202001', 'GST Payable', 'LIABILITY', 'GST_OUTPUT_LIABILITY', (SELECT id FROM accounts WHERE account_code = '2'), 2, 2),
('202002', 'TDS Payable', 'LIABILITY', 'TDS_PAYABLE', (SELECT id FROM accounts WHERE account_code = '2'), 2, 3),
('203001', 'Salary Payable', 'LIABILITY', 'SALARY_PAYABLE', (SELECT id FROM accounts WHERE account_code = '2'), 2, 4),
('301001', 'Owners Equity', 'EQUITY', 'OWNERS_EQUITY', (SELECT id FROM accounts WHERE account_code = '3'), 2, 1),
('302001', 'Retained Earnings', 'EQUITY', 'RETAINED_EARNINGS', (SELECT id FROM accounts WHERE account_code = '3'), 2, 2),
('400001', 'Sales Revenue', 'REVENUE', 'SALES_REVENUE', (SELECT id FROM accounts WHERE account_code = '4'), 2, 1),
('401001', 'Commission Revenue', 'REVENUE', 'COMMISSION_REVENUE', (SELECT id FROM accounts WHERE account_code = '4'), 2, 2),
('402001', 'Platform Fees', 'REVENUE', 'PLATFORM_FEES', (SELECT id FROM accounts WHERE account_code = '4'), 2, 3),
('403001', 'Delivery Fees', 'REVENUE', 'DELIVERY_FEES', (SELECT id FROM accounts WHERE account_code = '4'), 2, 4),
('501001', 'Cost of Goods Sold', 'EXPENSE', 'COST_OF_GOODS_SOLD', (SELECT id FROM accounts WHERE account_code = '5'), 2, 1),
('502001', 'Commission Expense', 'EXPENSE', 'COMMISSION_EXPENSE', (SELECT id FROM accounts WHERE account_code = '5'), 2, 2),
('503001', 'Payment Gateway Fees', 'EXPENSE', 'PAYMENT_GATEWAY_FEES', (SELECT id FROM accounts WHERE account_code = '5'), 2, 3),
('504001', 'Salary Expenses', 'EXPENSE', 'SALARY_EXPENSES', (SELECT id FROM accounts WHERE account_code = '5'), 2, 4),
('505001', 'Marketing Expenses', 'EXPENSE', 'MARKETING_EXPENSES', (SELECT id FROM accounts WHERE account_code = '5'), 2, 5),
('506001', 'Bank Charges', 'EXPENSE', 'BANK_CHARGES', (SELECT id FROM accounts WHERE account_code = '5'), 2, 6);
