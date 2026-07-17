/**
 * Kartezy Enterprise ERP & Finance Platform — Payment Reconciliation Engine
 *
 * Auto-matching of payment transactions with bank statements using
 * amount, reference, date matching with configurable rules.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum } from '../utils/helpers';
import type {
  ReconciliationRule, ReconciliationResult, ReconciliationDetail,
  ReconciliationStatus, ReconciliationMethod,
  BankTransaction,
} from '../types';

const logger = createLogger('ReconciliationEngine');

interface PaymentTransaction {
  id: string;
  amount: number;
  reference: string;
  date: string;
  status: string;
}

export class PaymentReconciliationEngine {
  private static instance: PaymentReconciliationEngine;
  private rules: Map<string, ReconciliationRule> = new Map();
  private results: Map<string, ReconciliationResult> = new Map();

  static getInstance(): PaymentReconciliationEngine {
    if (!PaymentReconciliationEngine.instance) {
      PaymentReconciliationEngine.instance = new PaymentReconciliationEngine();
    }
    return PaymentReconciliationEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Payment Reconciliation Engine');
    this.seedDefaultRules();
  }

  private seedDefaultRules(): void {
    const defaultRules: Omit<ReconciliationRule, 'id'>[] = [
      { name: 'Exact Amount Match', field: 'amount', operator: 'EXACT', priority: 1, isActive: true },
      { name: 'Reference Number Match', field: 'reference', operator: 'EXACT', priority: 2, isActive: true },
      { name: 'Date Range Match', field: 'date', operator: 'RANGE', threshold: 3, priority: 3, isActive: true },
      { name: 'Fuzzy Amount Match', field: 'amount', operator: 'FUZZY', threshold: 0.5, priority: 4, isActive: true },
    ];
    for (const rule of defaultRules) {
      this.rules.set(generateId('RR'), { ...rule, id: generateId('RR') });
    }
  }

  // ── Rules ──

  createRule(rule: Omit<ReconciliationRule, 'id'>): ReconciliationRule {
    const newRule: ReconciliationRule = { ...rule, id: generateId('RR') };
    this.rules.set(newRule.id, newRule);
    return newRule;
  }

  getRules(): ReconciliationRule[] {
    return Array.from(this.rules.values()).sort((a, b) => a.priority - b.priority);
  }

  // ── Reconciliation ──

  reconcile(
    period: string,
    bankAccountId: string,
    bankTransactions: BankTransaction[],
    paymentTransactions: PaymentTransaction[],
  ): ReconciliationResult {
    logger.info(`Starting reconciliation for ${period} (${bankAccountId})`);

    const details: ReconciliationDetail[] = [];
    const matchedBankIds = new Set<string>();
    const matchedPaymentIds = new Set<string>();
    const activeRules = this.getRules().filter(r => r.isActive);

    // Attempt auto-matching
    for (const bankTxn of bankTransactions) {
      for (const paymentTxn of paymentTransactions) {
        if (matchedPaymentIds.has(paymentTxn.id)) continue;

        const result = this.attemptMatch(bankTxn, paymentTxn, activeRules);
        if (result !== 'NO_MATCH') {
          matchedBankIds.add(bankTxn.id);
          matchedPaymentIds.add(paymentTxn.id);
          details.push({
            bankTransactionId: bankTxn.id,
            paymentTransactionId: paymentTxn.id,
            amount: paymentTxn.amount,
            bankAmount: bankTxn.credit || bankTxn.debit,
            paymentAmount: paymentTxn.amount,
            difference: roundTo(paymentTxn.amount - (bankTxn.credit || bankTxn.debit)),
            matchMethod: result,
            status: Math.abs(paymentTxn.amount - (bankTxn.credit || bankTxn.debit)) <= 0.01 ? 'MATCHED' : 'PARTIAL',
            confidence: this.calculateConfidence(bankTxn, paymentTxn, result),
          });
          break;
        }
      }
    }

    // Unmatched bank transactions
    for (const bankTxn of bankTransactions) {
      if (!matchedBankIds.has(bankTxn.id)) {
        details.push({
          bankTransactionId: bankTxn.id,
          amount: bankTxn.credit || bankTxn.debit,
          bankAmount: bankTxn.credit || bankTxn.debit,
          difference: 0,
          matchMethod: 'MANUAL',
          status: 'UNMATCHED',
          confidence: 0,
        });
      }
    }

    // Unmatched payment transactions
    for (const paymentTxn of paymentTransactions) {
      if (!matchedPaymentIds.has(paymentTxn.id)) {
        details.push({
          paymentTransactionId: paymentTxn.id,
          amount: paymentTxn.amount,
          paymentAmount: paymentTxn.amount,
          difference: 0,
          matchMethod: 'MANUAL',
          status: 'UNMATCHED',
          confidence: 0,
        });
      }
    }

    const matchedCount = details.filter(d => d.status === 'MATCHED').length;
    const partialCount = details.filter(d => d.status === 'PARTIAL').length;
    const unmatchedCount = details.filter(d => d.status === 'UNMATCHED').length;

    const result: ReconciliationResult = {
      id: generateId('REC'),
      period,
      bankAccountId,
      totalBankTransactions: bankTransactions.length,
      totalPaymentTransactions: paymentTransactions.length,
      matchedCount,
      unmatchedBankCount: bankTransactions.length - matchedBankIds.size,
      unmatchedPaymentCount: paymentTransactions.length - matchedPaymentIds.size,
      partialMatchCount: partialCount,
      discrepancyCount: details.filter(d => d.status === 'PARTIAL').length,
      totalMatchedAmount: roundTo(sum(
        details.filter(d => d.status === 'MATCHED').map(d => d.amount)
      )),
      totalDiscrepancyAmount: roundTo(sum(
        details.filter(d => d.difference).map(d => Math.abs(d.difference))
      )),
      status: unmatchedCount === 0 ? 'MATCHED' : partialCount > 0 ? 'PARTIAL' : 'UNMATCHED',
      details,
      completedAt: new Date().toISOString(),
    };

    this.results.set(result.id, result);
    logger.info(`Reconciliation complete: ${result.matchedCount} matched, ${result.unmatchedBankCount} bank unmatched, ${result.unmatchedPaymentCount} payment unmatched`);
    return result;
  }

  private attemptMatch(
    bankTxn: BankTransaction,
    paymentTxn: PaymentTransaction,
    rules: ReconciliationRule[],
  ): ReconciliationMethod | 'NO_MATCH' {
    for (const rule of rules) {
      switch (rule.operator) {
        case 'EXACT':
          if (rule.field === 'amount') {
            if (Math.abs((bankTxn.credit || bankTxn.debit) - paymentTxn.amount) <= 0.01) {
              return 'AUTO_AMOUNT';
            }
          }
          if (rule.field === 'reference') {
            if (bankTxn.reference === paymentTxn.reference) {
              return 'AUTO_REFERENCE';
            }
          }
          break;

        case 'RANGE':
          if (rule.field === 'date') {
            const bankDate = new Date(bankTxn.transactionDate).getTime();
            const payDate = new Date(paymentTxn.date).getTime();
            const diffDays = Math.abs(bankDate - payDate) / (1000 * 60 * 60 * 24);
            if (diffDays <= (rule.threshold || 3)) {
              return 'AUTO_DATE';
            }
          }
          break;

        case 'FUZZY':
          if (rule.field === 'amount') {
            const threshold = rule.threshold || 0.5;
            const diff = Math.abs((bankTxn.credit || bankTxn.debit) - paymentTxn.amount);
            if (diff <= threshold) {
              return 'AUTO_AMOUNT';
            }
          }
          break;
      }
    }
    return 'NO_MATCH';
  }

  private calculateConfidence(
    bankTxn: BankTransaction,
    paymentTxn: PaymentTransaction,
    method: ReconciliationMethod,
  ): number {
    let confidence = 0;
    if (method === 'AUTO_AMOUNT') confidence += 0.5;
    if (method === 'AUTO_REFERENCE') confidence += 0.4;
    if (method === 'AUTO_DATE') confidence += 0.3;

    if (bankTxn.reference === paymentTxn.reference) confidence += 0.3;
    if (Math.abs((bankTxn.credit || bankTxn.debit) - paymentTxn.amount) <= 0.01) confidence += 0.2;

    return Math.min(confidence, 1.0);
  }

  manuallyMatch(
    reconciliationId: string,
    bankTransactionId: string,
    paymentTransactionId: string,
    notes?: string,
  ): ReconciliationResult {
    const result = this.results.get(reconciliationId);
    if (!result) throw new Error(`Reconciliation ${reconciliationId} not found`);

    const detail: ReconciliationDetail = {
      bankTransactionId,
      paymentTransactionId,
      amount: 0,
      bankAmount: 0,
      paymentAmount: 0,
      difference: 0,
      matchMethod: 'MANUAL',
      status: 'MATCHED',
      confidence: 1.0,
      notes,
    };

    result.details.push(detail);
    result.matchedCount++;
    result.unmatchedBankCount = Math.max(0, result.unmatchedBankCount - 1);
    result.unmatchedPaymentCount = Math.max(0, result.unmatchedPaymentCount - 1);
    this.results.set(reconciliationId, result);
    return result;
  }

  getResult(id: string): ReconciliationResult | undefined {
    return this.results.get(id);
  }

  getResultsByPeriod(period: string): ReconciliationResult[] {
    return Array.from(this.results.values())
      .filter(r => r.period === period)
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }

  getReconciliationSummary(period: string): {
    totalReconciliations: number; totalMatched: number;
    totalUnmatched: number; matchRate: number;
    totalAmountReconciled: number;
  } {
    const results = Array.from(this.results.values()).filter(r => r.period === period);
    const totalTxns = results.reduce((s, r) => s + r.totalBankTransactions + r.totalPaymentTransactions, 0);
    const totalMatched = results.reduce((s, r) => s + r.matchedCount, 0);

    return {
      totalReconciliations: results.length,
      totalMatched,
      totalUnmatched: results.reduce((s, r) => s + r.unmatchedBankCount + r.unmatchedPaymentCount, 0),
      matchRate: totalTxns > 0 ? roundTo(totalMatched / totalTxns, 4) : 0,
      totalAmountReconciled: roundTo(sum(results.map(r => r.totalMatchedAmount))),
    };
  }

  reset(): void {
    this.rules.clear();
    this.results.clear();
  }
}

export default PaymentReconciliationEngine.getInstance();
