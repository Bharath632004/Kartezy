/**
 * Kartezy Enterprise ERP & Finance Platform — Accounting Engine
 *
 * Double-entry bookkeeping: chart of accounts, journal entries,
 * trial balance, balance sheet, and fiscal period management.
 */

import { createLogger } from '../utils/logger';
import { generateId, generateNumber, roundTo, sum } from '../utils/helpers';
import type {
  ChartOfAccount, AccountType, AccountSubType, EntryType,
  JournalEntry, JournalLine, JournalStatus,
  TrialBalance, TrialBalanceAccount,
  BalanceSheet, BalanceSheetSection,
  FiscalPeriodStatus,
} from '../types';

const logger = createLogger('AccountingEngine');

export class AccountingEngine {
  private static instance: AccountingEngine;
  private accounts: Map<string, ChartOfAccount> = new Map();
  private journalEntries: Map<string, JournalEntry> = new Map();
  private fiscalPeriods: Map<string, FiscalPeriodStatus> = new Map();
  private entryCounter: number = 0;

  static getInstance(): AccountingEngine {
    if (!AccountingEngine.instance) {
      AccountingEngine.instance = new AccountingEngine();
    }
    return AccountingEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Accounting Engine');
    this.seedChartOfAccounts();
    this.seedFiscalPeriods();
  }

  // ── Chart of Accounts ──

