/**
 * Kartezy Enterprise ERP & Finance Platform — Wallet Accounting Engine
 *
 * Wallet balance management, transaction tracking, reconciliation with
 * wallet service, and accounting integration for all wallet operations.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum } from '../utils/helpers';
import type {
  WalletAccount, WalletTransaction, WalletTransactionType,
  WalletTransactionStatus, WalletReconciliation, WalletDiscrepancy,
  EntityStatus, CurrencyCode,
} from '../types';

const logger = createLogger('WalletAccountingEngine');

export class WalletAccountingEngine {
  private static instance: WalletAccountingEngine;
  private wallets: Map<string, WalletAccount> = new Map();
  private transactions: Map<string, WalletTransaction> = new Map();
  private reconciliations: Map<string, WalletReconciliation> = new Map();

  static getInstance(): WalletAccountingEngine {
    if (!WalletAccountingEngine.instance) {
      WalletAccountingEngine.instance = new WalletAccountingEngine();
    }
    return WalletAccountingEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Wallet Accounting Engine');
  }

  // ── Wallet Management ──

  createWallet(data: {
    entityId: string;
    entityType: 'CUSTOMER' | 'MERCHANT' | 'DELIVERY_PARTNER';
    currency?: CurrencyCode;
  }): WalletAccount {
    const existing = Array.from(this.wallets.values())
      .find(w => w.entityId === data.entityId && w.entityType === data.entityType);
    if (existing) return existing;

    const wallet: WalletAccount = {
      id: generateId('WAL'),
      entityId: data.entityId,
      entityType: data.entityType,
      balance: 0,
      currency: data.currency || 'INR',
      previousBalance: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.wallets.set(wallet.id, wallet);
    logger.info(`Created wallet for ${data.entityType}:${data.entityId}`);
    return wallet;
  }

  getWallet(id: string): WalletAccount | undefined {
    return this.wallets.get(id);
  }

  getAllWalletIds(): string[] {
    return Array.from(this.wallets.keys());
  }

  getWalletByEntity(entityId: string, entityType: string): WalletAccount | undefined {
    return Array.from(this.wallets.values())
      .find(w => w.entityId === entityId && w.entityType === entityType);
  }

  updateWalletStatus(walletId: string, status: EntityStatus): WalletAccount {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new Error(`Wallet ${walletId} not found`);
    wallet.status = status;
    wallet.updatedAt = new Date().toISOString();
    this.wallets.set(walletId, wallet);
    return wallet;
  }

  // ── Transactions ──

  recordTransaction(data: {
    walletId: string;
    transactionType: WalletTransactionType;
    amount: number;
    referenceType: string;
    referenceId: string;
    description: string;
    metadata?: Record<string, unknown>;
  }): WalletTransaction {
    const wallet = this.wallets.get(data.walletId);
    if (!wallet) throw new Error(`Wallet ${data.walletId} not found`);
    if (wallet.status !== 'ACTIVE') throw new Error('Wallet is not active');

    const isDebit = ['WITHDRAWAL', 'PAYMENT', 'SETTLEMENT', 'TRANSFER'].includes(data.transactionType);
    const balanceBefore = wallet.balance;

    if (isDebit && balanceBefore < data.amount && data.transactionType !== 'TRANSFER') {
      throw new Error(`Insufficient balance in wallet ${data.walletId}`);
    }

    const balanceAfter = isDebit
      ? roundTo(balanceBefore - data.amount)
      : roundTo(balanceBefore + data.amount);

    const transaction: WalletTransaction = {
      id: generateId('WLT'),
      walletId: data.walletId,
      transactionType: data.transactionType,
      amount: data.amount,
      balanceBefore,
      balanceAfter,
      status: 'COMPLETED',
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      description: data.description,
      metadata: data.metadata,
      createdAt: new Date().toISOString(),
    };

    // Update wallet balance
    wallet.previousBalance = wallet.balance;
    wallet.balance = balanceAfter;
    wallet.lastTransactionAt = transaction.createdAt;
    wallet.updatedAt = transaction.createdAt;
    this.wallets.set(data.walletId, wallet);

    this.transactions.set(transaction.id, transaction);
    logger.info(`Wallet ${data.walletId}: ${data.transactionType} = ${data.amount} (balance: ${balanceAfter})`);
    return transaction;
  }

  reverseTransaction(transactionId: string, reason: string): WalletTransaction {
    const original = this.transactions.get(transactionId);
    if (!original) throw new Error(`Transaction ${transactionId} not found`);
    if (original.status === 'REVERSED') throw new Error('Transaction already reversed');

    // Reverse by creating opposite transaction
    const reversalType = this.getReversalType(original.transactionType);
    const reversal = this.recordTransaction({
      walletId: original.walletId,
      transactionType: reversalType,
      amount: original.amount,
      referenceType: 'ADJUSTMENT',
      referenceId: original.id,
      description: `Reversal: ${original.description} - ${reason}`,
      metadata: { reversedTransactionId: original.id, reason },
    });

    original.status = 'REVERSED';
    this.transactions.set(transactionId, original);
    logger.info(`Reversed transaction ${transactionId}: ${reason}`);
    return reversal;
  }

  getTransaction(id: string): WalletTransaction | undefined {
    return this.transactions.get(id);
  }

  getWalletTransactions(walletId: string, filters?: {
    type?: WalletTransactionType; fromDate?: string; toDate?: string;
  }): WalletTransaction[] {
    let txns = Array.from(this.transactions.values())
      .filter(t => t.walletId === walletId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (filters?.type) txns = txns.filter(t => t.transactionType === filters.type);
    if (filters?.fromDate) txns = txns.filter(t => t.createdAt >= filters.fromDate!);
    if (filters?.toDate) txns = txns.filter(t => t.createdAt <= filters.toDate!);
    return txns;
  }

  // ── Reconciliation ──

  reconcileWallet(walletId: string, period: string, expectedBalance: number): WalletReconciliation {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new Error(`Wallet ${walletId} not found`);

    const actualBalance = wallet.balance;
    const difference = roundTo(expectedBalance - actualBalance);

    const txns = this.getWalletTransactions(walletId, {
      fromDate: `${period}-01`,
      toDate: `${period}-31`,
    });

    const discrepancies: WalletDiscrepancy[] = [];
    for (const txn of txns) {
      if (txn.status === 'REVERSED') {
        discrepancies.push({
          transactionId: txn.id,
          expectedAmount: 0,
          actualAmount: txn.amount,
          difference: txn.amount,
          reason: 'Reversed transaction found in period',
        });
      }
    }

    const reconciliation: WalletReconciliation = {
      id: generateId('WLR'),
      walletId,
      period,
      expectedBalance,
      actualBalance,
      difference,
      discrepancyCount: discrepancies.length,
      discrepancies,
      reconciledAt: new Date().toISOString(),
      status: difference === 0 && discrepancies.length === 0 ? 'MATCHED' : 'UNMATCHED',
    };

    this.reconciliations.set(reconciliation.id, reconciliation);
    logger.info(`Wallet ${walletId} reconciliation for ${period}: ${reconciliation.status}`);
    return reconciliation;
  }

  getWalletReconciliations(walletId: string): WalletReconciliation[] {
    return Array.from(this.reconciliations.values())
      .filter(r => r.walletId === walletId)
      .sort((a, b) => b.period.localeCompare(a.period));
  }

  // ── Summary ──

  getWalletSummary(): {
    totalWallets: number; activeWallets: number; totalBalance: number;
    byType: Record<string, { count: number; balance: number }>;
  } {
    const all = Array.from(this.wallets.values());
    const byType: Record<string, { count: number; balance: number }> = {};
    for (const w of all) {
      if (!byType[w.entityType]) byType[w.entityType] = { count: 0, balance: 0 };
      byType[w.entityType].count++;
      byType[w.entityType].balance = roundTo(byType[w.entityType].balance + w.balance);
    }
    return {
      totalWallets: all.length,
      activeWallets: all.filter(w => w.status === 'ACTIVE').length,
      totalBalance: roundTo(sum(all.map(w => w.balance))),
      byType,
    };
  }

  private getReversalType(type: WalletTransactionType): WalletTransactionType {
    const reversalMap: Record<WalletTransactionType, WalletTransactionType> = {
      TOP_UP: 'WITHDRAWAL',
      WITHDRAWAL: 'TOP_UP',
      PAYMENT: 'REFUND',
      REFUND: 'PAYMENT',
      COMMISSION: 'ADJUSTMENT',
      SETTLEMENT: 'ADJUSTMENT',
      ADJUSTMENT: 'ADJUSTMENT',
      TRANSFER: 'ADJUSTMENT',
      CASHBACK: 'ADJUSTMENT',
      REWARD: 'ADJUSTMENT',
    };
    return reversalMap[type] || 'ADJUSTMENT';
  }

  reset(): void {
    this.wallets.clear();
    this.transactions.clear();
    this.reconciliations.clear();
  }
}

export default WalletAccountingEngine.getInstance();
