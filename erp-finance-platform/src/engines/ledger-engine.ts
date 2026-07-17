/**
 * Kartezy Enterprise ERP & Finance Platform — Ledger Engine
 *
 * General ledger and subsidiary ledger management with balance tracking,
 * period summaries, and account-level reporting.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum } from '../utils/helpers';
import type {
  LedgerEntry, GeneralLedger, SubsidiaryLedger, EntryType,
  ChartOfAccount,
} from '../types';

const logger = createLogger('LedgerEngine');

export class LedgerEngine {
  private static instance: LedgerEngine;
  private ledgerEntries: Map<string, LedgerEntry> = new Map();

  static getInstance(): LedgerEngine {
    if (!LedgerEngine.instance) {
      LedgerEngine.instance = new LedgerEngine();
    }
    return LedgerEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Ledger Engine');
  }

  addEntry(data: {
    accountId: string;
    accountCode: string;
    entryDate: string;
    entryType: EntryType;
    amount: number;
    currentBalance: number;
    journalEntryId: string;
    description: string;
    referenceType?: string;
    referenceId?: string;
    customerId?: string;
    vendorId?: string;
  }): LedgerEntry {
    const newBalance = data.entryType === 'DEBIT'
      ? roundTo(data.currentBalance + data.amount)
      : roundTo(data.currentBalance - data.amount);

    const entry: LedgerEntry = {
      id: generateId('LED'),
      accountId: data.accountId,
      accountCode: data.accountCode,
      entryDate: data.entryDate,
      entryType: data.entryType,
      amount: data.amount,
      balance: newBalance,
      journalEntryId: data.journalEntryId,
      description: data.description,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      customerId: data.customerId,
      vendorId: data.vendorId,
      createdAt: new Date().toISOString(),
    };

    this.ledgerEntries.set(entry.id, entry);
    return entry;
  }

  getLedgerEntries(accountId: string, filters?: {
    fromDate?: string; toDate?: string; entryType?: EntryType;
  }): LedgerEntry[] {
    let entries = Array.from(this.ledgerEntries.values())
      .filter(e => e.accountId === accountId)
      .sort((a, b) => a.entryDate.localeCompare(b.entryDate));

    if (filters?.fromDate) entries = entries.filter(e => e.entryDate >= filters.fromDate!);
    if (filters?.toDate) entries = entries.filter(e => e.entryDate <= filters.toDate!);
    if (filters?.entryType) entries = entries.filter(e => e.entryType === filters.entryType);
    return entries;
  }

  getGeneralLedger(account: ChartOfAccount, fromDate: string, toDate: string): GeneralLedger {
    const entries = this.getLedgerEntries(account.id, { fromDate, toDate });
    const openingBalance = account.balance - sum(entries.map(e =>
      e.entryType === 'DEBIT' ? e.amount : -e.amount
    ));

    return {
      accountId: account.id,
      accountCode: account.accountCode,
      accountName: account.accountName,
      entries,
      openingBalance: roundTo(openingBalance),
      closingBalance: account.balance,
      periodDebitTotal: roundTo(sum(entries.filter(e => e.entryType === 'DEBIT').map(e => e.amount))),
      periodCreditTotal: roundTo(sum(entries.filter(e => e.entryType === 'CREDIT').map(e => e.amount))),
    };
  }

  getSubsidiaryLedger(
    type: 'CUSTOMER' | 'VENDOR' | 'MERCHANT',
    entityId: string,
    entityName: string,
  ): SubsidiaryLedger {
    const entries = Array.from(this.ledgerEntries.values())
      .filter(e => {
        if (type === 'CUSTOMER') return e.customerId === entityId;
        if (type === 'VENDOR') return e.vendorId === entityId;
        return false;
      })
      .sort((a, b) => a.entryDate.localeCompare(b.entryDate));

    const balance = entries.length > 0
      ? entries[entries.length - 1].balance
      : 0;

    return { type, entityId, entityName, entries, balance };
  }

  getAccountBalanceAt(accountId: string, date: string): number {
    const entries = this.getLedgerEntries(accountId, { toDate: date });
    if (entries.length === 0) return 0;
    return entries[entries.length - 1].balance;
  }

  getAccountSummary(accountId: string, period: string): {
    accountId: string; period: string;
    openingBalance: number; closingBalance: number;
    totalDebit: number; totalCredit: number; entryCount: number;
  } {
    const [year, month] = period.split('-').map(Number);
    const fromDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const toDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const entries = this.getLedgerEntries(accountId, { fromDate, toDate });
    const openingEntries = this.getLedgerEntries(accountId, { toDate: fromDate });
    const openingBalance = openingEntries.length > 0
      ? openingEntries[openingEntries.length - 1].balance
      : 0;

    return {
      accountId,
      period,
      openingBalance: roundTo(openingBalance),
      closingBalance: entries.length > 0 ? entries[entries.length - 1].balance : openingBalance,
      totalDebit: roundTo(sum(entries.filter(e => e.entryType === 'DEBIT').map(e => e.amount))),
      totalCredit: roundTo(sum(entries.filter(e => e.entryType === 'CREDIT').map(e => e.amount))),
      entryCount: entries.length,
    };
  }

  getAllEntries(filters?: {
    fromDate?: string; toDate?: string; referenceType?: string;
    customerId?: string; vendorId?: string;
  }): LedgerEntry[] {
    let entries = Array.from(this.ledgerEntries.values())
      .sort((a, b) => b.entryDate.localeCompare(a.entryDate));
    if (filters?.fromDate) entries = entries.filter(e => e.entryDate >= filters.fromDate!);
    if (filters?.toDate) entries = entries.filter(e => e.entryDate <= filters.toDate!);
    if (filters?.referenceType) entries = entries.filter(e => e.referenceType === filters.referenceType);
    if (filters?.customerId) entries = entries.filter(e => e.customerId === filters.customerId);
    if (filters?.vendorId) entries = entries.filter(e => e.vendorId === filters.vendorId);
    return entries;
  }

  reset(): void {
    this.ledgerEntries.clear();
  }
}

export default LedgerEngine.getInstance();
