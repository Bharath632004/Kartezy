/**
 * Kartezy Enterprise ERP & Finance Platform — Core Types
 *
 * Complete type definitions for merchant settlements, vendor management,
 * purchase orders, invoicing, GST/tax, accounting, revenue, P&L, cash flow,
 * ledger, wallet accounting, refund accounting, commissions, multi-bank,
 * reconciliation, and audit trail.
 */

import { z } from 'zod';

// ──────────────────────────────────────────────
// Common / Shared
// ──────────────────────────────────────────────

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';
export type Locale = 'en-IN' | 'en-US' | 'en-GB';

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface DateRange {
  start: string; // ISO date
  end: string;   // ISO date
}

export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CLOSED';
export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

// ──────────────────────────────────────────────
// Merchant Settlements
// ──────────────────────────────────────────────

export type SettlementStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
export type SettlementPeriod = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
export type SettlementMethod = 'BANK_TRANSFER' | 'UPI' | 'CHECK' | 'WALLET';

export interface MerchantSettlement {
  id: string;
  merchantId: string;
  merchantName: string;
  periodStart: string;
  periodEnd: string;
  totalRevenue: number;
  totalCommission: number;
  totalRefunds: number;
  totalAdjustments: number;
  netAmount: number;
  tdsDeducted: number;
  gstDeducted: number;
  finalAmount: number;
  status: SettlementStatus;
  settlementMethod: SettlementMethod;
  bankAccountId?: string;
  payoutReference?: string;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface SettlementBatch {
  id: string;
  period: SettlementPeriod;
  periodStart: string;
  periodEnd: string;
  merchantCount: number;
  totalNetAmount: number;
  status: SettlementStatus;
  settlements: MerchantSettlement[];
  processedAt?: string;
  createdAt: string;
}

export interface SettlementRule {
  id: string;
  merchantId: string;
  period: SettlementPeriod;
  settlementMethod: SettlementMethod;
  minimumAmount: number;
  holdPeriodDays: number;
  tdsRate: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Vendor & Supplier Management
// ──────────────────────────────────────────────

export type VendorType = 'SUPPLIER' | 'MANUFACTURER' | 'DISTRIBUTOR' | 'SERVICE_PROVIDER' | 'CONTRACTOR';
export type VendorStatus = EntityStatus;
export type ContractType = 'FIXED' | 'PER_UNIT' | 'REVENUE_SHARE' | 'RETAINER';
export type VendorRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Vendor {
  id: string;
  vendorType: VendorType;
  name: string;
  legalName: string;
  gstin?: string;
  pan?: string;
  email: string;
  phone: string;
  address: Address;
  bankAccount?: BankAccount;
  status: VendorStatus;
  riskLevel: VendorRiskLevel;
  rating: number;
  totalOrders: number;
  totalSpend: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  categories: string[];
  tags: string[];
  contracts: VendorContract[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorContract {
  id: string;
  vendorId: string;
  contractType: ContractType;
  startDate: string;
  endDate?: string;
  terms: string;
  rateAmount: number;
  rateUnit?: string;
  minimumCommitment?: number;
  noticePeriodDays: number;
  autoRenew: boolean;
  status: EntityStatus;
  signedAt?: string;
  createdAt: string;
}

export interface VendorPerformance {
  vendorId: string;
  period: string;
  totalOrders: number;
  onTimeDeliveries: number;
  qualityScore: number;
  responseTimeHours: number;
  returnRate: number;
  rating: number;
  spend: number;
}

// ──────────────────────────────────────────────
// Purchase Orders
// ──────────────────────────────────────────────

export type POStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'ACKNOWLEDGED' | 'PARTIALLY_FULFILLED' | 'FULFILLED' | 'CANCELLED' | 'CLOSED';
export type POItemStatus = 'PENDING' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
export type PODeliveryTerms = 'EXW' | 'FOB' | 'CIF' | 'DAP' | 'DDP';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  status: POStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  discount: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  currency: CurrencyCode;
  deliveryTerms: PODeliveryTerms;
  expectedDeliveryDate: string;
  deliveryAddress: Address;
  billingAddress: Address;
  notes?: string;
  termsAndConditions?: string;
  approvedBy?: string;
  approvedAt?: string;
  sentAt?: string;
  fulfilledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  poId: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;
  status: POItemStatus;
  receivedQuantity: number;
  rejectedQuantity: number;
  expectedDate?: string;
}

// ──────────────────────────────────────────────
// Invoices
// ──────────────────────────────────────────────

export type InvoiceType = 'SALES' | 'PURCHASE' | 'CREDIT_NOTE' | 'DEBIT_NOTE' | 'PROFORMA';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';
export type PaymentTerms = 'IMMEDIATE' | 'NET_7' | 'NET_15' | 'NET_30' | 'NET_45' | 'NET_60' | 'CUSTOM';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  status: InvoiceStatus;
  referenceId: string;
  referenceType: 'ORDER' | 'PO' | 'SUBSCRIPTION' | 'SETTLEMENT';
  vendorId?: string;
  customerId?: string;
  merchantId?: string;
  billTo: {
    name: string;
    gstin?: string;
    address: Address;
  };
  shipTo?: Address;
  items: InvoiceLineItem[];
  subtotal: number;
  discount: number;
  taxableAmount: number;
  taxDetails: TaxBreakdown;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  currency: CurrencyCode;
  paymentTerms: PaymentTerms;
  dueDate: string;
  invoiceDate: string;
  paymentDate?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  hsnSacCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  taxableValue: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

export interface TaxBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
  totalTax: number;
}

// ──────────────────────────────────────────────
// GST & Taxes
// ──────────────────────────────────────────────

export type GSTType = 'CGST' | 'SGST' | 'IGST' | 'CESS';
export type GSTFilingStatus = 'NOT_FILED' | 'DRAFT' | 'FILED' | 'REVISED' | 'ASSESSED';

export interface GSTRegistration {
  id: string;
  gstin: string;
  legalName: string;
  tradeName: string;
  constitutionType: string;
  registrationDate: string;
  cancellationDate?: string;
  stateCode: string;
  stateName: string;
  status: EntityStatus;
  isComposite: boolean;
  businessType: string[];
}

export interface GSTReturn {
  id: string;
  returnType: 'GSTR1' | 'GSTR3B' | 'GSTR9' | 'GSTR9C';
  period: string; // YYYY-MM
  financialYear: string;
  filingStatus: GSTFilingStatus;
  dueDate: string;
  filedDate?: string;
  totalSales: number;
  taxableSales: number;
  exemptSales: number;
  outwardSupply: GSTSupplySummary;
  inwardSupply: GSTSupplySummary;
  taxLiability: TaxBreakdown;
  inputTaxCredit: TaxBreakdown;
  netPayable: TaxBreakdown;
  lateFee?: number;
  interest?: number;
  totalPaid: number;
  referenceNumber?: string;
  createdAt: string;
}

export interface GSTSupplySummary {
  b2b: number;
  b2c: number;
  exports: number;
  sez: number;
  deemedExports: number;
  advances: number;
  creditNotes: number;
  debitNotes: number;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  gstType: GSTType;
  hsnSacCode?: string;
  category: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface TaxCalculation {
  taxableValue: number;
  taxRate: number;
  taxType: GSTType;
  taxAmount: number;
  cessAmount: number;
  totalTax: number;
}

// ──────────────────────────────────────────────
// Accounting (Double-Entry)
// ──────────────────────────────────────────────

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE' | 'CONTRA_ASSET' | 'CONTRA_LIABILITY' | 'CONTRA_EQUITY' | 'CONTRA_REVENUE' | 'CONTRA_EXPENSE';
export type AccountSubType = 'CURRENT' | 'NON_CURRENT' | 'DIRECT' | 'INDIRECT' | 'OPERATING' | 'NON_OPERATING';
export type EntryType = 'DEBIT' | 'CREDIT';
export type JournalStatus = 'DRAFT' | 'POSTED' | 'REVERSED';
export type FiscalPeriodStatus = 'OPEN' | 'CLOSED' | 'LOCKED';

export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  accountSubType: AccountSubType;
  parentId?: string;
  isActive: boolean;
  isControlAccount: boolean;
  balance: number;
  currency: CurrencyCode;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  postDate: string;
  description: string;
  referenceType?: 'ORDER' | 'INVOICE' | 'PAYMENT' | 'REFUND' | 'SETTLEMENT' | 'COMMISSION' | 'ADJUSTMENT' | 'TRANSFER';
  referenceId?: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: JournalStatus;
  reversalOf?: string;
  reversedBy?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalLine {
  id: string;
  journalEntryId: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  entryType: EntryType;
  amount: number;
  description?: string;
  costCenter?: string;
  projectId?: string;
  customerId?: string;
  vendorId?: string;
}

export interface TrialBalance {
  asOfDate: string;
  accounts: TrialBalanceAccount[];
  totalDebit: number;
  totalCredit: number;
}

export interface TrialBalanceAccount {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface BalanceSheet {
  asOfDate: string;
  assets: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  equity: BalanceSheetSection;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface BalanceSheetSection {
  title: string;
  total: number;
  items: Array<{ name: string; amount: number; accountCode: string }>;
}

// ──────────────────────────────────────────────
// Revenue
// ──────────────────────────────────────────────

export type RevenueCategory = 'COMMISSION' | 'DELIVERY_FEES' | 'SUBSCRIPTION' | 'ADVERTISING' | 'INTEREST' | 'OTHER';
export type RevenueRecognitionMethod = 'POINT_IN_TIME' | 'OVER_TIME' | 'MILESTONE';

export interface RevenueRecord {
  id: string;
  revenueCategory: RevenueCategory;
  sourceId: string;
  sourceType: 'ORDER' | 'SUBSCRIPTION' | 'ADVERTISING' | 'SETTLEMENT';
  amount: number;
  currency: CurrencyCode;
  recognizedDate: string;
  recognitionMethod: RevenueRecognitionMethod;
  deferredAmount: number;
  recognizedAmount: number;
  period: string; // YYYY-MM
  customerId?: string;
  merchantId?: string;
  description?: string;
  createdAt: string;
}

export interface RevenueSummary {
  period: string;
  totalRevenue: number;
  byCategory: Record<RevenueCategory, number>;
  previousPeriod: number;
  growthRate: number;
  deferredRevenue: number;
  recognizedRevenue: number;
}

// ──────────────────────────────────────────────
// P&L (Profit & Loss)
// ──────────────────────────────────────────────

export interface ProfitLossStatement {
  period: string;
  fromDate: string;
  toDate: string;
  revenue: PLSection;
  costOfGoodsSold: PLSection;
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: PLSection;
  operatingIncome: number;
  operatingMargin: number;
  otherIncome: PLSection;
  otherExpenses: PLSection;
  netProfitBeforeTax: number;
  taxExpense: number;
  effectiveTaxRate: number;
  netProfit: number;
  netMargin: number;
  previousPeriod: {
    netProfit: number;
    revenue: number;
  };
  yoyGrowth: number;
}

export interface PLSection {
  title: string;
  total: number;
  items: Array<{ name: string; amount: number; percentageOfRevenue: number }>;
}

// ──────────────────────────────────────────────
// Cash Flow
// ──────────────────────────────────────────────

export type CashFlowCategory = 'OPERATING' | 'INVESTING' | 'FINANCING';

export interface CashFlowStatement {
  period: string;
  fromDate: string;
  toDate: string;
  openingBalance: number;
  operatingActivities: CashFlowActivity[];
  investingActivities: CashFlowActivity[];
  financingActivities: CashFlowActivity[];
  netOperatingCashFlow: number;
  netInvestingCashFlow: number;
  netFinancingCashFlow: number;
  netCashFlow: number;
  closingBalance: number;
}

export interface CashFlowActivity {
  name: string;
  amount: number;
  category: CashFlowCategory;
  description?: string;
}

export interface CashFlowForecast {
  period: string;
  projectedOpening: number;
  projectedInflows: number;
  projectedOutflows: number;
  projectedClosing: number;
  confidenceInterval: { lower: number; upper: number };
  riskFactors: string[];
}

// ──────────────────────────────────────────────
// Ledger
// ──────────────────────────────────────────────

export interface LedgerEntry {
  id: string;
  accountId: string;
  accountCode: string;
  entryDate: string;
  entryType: EntryType;
  amount: number;
  balance: number;
  journalEntryId: string;
  description: string;
  referenceType?: string;
  referenceId?: string;
  customerId?: string;
  vendorId?: string;
  createdAt: string;
}

export interface GeneralLedger {
  accountId: string;
  accountCode: string;
  accountName: string;
  entries: LedgerEntry[];
  openingBalance: number;
  closingBalance: number;
  periodDebitTotal: number;
  periodCreditTotal: number;
}

export interface SubsidiaryLedger {
  type: 'CUSTOMER' | 'VENDOR' | 'MERCHANT';
  entityId: string;
  entityName: string;
  entries: LedgerEntry[];
  balance: number;
}

// ──────────────────────────────────────────────
// Wallet Accounting
// ──────────────────────────────────────────────

export type WalletTransactionType = 'TOP_UP' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND' | 'COMMISSION' | 'SETTLEMENT' | 'ADJUSTMENT' | 'TRANSFER' | 'CASHBACK' | 'REWARD';
export type WalletTransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export interface WalletAccount {
  id: string;
  entityId: string;
  entityType: 'CUSTOMER' | 'MERCHANT' | 'DELIVERY_PARTNER';
  balance: number;
  currency: CurrencyCode;
  previousBalance: number;
  lastTransactionAt?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  transactionType: WalletTransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: WalletTransactionStatus;
  referenceType: string;
  referenceId: string;
  description: string;
  reversalOf?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface WalletReconciliation {
  id: string;
  walletId: string;
  period: string;
  expectedBalance: number;
  actualBalance: number;
  difference: number;
  discrepancyCount: number;
  discrepancies: WalletDiscrepancy[];
  reconciledAt: string;
  status: 'MATCHED' | 'UNMATCHED' | 'INVESTIGATING';
}

export interface WalletDiscrepancy {
  transactionId: string;
  expectedAmount: number;
  actualAmount: number;
  difference: number;
  reason: string;
}

// ──────────────────────────────────────────────
// Refund Accounting
// ──────────────────────────────────────────────

export type RefundReason = 'CUSTOMER_REQUEST' | 'DEFECTIVE' | 'NOT_DELIVERED' | 'WRONG_ITEM' | 'QUALITY_ISSUE' | 'CANCELLATION' | 'DUPLICATE' | 'OTHER';
export type RefundMethod = 'ORIGINAL_PAYMENT' | 'WALLET' | 'BANK_TRANSFER' | 'UPI';
export type RefundStatus = 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export interface RefundRecord {
  id: string;
  refundNumber: string;
  orderId: string;
  paymentId: string;
  customerId: string;
  merchantId: string;
  reason: RefundReason;
  refundMethod: RefundMethod;
  status: RefundStatus;
  originalAmount: number;
  refundAmount: number;
  feeRefund: number;
  taxRefund: number;
  netRefund: number;
  currency: CurrencyCode;
  accountingEntries: string[]; // Journal entry IDs
  gatewayReference?: string;
  processedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Commission Engine
// ──────────────────────────────────────────────

export type CommissionType = 'FIXED' | 'PERCENTAGE' | 'TIERED' | 'CATEGORY_BASED';
export type CommissionStatus = 'CALCULATED' | 'APPROVED' | 'PAID' | 'DISPUTED';

export interface CommissionPlan {
  id: string;
  name: string;
  commissionType: CommissionType;
  merchantTier: string;
  defaultRate: number;
  categoryRates: Record<string, number>;
  tierRates: Array<{ minRevenue: number; maxRevenue: number; rate: number }>;
  capAmount?: number;
  minAmount?: number;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
}

export interface CommissionEntry {
  id: string;
  merchantId: string;
  merchantName: string;
  orderId: string;
  orderAmount: number;
  commissionType: CommissionType;
  commissionRate: number;
  commissionAmount: number;
  category: string;
  status: CommissionStatus;
  period: string;
  settlementId?: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

export interface CommissionSummary {
  merchantId: string;
  merchantName: string;
  period: string;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  effectiveRate: number;
  byCategory: Record<string, { revenue: number; commission: number; rate: number }>;
  byStatus: Record<CommissionStatus, number>;
  previousPeriod: number;
  growthRate: number;
}

// ──────────────────────────────────────────────
// Multi-Bank Support
// ──────────────────────────────────────────────

export type BankAccountType = 'SAVINGS' | 'CURRENT' | 'ESCROW' | 'LOAN';
export type BankConnectionStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'REVOKED';

export interface BankAccount {
  id: string;
  entityId: string;
  entityType: 'MERCHANT' | 'VENDOR' | 'COMPANY' | 'CUSTOMER';
  accountType: BankAccountType;
  accountHolderName: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  accountNumber: string; // Masked for display
  encryptedAccountNumber: string;
  upiId?: string;
  isPrimary: boolean;
  isVerified: boolean;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BankConnection {
  id: string;
  bankName: string;
  accountId: string;
  connectionType: 'UPI' | 'NET_BANKING' | 'API' | 'MANUAL';
  status: BankConnectionStatus;
  lastSyncedAt?: string;
  syncFrequency: 'REAL_TIME' | 'HOURLY' | 'DAILY';
  credentials: Record<string, string>;
  expiresAt?: string;
  createdAt: string;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  transactionDate: string;
  valueDate: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  category?: string;
  isReconciled: boolean;
  matchedTransactionId?: string;
  matchStatus: 'UNMATCHED' | 'MATCHED' | 'PARTIAL' | 'MANUAL';
  importedAt: string;
}

// ──────────────────────────────────────────────
// Payment Reconciliation
// ──────────────────────────────────────────────

export type ReconciliationStatus = 'UNMATCHED' | 'MATCHED' | 'PARTIAL' | 'DISCREPANCY' | 'MANUALLY_RESOLVED';
export type ReconciliationMethod = 'AUTO_AMOUNT' | 'AUTO_REFERENCE' | 'AUTO_DATE' | 'MANUAL';

export interface ReconciliationRule {
  id: string;
  name: string;
  field: string;
  operator: 'EXACT' | 'CONTAINS' | 'RANGE' | 'FUZZY';
  threshold?: number;
  priority: number;
  isActive: boolean;
}

export interface ReconciliationResult {
  id: string;
  period: string;
  bankAccountId: string;
  totalBankTransactions: number;
  totalPaymentTransactions: number;
  matchedCount: number;
  unmatchedBankCount: number;
  unmatchedPaymentCount: number;
  partialMatchCount: number;
  discrepancyCount: number;
  totalMatchedAmount: number;
  totalDiscrepancyAmount: number;
  status: ReconciliationStatus;
  details: ReconciliationDetail[];
  completedAt: string;
}

export interface ReconciliationDetail {
  bankTransactionId?: string;
  paymentTransactionId?: string;
  amount: number;
  bankAmount?: number;
  paymentAmount?: number;
  difference: number;
  matchMethod: ReconciliationMethod;
  status: ReconciliationStatus;
  confidence: number;
  notes?: string;
}

// ──────────────────────────────────────────────
// Audit Trail
// ──────────────────────────────────────────────

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'REVERSE' | 'LOCK' | 'UNLOCK' | 'EXPORT' | 'VIEW';
export type AuditEntityType = 'SETTLEMENT' | 'VENDOR' | 'PURCHASE_ORDER' | 'INVOICE' | 'GST_RETURN' | 'JOURNAL_ENTRY' | 'ACCOUNT' | 'COMMISSION' | 'REFUND' | 'RECONCILIATION' | 'BANK_ACCOUNT' | 'CONTRACT' | 'PAYMENT';
export type AuditSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AuditEntry {
  id: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  changes: AuditChange[];
  severity: AuditSeverity;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  description: string;
  timestamp: string;
  immutable: true; // Always true
}

export interface AuditChange {
  field: string;
  oldValue?: unknown;
  newValue?: unknown;
}

export interface AuditReport {
  fromDate: string;
  toDate: string;
  totalEntries: number;
  byAction: Record<AuditAction, number>;
  byEntity: Record<AuditEntityType, number>;
  bySeverity: Record<AuditSeverity, number>;
  entries: AuditEntry[];
}

// ──────────────────────────────────────────────
// Finance Reports
// ──────────────────────────────────────────────

export type FinanceReportType =
  | 'PROFIT_LOSS'
  | 'BALANCE_SHEET'
  | 'CASH_FLOW'
  | 'TRIAL_BALANCE'
  | 'GENERAL_LEDGER'
  | 'ACCOUNTS_PAYABLE'
  | 'ACCOUNTS_RECEIVABLE'
  | 'COMMISSION_REPORT'
  | 'SETTLEMENT_REPORT'
  | 'GST_REPORT'
  | 'TAX_SUMMARY'
  | 'REVENUE_BREAKDOWN'
  | 'EXPENSE_BREAKDOWN'
  | 'AGING_REPORT'
  | 'BANK_RECONCILIATION'
  | 'AUDIT_TRAIL';

export type ReportFormat = 'CSV' | 'EXCEL' | 'PDF' | 'JSON';

export interface FinanceReportRequest {
  reportType: FinanceReportType;
  format: ReportFormat;
  dateRange: DateRange;
  filters?: Record<string, unknown>;
  groupBy?: string[];
  includeCharts?: boolean;
}

export interface FinanceReportResult {
  id: string;
  reportType: FinanceReportType;
  format: ReportFormat;
  generatedAt: string;
  dateRange: DateRange;
  rowCount: number;
  size: number;
  data: unknown;
  metadata: Record<string, unknown>;
}

// ──────────────────────────────────────────────
// Zod Validation Schemas
// ──────────────────────────────────────────────

export const MoneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']),
});

export const AddressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/),
  country: z.string().default('India'),
});

export const DateRangeSchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const BankAccountSchema = z.object({
  entityId: z.string().min(1),
  entityType: z.enum(['MERCHANT', 'VENDOR', 'COMPANY', 'CUSTOMER']),
  accountType: z.enum(['SAVINGS', 'CURRENT', 'ESCROW', 'LOAN']),
  accountHolderName: z.string().min(1),
  bankName: z.string().min(1),
  branchName: z.string().min(1),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/),
  accountNumber: z.string().min(9).max(18),
  upiId: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const VendorSchema = z.object({
  vendorType: z.enum(['SUPPLIER', 'MANUFACTURER', 'DISTRIBUTOR', 'SERVICE_PROVIDER', 'CONTRACTOR']),
  name: z.string().min(1),
  legalName: z.string().min(1),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).optional(),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/),
  address: AddressSchema,
});
