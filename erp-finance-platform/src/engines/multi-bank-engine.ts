/**
 * Kartezy Enterprise ERP & Finance Platform — Multi-Bank Support Engine
 *
 * Bank account management, bank connections, transaction import,
 * balance tracking, and integration with payment reconciliation.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum } from '../utils/helpers';
import type {
  BankAccount, BankConnection, BankTransaction,
  BankAccountType, BankConnectionStatus, EntityStatus, CurrencyCode,
} from '../types';

const logger = createLogger('MultiBankEngine');

export class MultiBankEngine {
  private static instance: MultiBankEngine;
  private accounts: Map<string, BankAccount> = new Map();
  private connections: Map<string, BankConnection> = new Map();
  private transactions: Map<string, BankTransaction> = new Map();

  static getInstance(): MultiBankEngine {
    if (!MultiBankEngine.instance) {
      MultiBankEngine.instance = new MultiBankEngine();
    }
    return MultiBankEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Multi-Bank Engine');
  }

  // ── Bank Account Management ──

  addBankAccount(data: {
    entityId: string;
    entityType: 'MERCHANT' | 'VENDOR' | 'COMPANY' | 'CUSTOMER';
    accountType: BankAccountType;
    accountHolderName: string;
    bankName: string;
    branchName: string;
    ifscCode: string;
    accountNumber: string;
    upiId?: string;
    isPrimary?: boolean;
  }): BankAccount {
    const now = new Date().toISOString();
    const account: BankAccount = {
      id: generateId('BA'),
      entityId: data.entityId,
      entityType: data.entityType,
      accountType: data.accountType,
      accountHolderName: data.accountHolderName,
      bankName: data.bankName,
      branchName: data.branchName,
      ifscCode: data.ifscCode,
      accountNumber: `XXXX${data.accountNumber.slice(-4)}`,
      encryptedAccountNumber: btoa(data.accountNumber),
      upiId: data.upiId,
      isPrimary: data.isPrimary || false,
      isVerified: false,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    // Unset previous primary if this is primary
    if (account.isPrimary) {
      for (const [id, acct] of this.accounts) {
        if (acct.entityId === data.entityId && acct.isPrimary) {
          acct.isPrimary = false;
          acct.updatedAt = now;
          this.accounts.set(id, acct);
        }
      }
    }

    this.accounts.set(account.id, account);
    logger.info(`Added bank account: ${account.bankName} - ${account.accountNumber}`);
    return account;
  }

  getBankAccount(id: string): BankAccount | undefined {
    return this.accounts.get(id);
  }

  getEntityBankAccounts(entityId: string): BankAccount[] {
    return Array.from(this.accounts.values())
      .filter(a => a.entityId === entityId && a.status === 'ACTIVE');
  }

  getPrimaryBankAccount(entityId: string): BankAccount | undefined {
    return Array.from(this.accounts.values())
      .find(a => a.entityId === entityId && a.isPrimary && a.status === 'ACTIVE');
  }

  verifyBankAccount(id: string): BankAccount {
    const account = this.accounts.get(id);
    if (!account) throw new Error(`Bank account ${id} not found`);
    account.isVerified = true;
    account.updatedAt = new Date().toISOString();
    this.accounts.set(id, account);
    return account;
  }

  updateBankAccountStatus(id: string, status: EntityStatus): BankAccount {
    const account = this.accounts.get(id);
    if (!account) throw new Error(`Bank account ${id} not found`);
    account.status = status;
    account.updatedAt = new Date().toISOString();
    this.accounts.set(id, account);
    return account;
  }

  // ── Bank Connections ──

  createConnection(data: {
    bankName: string;
    accountId: string;
    connectionType: 'UPI' | 'NET_BANKING' | 'API' | 'MANUAL';
    credentials: Record<string, string>;
    syncFrequency: 'REAL_TIME' | 'HOURLY' | 'DAILY';
    expiresAt?: string;
  }): BankConnection {
    const connection: BankConnection = {
      id: generateId('BC'),
      bankName: data.bankName,
      accountId: data.accountId,
      connectionType: data.connectionType,
      status: 'ACTIVE',
      syncFrequency: data.syncFrequency,
      credentials: data.credentials,
      expiresAt: data.expiresAt,
      createdAt: new Date().toISOString(),
    };
    this.connections.set(connection.id, connection);
    logger.info(`Created bank connection: ${data.bankName} (${data.connectionType})`);
    return connection;
  }

  getConnection(id: string): BankConnection | undefined {
    return this.connections.get(id);
  }

  getAccountConnections(accountId: string): BankConnection[] {
    return Array.from(this.connections.values()).filter(c => c.accountId === accountId);
  }

  updateConnectionStatus(id: string, status: BankConnectionStatus): BankConnection {
    const conn = this.connections.get(id);
    if (!conn) throw new Error(`Connection ${id} not found`);
    conn.status = status;
    if (status === 'ACTIVE') conn.lastSyncedAt = new Date().toISOString();
    this.connections.set(id, conn);
    return conn;
  }

  // ── Bank Transactions ──

  importTransaction(data: {
    bankAccountId: string;
    transactionDate: string;
    valueDate: string;
    description: string;
    reference: string;
    debit: number;
    credit: number;
    balance: number;
    category?: string;
  }): BankTransaction {
    const transaction: BankTransaction = {
      id: generateId('BT'),
      bankAccountId: data.bankAccountId,
      transactionDate: data.transactionDate,
      valueDate: data.valueDate,
      description: data.description,
      reference: data.reference,
      debit: data.debit,
      credit: data.credit,
      balance: data.balance,
      category: data.category,
      isReconciled: false,
      matchStatus: 'UNMATCHED',
      importedAt: new Date().toISOString(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  importTransactions(bankAccountId: string, txns: Array<{
    transactionDate: string; valueDate: string; description: string;
    reference: string; debit: number; credit: number; balance: number;
  }>): BankTransaction[] {
    const imported: BankTransaction[] = [];
    for (const txn of txns) {
      imported.push(this.importTransaction({ ...txn, bankAccountId }));
    }
    logger.info(`Imported ${imported.length} transactions for account ${bankAccountId}`);
    return imported;
  }

  getBankTransactions(bankAccountId: string, filters?: {
    fromDate?: string; toDate?: string; isReconciled?: boolean;
    category?: string;
  }): BankTransaction[] {
    let list = Array.from(this.transactions.values())
      .filter(t => t.bankAccountId === bankAccountId)
      .sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
    if (filters?.fromDate) list = list.filter(t => t.transactionDate >= filters.fromDate!);
    if (filters?.toDate) list = list.filter(t => t.transactionDate <= filters.toDate!);
    if (filters?.isReconciled !== undefined) list = list.filter(t => t.isReconciled === filters.isReconciled);
    if (filters?.category) list = list.filter(t => t.category === filters.category);
    return list;
  }

  getAccountBalance(accountId: string): number {
    const txns = Array.from(this.transactions.values())
      .filter(t => t.bankAccountId === accountId)
      .sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
    return txns.length > 0 ? txns[0].balance : 0;
  }

  markTransactionReconciled(transactionId: string, matchedTransactionId: string): BankTransaction {
    const txn = this.transactions.get(transactionId);
    if (!txn) throw new Error(`Transaction ${transactionId} not found`);
    txn.isReconciled = true;
    txn.matchedTransactionId = matchedTransactionId;
    txn.matchStatus = 'MATCHED';
    this.transactions.set(transactionId, txn);
    return txn;
  }

  // ── Analytics ──

  getBankSummary(): {
    totalAccounts: number; verifiedAccounts: number; totalBalance: number;
    byBank: Record<string, { count: number; balance: number }>;
    byType: Record<BankAccountType, number>;
  } {
    const all = Array.from(this.accounts.values()).filter(a => a.status === 'ACTIVE');
    const byBank: Record<string, { count: number; balance: number }> = {};
    const byType: Record<string, number> = { SAVINGS: 0, CURRENT: 0, ESCROW: 0, LOAN: 0 };

    for (const acct of all) {
      if (!byBank[acct.bankName]) byBank[acct.bankName] = { count: 0, balance: 0 };
      byBank[acct.bankName].count++;
      const balance = this.getAccountBalance(acct.id);
      byBank[acct.bankName].balance = roundTo(byBank[acct.bankName].balance + balance);
      byType[acct.accountType]++;
    }

    return {
      totalAccounts: all.length,
      verifiedAccounts: all.filter(a => a.isVerified).length,
      totalBalance: roundTo(sum(all.map(a => this.getAccountBalance(a.id)))),
      byBank,
      byType: byType as Record<BankAccountType, number>,
    };
  }

  reset(): void {
    this.accounts.clear();
    this.connections.clear();
    this.transactions.clear();
  }
}

export default MultiBankEngine.getInstance();