  private seedChartOfAccounts(): void {
    const defaultAccounts: Array<{
      code: string; name: string; type: AccountType; subType: AccountSubType; parentCode?: string;
    }> = [
      // Assets
      { code: '1000', name: 'Current Assets', type: 'ASSET', subType: 'CURRENT' },
      { code: '1100', name: 'Cash & Bank', type: 'ASSET', subType: 'CURRENT', parentCode: '1000' },
      { code: '1101', name: 'Cash on Hand', type: 'ASSET', subType: 'CURRENT', parentCode: '1100' },
      { code: '1102', name: 'Bank Accounts', type: 'ASSET', subType: 'CURRENT', parentCode: '1100' },
      { code: '1103', name: 'Payment Gateway', type: 'ASSET', subType: 'CURRENT', parentCode: '1100' },
      { code: '1200', name: 'Accounts Receivable', type: 'ASSET', subType: 'CURRENT', parentCode: '1000' },
      { code: '1201', name: 'Customer Receivables', type: 'ASSET', subType: 'CURRENT', parentCode: '1200' },
      { code: '1202', name: 'Merchant Receivables', type: 'ASSET', subType: 'CURRENT', parentCode: '1200' },
      { code: '1300', name: 'Inventory', type: 'ASSET', subType: 'CURRENT', parentCode: '1000' },
      { code: '1400', name: 'Prepaid Expenses', type: 'ASSET', subType: 'CURRENT', parentCode: '1000' },
      { code: '1500', name: 'Fixed Assets', type: 'ASSET', subType: 'NON_CURRENT' },
      { code: '1501', name: 'Property & Equipment', type: 'ASSET', subType: 'NON_CURRENT', parentCode: '1500' },
      { code: '1502', name: 'Accumulated Depreciation', type: 'CONTRA_ASSET', subType: 'NON_CURRENT', parentCode: '1500' },

      // Liabilities
      { code: '2000', name: 'Current Liabilities', type: 'LIABILITY', subType: 'CURRENT' },
      { code: '2100', name: 'Accounts Payable', type: 'LIABILITY', subType: 'CURRENT', parentCode: '2000' },
      { code: '2101', name: 'Vendor Payables', type: 'LIABILITY', subType: 'CURRENT', parentCode: '2100' },
      { code: '2102', name: 'Merchant Payables', type: 'LIABILITY', subType: 'CURRENT', parentCode: '2100' },
      { code: '2200', name: 'Tax Payables', type: 'LIABILITY', subType: 'CURRENT', parentCode: '2000' },
      { code: '2201', name: 'GST Payable', type: 'LIABILITY', subType: 'CURRENT', parentCode: '2200' },
      { code: '2202', name: 'TDS Payable', type: 'LIABILITY', subType: 'CURRENT', parentCode: '2200' },
      { code: '2203', name: 'Income Tax Payable', type: 'LIABILITY', subType: 'CURRENT', parentCode: '2200' },
      { code: '2300', name: 'Deferred Revenue', type: 'LIABILITY', subType: 'CURRENT', parentCode: '2000' },
      { code: '2400', name: 'Non-Current Liabilities', type: 'LIABILITY', subType: 'NON_CURRENT' },
      { code: '2401', name: 'Long-term Debt', type: 'LIABILITY', subType: 'NON_CURRENT', parentCode: '2400' },

      // Equity
      { code: '3000', name: 'Equity', type: 'EQUITY', subType: 'NON_CURRENT' },
      { code: '3100', name: 'Share Capital', type: 'EQUITY', subType: 'NON_CURRENT', parentCode: '3000' },
      { code: '3200', name: 'Retained Earnings', type: 'EQUITY', subType: 'NON_CURRENT', parentCode: '3000' },
      { code: '3300', name: 'Current Year Earnings', type: 'EQUITY', subType: 'CURRENT', parentCode: '3000' },

      // Revenue
      { code: '4000', name: 'Revenue', type: 'REVENUE', subType: 'OPERATING' },
      { code: '4100', name: 'Commission Income', type: 'REVENUE', subType: 'OPERATING', parentCode: '4000' },
      { code: '4200', name: 'Delivery Fees', type: 'REVENUE', subType: 'OPERATING', parentCode: '4000' },
      { code: '4300', name: 'Subscription Revenue', type: 'REVENUE', subType: 'OPERATING', parentCode: '4000' },
      { code: '4400', name: 'Advertising Revenue', type: 'REVENUE', subType: 'OPERATING', parentCode: '4000' },
      { code: '4500', name: 'Interest Income', type: 'REVENUE', subType: 'NON_OPERATING', parentCode: '4000' },
      { code: '4900', name: 'Other Income', type: 'REVENUE', subType: 'NON_OPERATING', parentCode: '4000' },

      // Expenses
      { code: '5000', name: 'Operating Expenses', type: 'EXPENSE', subType: 'OPERATING' },
      { code: '5100', name: 'Cost of Goods Sold', type: 'EXPENSE', subType: 'DIRECT', parentCode: '5000' },
      { code: '5200', name: 'Employee Expenses', type: 'EXPENSE', subType: 'INDIRECT', parentCode: '5000' },
      { code: '5300', name: 'Marketing Expenses', type: 'EXPENSE', subType: 'INDIRECT', parentCode: '5000' },
      { code: '5400', name: 'Technology Expenses', type: 'EXPENSE', subType: 'INDIRECT', parentCode: '5000' },
      { code: '5500', name: 'Administrative Expenses', type: 'EXPENSE', subType: 'INDIRECT', parentCode: '5000' },
      { code: '5600', name: 'Payment Gateway Fees', type: 'EXPENSE', subType: 'DIRECT', parentCode: '5000' },
      { code: '5700', name: 'Refund & Adjustments', type: 'CONTRA_REVENUE', subType: 'OPERATING', parentCode: '5000' },
      { code: '5800', name: 'Depreciation', type: 'EXPENSE', subType: 'INDIRECT', parentCode: '5000' },
      { code: '5900', name: 'Tax Expenses', type: 'EXPENSE', subType: 'INDIRECT' },
      { code: '5901', name: 'GST Expenses', type: 'EXPENSE', subType: 'INDIRECT', parentCode: '5900' },
      { code: '5902', name: 'Income Tax', type: 'EXPENSE', subType: 'INDIRECT', parentCode: '5900' },
    ];

    for (const acct of defaultAccounts) {
      this.accounts.set(acct.code, {
        id: generateId('ACCT'),
        accountCode: acct.code,
        accountName: acct.name,
        accountType: acct.type,
        accountSubType: acct.subType,
        balance: 0,
        currency: 'INR',
        isActive: true,
        isControlAccount: !acct.parentCode,
        description: `${acct.name}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    logger.info(`Seeded ${defaultAccounts.length} chart of accounts`);
  }

  private seedFiscalPeriods(): void {
    const year = new Date().getFullYear();
    for (let m = 4; m <= 15; m++) {
      const month = m > 12 ? m - 12 : m;
      const yr = m > 12 ? year + 1 : year;
      const period = `${yr}-${String(month).padStart(2, '0')}`;
      this.fiscalPeriods.set(period, 'OPEN');
    }
  }

  // ── Account Management ──

  getAllAccounts(): ChartOfAccount[] {
    return Array.from(this.accounts.values());
  }

  getAccount(code: string): ChartOfAccount | undefined {
    return this.accounts.get(code);
  }

  getAccountsByType(type: AccountType): ChartOfAccount[] {
    return Array.from(this.accounts.values()).filter(a => a.accountType === type && a.isActive);
  }

  createAccount(acct: Omit<ChartOfAccount, 'id' | 'balance' | 'currency' | 'createdAt' | 'updatedAt'>): ChartOfAccount {
    if (this.accounts.has(acct.accountCode)) {
      throw new Error(`Account with code ${acct.accountCode} already exists`);
    }
    const account: ChartOfAccount = {
      ...acct,
      id: generateId('ACCT'),
      balance: 0,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.accounts.set(acct.accountCode, account);
    logger.info(`Created account: ${acct.accountCode} - ${acct.accountName}`);
    return account;
  }

  // ── Journal Entries ──

  createJournalEntry(entry: Omit<JournalEntry, 'id' | 'entryNumber' | 'totalDebit' | 'totalCredit' | 'status' | 'createdAt' | 'updatedAt'>): JournalEntry {
    const totalDebit = roundTo(entry.lines.filter(l => l.entryType === 'DEBIT').reduce((s, l) => s + l.amount, 0));
    const totalCredit = roundTo(entry.lines.filter(l => l.entryType === 'CREDIT').reduce((s, l) => s + l.amount, 0));

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error(`Journal entry does not balance: debit=${totalDebit}, credit=${totalCredit}`);
    }

    this.entryCounter++;
    const now = new Date().toISOString();
    const journalEntry: JournalEntry = {
      ...entry,
      id: generateId('JE'),
      entryNumber: generateNumber('JE', this.entryCounter),
      totalDebit,
      totalCredit,
      status: 'DRAFT',
      lines: entry.lines.map(line => ({
        ...line,
        id: generateId('JEL'),
        journalEntryId: '',
      })),
      createdAt: now,
      updatedAt: now,
    };

    // Set journalEntryId on lines
    journalEntry.lines = journalEntry.lines.map(line => ({
      ...line,
      journalEntryId: journalEntry.id,
    }));

    this.journalEntries.set(journalEntry.id, journalEntry);
    logger.info(`Created journal entry ${journalEntry.entryNumber}`, { debit: totalDebit, credit: totalCredit });
    return journalEntry;
  }

  postJournalEntry(entryId: string, approvedBy: string): JournalEntry {
    const entry = this.journalEntries.get(entryId);
    if (!entry) throw new Error(`Journal entry ${entryId} not found`);
    if (entry.status === 'POSTED') throw new Error(`Journal entry ${entry.entryNumber} already posted`);
    if (entry.status === 'REVERSED') throw new Error(`Journal entry ${entry.entryNumber} is reversed`);

    entry.status = 'POSTED';
    entry.approvedBy = approvedBy;
    entry.approvedAt = new Date().toISOString();
    entry.updatedAt = new Date().toISOString();

    // Update account balances
    for (const line of entry.lines) {
      const account = this.accounts.get(line.accountCode);
      if (account) {
        if (line.entryType === 'DEBIT') {
          if (isDebitBalanceAccount(account.accountType)) {
            account.balance += line.amount;
          } else {
            account.balance -= line.amount;
          }
        } else {
          if (isDebitBalanceAccount(account.accountType)) {
            account.balance -= line.amount;
          } else {
            account.balance += line.amount;
          }
        }
        account.updatedAt = new Date().toISOString();
      }
    }

    this.journalEntries.set(entryId, entry);
    logger.info(`Posted journal entry ${entry.entryNumber}`);
    return entry;
  }

  reverseJournalEntry(entryId: string, reason: string, approvedBy: string): JournalEntry {
    const original = this.journalEntries.get(entryId);
    if (!original) throw new Error(`Journal entry ${entryId} not found`);
    if (original.status !== 'POSTED') throw new Error(`Cannot reverse entry with status ${original.status}`);

    // Create reversal entry
    const reversalLines: JournalLine[] = original.lines.map(line => ({
      ...line,
      id: generateId('JEL'),
      journalEntryId: '',
      entryType: line.entryType === 'DEBIT' ? 'CREDIT' : 'DEBIT',
      description: `Reversal: ${line.description || ''} - ${reason}`,
    }));

    const reversal = this.createJournalEntry({
      entryDate: new Date().toISOString().split('T')[0],
      postDate: new Date().toISOString().split('T')[0],
      description: `Reversal of ${original.entryNumber}: ${reason}`,
      referenceType: 'ADJUSTMENT',
      referenceId: original.id,
      lines: reversalLines,
      createdBy: approvedBy,
    });

    this.postJournalEntry(reversal.id, approvedBy);

    original.status = 'REVERSED';
    original.reversedBy = reversal.id;
    original.updatedAt = new Date().toISOString();
    this.journalEntries.set(entryId, original);

    logger.info(`Reversed journal entry ${original.entryNumber} with ${reversal.entryNumber}`);
    return reversal;
  }

  getJournalEntry(id: string): JournalEntry | undefined {
    return this.journalEntries.get(id);
  }

  getJournalEntries(filters?: {
    fromDate?: string; toDate?: string; status?: JournalStatus;
    referenceType?: string; referenceId?: string;
  }): JournalEntry[] {
    let entries = Array.from(this.journalEntries.values());
    if (filters?.fromDate) entries = entries.filter(e => e.entryDate >= filters.fromDate!);
    if (filters?.toDate) entries = entries.filter(e => e.entryDate <= filters.toDate!);
    if (filters?.status) entries = entries.filter(e => e.status === filters.status);
    if (filters?.referenceType) entries = entries.filter(e => e.referenceType === filters.referenceType);
    if (filters?.referenceId) entries = entries.filter(e => e.referenceId === filters.referenceId);
    return entries.sort((a, b) => b.entryDate.localeCompare(a.entryDate));
  }

  // ── Trial Balance ──

  generateTrialBalance(asOfDate: string): TrialBalance {
    const accounts = Array.from(this.accounts.values()).filter(a => !a.isControlAccount && a.isActive);
    const tbAccounts: TrialBalanceAccount[] = accounts.map(acct => {
      const balance = acct.balance;
      const isDebit = isDebitBalanceAccount(acct.accountType);
      return {
        accountCode: acct.accountCode,
        accountName: acct.accountName,
        accountType: acct.accountType,
        openingDebit: 0,
        openingCredit: 0,
        periodDebit: isDebit && balance > 0 ? balance : 0,
        periodCredit: !isDebit && balance > 0 ? balance : 0,
        closingDebit: isDebit && balance > 0 ? balance : 0,
        closingCredit: !isDebit && balance > 0 ? balance : 0,
      };
    });

    return {
      asOfDate,
      accounts: tbAccounts,
      totalDebit: roundTo(sum(tbAccounts.map(a => a.closingDebit))),
      totalCredit: roundTo(sum(tbAccounts.map(a => a.closingCredit))),
    };
  }

  // ── Balance Sheet ──

  generateBalanceSheet(asOfDate: string): BalanceSheet {
    const accounts = Array.from(this.accounts.values()).filter(a => a.isActive);

    const assetAccounts = accounts.filter(a =>
      a.accountType === 'ASSET' && !a.isControlAccount
    );
    const liabilityAccounts = accounts.filter(a =>
      a.accountType === 'LIABILITY' && !a.isControlAccount
    );
    const equityAccounts = accounts.filter(a =>
      (a.accountType === 'EQUITY' || a.accountType === 'REVENUE' || a.accountType === 'EXPENSE' || a.accountType === 'CONTRA_REVENUE') && !a.isControlAccount
    );

    // Calculate retained earnings (net profit)
    const totalRevenue = sum(accounts.filter(a => a.accountType === 'REVENUE').map(a => a.balance));
    const totalExpenses = sum(accounts.filter(a => a.accountType === 'EXPENSE').map(a => a.balance));
    const totalContraRevenue = sum(accounts.filter(a => a.accountType === 'CONTRA_REVENUE').map(a => a.balance));
    const netProfit = totalRevenue - totalExpenses - totalContraRevenue;

    const buildSection = (title: string, accts: ChartOfAccount[]): BalanceSheetSection => {
      const items = accts.map(a => ({ name: a.accountName, amount: a.balance, accountCode: a.accountCode }));
      return { title, total: roundTo(sum(items.map(i => i.amount))), items };
    };

    const assets = buildSection('Assets', assetAccounts);
    const liabilities = buildSection('Liabilities', liabilityAccounts);
    const equityItems = equityAccounts.map(a => ({ name: a.accountName, amount: a.balance, accountCode: a.accountCode }));
    equityItems.push({ name: 'Net Profit / (Loss)', amount: roundTo(netProfit), accountCode: 'PL' });
    const equity: BalanceSheetSection = { title: "Equity", total: roundTo(sum(equityItems.map(i => i.amount + 0))), items: equityItems };
    // Recalculate equity total
    equity.total = roundTo(sum(equityItems.map(i => i.amount)));

    return {
      asOfDate,
      assets,
      liabilities,
      equity,
      totalAssets: assets.total,
      totalLiabilities: liabilities.total,
      totalEquity: equity.total,
    };
  }

  // ── Fiscal Periods ──

  getFiscalPeriodStatus(period: string): FiscalPeriodStatus {
    return this.fiscalPeriods.get(period) || 'OPEN';
  }

  setFiscalPeriodStatus(period: string, status: FiscalPeriodStatus): void {
    this.fiscalPeriods.set(period, status);
  }

  closeFiscalPeriod(period: string): void {
    const current = this.fiscalPeriods.get(period);
    if (!current) throw new Error(`Fiscal period ${period} not found`);
    if (current === 'CLOSED') throw new Error(`Fiscal period ${period} is already closed`);

    // Close period
    this.fiscalPeriods.set(period, 'CLOSED');
    logger.info(`Closed fiscal period ${period}`);
  }

  // ── Utility ──

  reset(): void {
    this.accounts.clear();
    this.journalEntries.clear();
    this.fiscalPeriods.clear();
    this.entryCounter = 0;
    this.initialize();
  }
}

function isDebitBalanceAccount(type: string): boolean {
  return ['ASSET', 'EXPENSE', 'CONTRA_LIABILITY', 'CONTRA_EQUITY'].includes(type);
}

export default AccountingEngine.getInstance();
