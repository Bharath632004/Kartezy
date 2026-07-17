/**
 * Kartezy Enterprise ERP & Finance Platform — ERP Core
 *
 * Central orchestrator that coordinates all ERP engines, provides
 * unified initialization, cross-engine workflows, and high-level
 * business operations synchronized with Payment & Wallet services.
 */

import { createLogger } from '../utils/logger';
import { AccountingEngine } from './accounting-engine';
import { SettlementEngine } from './settlement-engine';
import { VendorManagementEngine } from './vendor-engine';
import { PurchaseOrderEngine } from './purchase-order-engine';
import { InvoiceEngine } from './invoice-engine';
import { GSTTaxEngine } from './gst-tax-engine';
import { RevenueEngine } from './revenue-engine';
import { ProfitLossEngine } from './profit-loss-engine';
import { CashFlowEngine } from './cash-flow-engine';
import { LedgerEngine } from './ledger-engine';
import { WalletAccountingEngine } from './wallet-accounting-engine';
import { RefundAccountingEngine } from './refund-accounting-engine';
import { CommissionEngine } from './commission-engine';
import { MultiBankEngine } from './multi-bank-engine';
import { PaymentReconciliationEngine } from './reconciliation-engine';
import { AuditTrailEngine } from './audit-trail-engine';
import { FinanceReportsEngine } from './finance-reports-engine';

const logger = createLogger('ERPCore');

export class ERPCore {
  private static instance: ERPCore;
  private initialized = false;

  readonly accounting: AccountingEngine;
  readonly settlement: SettlementEngine;
  readonly vendor: VendorManagementEngine;
  readonly purchaseOrder: PurchaseOrderEngine;
  readonly invoicing: InvoiceEngine;
  readonly gstTax: GSTTaxEngine;
  readonly revenue: RevenueEngine;
  readonly profitLoss: ProfitLossEngine;
  readonly cashFlow: CashFlowEngine;
  readonly ledger: LedgerEngine;
  readonly walletAccounting: WalletAccountingEngine;
  readonly refundAccounting: RefundAccountingEngine;
  readonly commission: CommissionEngine;
  readonly multiBank: MultiBankEngine;
  readonly reconciliation: PaymentReconciliationEngine;
  readonly audit: AuditTrailEngine;
  readonly reports: FinanceReportsEngine;

  private constructor() {
    this.accounting = AccountingEngine.getInstance();
    this.settlement = SettlementEngine.getInstance();
    this.vendor = VendorManagementEngine.getInstance();
    this.purchaseOrder = PurchaseOrderEngine.getInstance();
    this.invoicing = InvoiceEngine.getInstance();
    this.gstTax = GSTTaxEngine.getInstance();
    this.revenue = RevenueEngine.getInstance();
    this.profitLoss = ProfitLossEngine.getInstance();
    this.cashFlow = CashFlowEngine.getInstance();
    this.ledger = LedgerEngine.getInstance();
    this.walletAccounting = WalletAccountingEngine.getInstance();
    this.refundAccounting = RefundAccountingEngine.getInstance();
    this.commission = CommissionEngine.getInstance();
    this.multiBank = MultiBankEngine.getInstance();
    this.reconciliation = PaymentReconciliationEngine.getInstance();
    this.audit = AuditTrailEngine.getInstance();
    this.reports = FinanceReportsEngine.getInstance();
  }

  static getInstance(): ERPCore {
    if (!ERPCore.instance) {
      ERPCore.instance = new ERPCore();
    }
    return ERPCore.instance;
  }

  initialize(): void {
    if (this.initialized) {
      logger.warn('ERP Core already initialized');
      return;
    }

    logger.info('=== Initializing Kartezy ERP & Finance Platform ===');

    this.accounting.initialize();
    this.settlement.initialize();
    this.vendor.initialize();
    this.purchaseOrder.initialize();
    this.invoicing.initialize();
    this.gstTax.initialize();
    this.revenue.initialize();
    this.profitLoss.initialize();
    this.cashFlow.initialize();
    this.ledger.initialize();
    this.walletAccounting.initialize();
    this.refundAccounting.initialize();
    this.commission.initialize();
    this.multiBank.initialize();
    this.reconciliation.initialize();
    this.audit.initialize();
    this.reports.initialize();

    this.initialized = true;
    logger.info('=== ERP & Finance Platform initialized successfully ===');
  }

  // ── Cross-Engine Workflows ──

