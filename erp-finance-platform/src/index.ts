/**
 * Kartezy Enterprise ERP & Finance Platform
 * 
 * Complete financial management with merchant settlements, vendor management,
 * purchase orders, invoicing, GST, tax engine, accounting, multi-bank support,
 * payment reconciliation, commission engine, and audit trail.
 * 
 * Fully synchronized with Payment Service and Wallet Service.
 */

// ─── Types ───
export type {
  CurrencyCode, Locale, Money, Address, DateRange, EntityStatus, ApprovalStatus,
  SettlementStatus, SettlementPeriod, SettlementMethod, MerchantSettlement,
  SettlementBatch, SettlementRule,
  VendorType, VendorStatus, ContractType, VendorRiskLevel, Vendor, VendorContract, VendorPerformance,
  POStatus, POItemStatus, PODeliveryTerms, PurchaseOrder, PurchaseOrderItem,
  InvoiceType, InvoiceStatus, PaymentTerms, Invoice, InvoiceLineItem, TaxBreakdown,
  GSTType, GSTFilingStatus, GSTRegistration, GSTReturn, GSTSupplySummary, TaxRate, TaxCalculation,
  AccountType, AccountSubType, EntryType, JournalStatus, FiscalPeriodStatus,
  ChartOfAccount, JournalEntry, JournalLine, TrialBalance, TrialBalanceAccount,
  BalanceSheet, BalanceSheetSection,
  RevenueCategory, RevenueRecord, RevenueSummary, RevenueRecognitionMethod,
  ProfitLossStatement, PLSection,
  CashFlowCategory, CashFlowStatement, CashFlowActivity, CashFlowForecast,
  LedgerEntry, GeneralLedger, SubsidiaryLedger,
  WalletTransactionType, WalletTransactionStatus, WalletAccount, WalletTransaction,
  WalletReconciliation, WalletDiscrepancy,
  RefundReason, RefundMethod, RefundStatus, RefundRecord,
  CommissionType, CommissionStatus, CommissionPlan, CommissionEntry, CommissionSummary,
  BankAccountType, BankConnectionStatus, BankAccount, BankConnection, BankTransaction,
  ReconciliationStatus, ReconciliationMethod, ReconciliationRule, ReconciliationResult, ReconciliationDetail,
  AuditAction, AuditEntityType, AuditSeverity, AuditEntry, AuditChange, AuditReport,
  FinanceReportType, ReportFormat, FinanceReportRequest, FinanceReportResult,
} from './types';

// ─── Zod Schemas ───
export {
  MoneySchema, AddressSchema, DateRangeSchema, BankAccountSchema, VendorSchema,
} from './types';

// ─── Engines ───
export { AccountingEngine } from './engines/accounting-engine';
export { SettlementEngine } from './engines/settlement-engine';
export { VendorManagementEngine } from './engines/vendor-engine';
export { PurchaseOrderEngine } from './engines/purchase-order-engine';
export { InvoiceEngine } from './engines/invoice-engine';
export { GSTTaxEngine } from './engines/gst-tax-engine';
export { RevenueEngine } from './engines/revenue-engine';
export { ProfitLossEngine } from './engines/profit-loss-engine';
export { CashFlowEngine } from './engines/cash-flow-engine';
export { LedgerEngine } from './engines/ledger-engine';
export { WalletAccountingEngine } from './engines/wallet-accounting-engine';
export { RefundAccountingEngine } from './engines/refund-accounting-engine';
export { CommissionEngine } from './engines/commission-engine';
export { MultiBankEngine } from './engines/multi-bank-engine';
export { PaymentReconciliationEngine } from './engines/reconciliation-engine';
export { AuditTrailEngine } from './engines/audit-trail-engine';
export { FinanceReportsEngine } from './engines/finance-reports-engine';
export { ERPCore } from './engines/erp-core';

// ─── Utils ───
export {
  generateId, generateNumber, formatCurrency, formatNumber,
  formatPercent, calculateGrowthRate, roundTo, sum, avg, parseDateRange,
} from './utils/helpers';
export { createLogger } from './utils/logger';

// ─── Default Instance ───
export { erpCore } from './engines/erp-core';