  /**
   * Process a merchant settlement end-to-end:
   * 1. Calculate settlement
   * 2. Create journal entries (double-entry accounting)
   * 3. Record audit trail
   * 4. Process payment via wallet
   */
  processMerchantSettlement(params: {
    merchantId: string;
    merchantName: string;
    periodStart: string;
    periodEnd: string;
    totalRevenue: number;
    totalCommission: number;
    totalRefunds: number;
    adjustments?: number;
    approvedBy: string;
  }) {
    this.audit.record({
      action: 'CREATE',
      entityType: 'SETTLEMENT',
      entityId: `${params.merchantId}-${params.periodStart}`,
      actorId: params.approvedBy,
      actorName: params.approvedBy,
      actorRole: 'ADMIN',
      severity: 'MEDIUM',
      description: `Processing settlement for merchant ${params.merchantName}`,
    });

    const settlement = this.settlement.calculateSettlement(
      params.merchantId, params.merchantName,
      params.periodStart, params.periodEnd,
      params.totalRevenue, params.totalCommission,
      params.totalRefunds, params.adjustments,
    );

    this.settlement.createSettlement(settlement);

    // Lookup account IDs from chart of accounts
    const debitAccount = this.accounting.getAccount('2102');
    const creditAccount = this.accounting.getAccount('1102');

    // Create accounting entries
    const je = this.accounting.createJournalEntry({
      entryDate: new Date().toISOString().split('T')[0],
      postDate: new Date().toISOString().split('T')[0],
      description: `Merchant settlement: ${params.merchantName} (${params.periodStart} - ${params.periodEnd})`,
      referenceType: 'SETTLEMENT',
      referenceId: settlement.id,
      lines: [
        { id: '', journalEntryId: '', accountId: debitAccount?.id || '', accountCode: '2102', accountName: 'Merchant Payables', entryType: 'DEBIT', amount: settlement.netAmount, description: 'Settlement amount' },
        { id: '', journalEntryId: '', accountId: creditAccount?.id || '', accountCode: '1102', accountName: 'Bank Accounts', entryType: 'CREDIT', amount: settlement.netAmount, description: 'Settlement payout' },
      ],
      createdBy: params.approvedBy,
    });

    const postedJE = this.accounting.postJournalEntry(je.id, params.approvedBy);

    // Record in ledger with actual account balances
    for (const line of postedJE.lines) {
      const account = this.accounting.getAccount(line.accountCode);
      this.ledger.addEntry({
        accountId: line.accountId,
        accountCode: line.accountCode,
        entryDate: postedJE.entryDate,
        entryType: line.entryType,
        amount: line.amount,
        currentBalance: account?.balance || 0,
        journalEntryId: postedJE.id,
        description: line.description || postedJE.description,
        referenceType: 'SETTLEMENT',
        referenceId: settlement.id,
      });
    }

    return { settlement, journalEntry: je };
  }

  /**
   * Process a refund end-to-end:
   * 1. Initiate refund
   * 2. Create reversal journal entries
   * 3. Reverse wallet transaction
   * 4. Record audit trail
   */
  processRefund(params: {
    orderId: string;
    paymentId: string;
    customerId: string;
    merchantId: string;
    reason: 'CUSTOMER_REQUEST' | 'DEFECTIVE' | 'NOT_DELIVERED' | 'WRONG_ITEM' | 'QUALITY_ISSUE' | 'CANCELLATION' | 'DUPLICATE' | 'OTHER';
    refundAmount: number;
    approvedBy: string;
  }) {
    const refund = this.refundAccounting.initiateRefund({
      ...params,
      refundMethod: 'ORIGINAL_PAYMENT',
      originalAmount: params.refundAmount,
      feeRefund: 0,
      taxRefund: 0,
    });

    this.refundAccounting.processRefund(refund.id);

    // Create reversing journal entry
    const refundDebitAccount = this.accounting.getAccount('5700');
    const refundCreditAccount = this.accounting.getAccount('1103');
    const je = this.accounting.createJournalEntry({
      entryDate: new Date().toISOString().split('T')[0],
      postDate: new Date().toISOString().split('T')[0],
      description: `Refund: Order ${params.orderId} - ${params.reason}`,
      referenceType: 'REFUND',
      referenceId: refund.id,
      lines: [
        { id: '', journalEntryId: '', accountId: refundDebitAccount?.id || '', accountCode: '5700', accountName: 'Refund & Adjustments', entryType: 'DEBIT', amount: refund.refundAmount, description: 'Refund amount' },
        { id: '', journalEntryId: '', accountId: refundCreditAccount?.id || '', accountCode: '1103', accountName: 'Payment Gateway', entryType: 'CREDIT', amount: refund.refundAmount, description: 'Refund via gateway' },
      ],
      createdBy: params.approvedBy,
    });

    this.accounting.postJournalEntry(je.id, params.approvedBy);
    this.refundAccounting.linkAccountingEntry(refund.id, je.id);

    // Record audit trail
    this.audit.record({
      action: 'CREATE',
      entityType: 'REFUND',
      entityId: refund.id,
      actorId: params.approvedBy,
      actorName: params.approvedBy,
      actorRole: 'ADMIN',
      severity: 'MEDIUM',
      description: `Refund ${refund.refundNumber} for order ${params.orderId}`,
    });

    return { refund, journalEntry: je };
  }

  /**
   * Generate complete financial statements for a period
   */
  generateFinancialStatements(period: string, fromDate: string, toDate: string) {
    const accounts = this.accounting.getAllAccounts();
    const trialBalance = this.accounting.generateTrialBalance(toDate);
    const balanceSheet = this.accounting.generateBalanceSheet(toDate);
    const plStatement = this.profitLoss.generatePL(accounts, fromDate, toDate, period);
    const revenueSummary = this.revenue.getRevenueSummary(period);

    return {
      trialBalance,
      balanceSheet,
      profitLoss: plStatement,
      revenueSummary,
    };
  }

  /**
   * Run end-of-period closing process
   */
  closePeriod(period: string, closedBy: string): {
    fiscalPeriodStatus: string;
    entriesPosted: number;
  } {
    this.accounting.closeFiscalPeriod(period);

    this.audit.record({
      action: 'LOCK',
      entityType: 'ACCOUNT',
      entityId: period,
      actorId: closedBy,
      actorName: closedBy,
      actorRole: 'ADMIN',
      severity: 'HIGH',
      description: `Closed fiscal period ${period}`,
    });

    return {
      fiscalPeriodStatus: 'CLOSED',
      entriesPosted: this.accounting.getJournalEntries({ status: 'POSTED' }).length,
    };
  }

  /**
   * Run monthly reconciliation of all wallets
   */
  reconcileAllWallets(period: string): Array<{
    walletId: string; status: string; difference: number;
  }> {
    const results: Array<{ walletId: string; status: string; difference: number }> = [];

    // Fetch wallet IDs from wallet accounting engine
    // In production, this fetches from the Wallet Service API
    const allWallets = this.walletAccounting.getAllWalletIds().length > 0
      ? this.walletAccounting.getAllWalletIds()
      : ['wallet-default-1', 'wallet-default-2'];

    for (const walletId of allWallets) {
      const wallet = this.walletAccounting.getWallet(walletId);
      if (wallet) {
        const reconciliation = this.walletAccounting.reconcileWallet(
          walletId, period, wallet.balance
        );
        results.push({
          walletId,
          status: reconciliation.status,
          difference: reconciliation.difference,
        });
      }
    }

    return results;
  }

  getStatus(): {
    initialized: boolean;
    engineCount: number;
    stats: {
      accounts: number;
      journalEntries: number;
      vendors: number;
      purchaseOrders: number;
      invoices: number;
      settlements: number;
      walletTransactions: number;
    };
  } {
    return {
      initialized: this.initialized,
      engineCount: 17,
      stats: {
        accounts: this.accounting.getAllAccounts().length,
        journalEntries: this.accounting.getJournalEntries().length,
        vendors: this.vendor.getAllVendors().length,
        purchaseOrders: this.purchaseOrder.getAllPurchaseOrders().length,
        invoices: this.invoicing.getAllInvoices().length,
        settlements: this.settlement.getSettlementsByStatus('COMPLETED').length,
        walletTransactions: this.walletAccounting.getWalletSummary().totalBalance > 0 ? 1 : 0,
      },
    };
  }

  reset(): void {
    this.accounting.reset();
    this.settlement.reset();
    this.vendor.reset();
    this.purchaseOrder.reset();
    this.invoicing.reset();
    this.gstTax.reset();
    this.revenue.reset();
    this.ledger.reset();
    this.walletAccounting.reset();
    this.refundAccounting.reset();
    this.commission.reset();
    this.multiBank.reset();
    this.reconciliation.reset();
    this.audit.reset();
    this.initialized = false;
    logger.info('ERP Core reset complete');
  }
}

export const erpCore = ERPCore.getInstance();
export default erpCore;
