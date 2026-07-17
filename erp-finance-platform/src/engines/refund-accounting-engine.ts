/**
 * Kartezy Enterprise ERP & Finance Platform — Refund Accounting Engine
 *
 * Complete refund lifecycle with accounting integration, fee/tax handling,
 * and reconciliation with payment gateway and wallet service.
 */

import { createLogger } from '../utils/logger';
import { generateId, generateNumber, roundTo, sum } from '../utils/helpers';
import type {
  RefundRecord, RefundReason, RefundMethod, RefundStatus, CurrencyCode,
} from '../types';

const logger = createLogger('RefundAccountingEngine');

export class RefundAccountingEngine {
  private static instance: RefundAccountingEngine;
  private refunds: Map<string, RefundRecord> = new Map();
  private refundCounter: number = 0;

  static getInstance(): RefundAccountingEngine {
    if (!RefundAccountingEngine.instance) {
      RefundAccountingEngine.instance = new RefundAccountingEngine();
    }
    return RefundAccountingEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Refund Accounting Engine');
  }

  initiateRefund(data: {
    orderId: string;
    paymentId: string;
    customerId: string;
    merchantId: string;
    reason: RefundReason;
    refundMethod: RefundMethod;
    originalAmount: number;
    refundAmount: number;
    feeRefund?: number;
    taxRefund?: number;
    currency?: CurrencyCode;
    notes?: string;
  }): RefundRecord {
    this.refundCounter++;
    const feeRefund = data.feeRefund ?? 0;
    const taxRefund = data.taxRefund ?? 0;
    const netRefund = roundTo(data.refundAmount - feeRefund - taxRefund);

    const record: RefundRecord = {
      id: generateId('REF'),
      refundNumber: generateNumber('REF', this.refundCounter),
      orderId: data.orderId,
      paymentId: data.paymentId,
      customerId: data.customerId,
      merchantId: data.merchantId,
      reason: data.reason,
      refundMethod: data.refundMethod,
      status: 'INITIATED',
      originalAmount: data.originalAmount,
      refundAmount: data.refundAmount,
      feeRefund,
      taxRefund,
      netRefund,
      currency: data.currency || 'INR',
      accountingEntries: [],
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.refunds.set(record.id, record);
    logger.info(`Initiated refund ${record.refundNumber}: ${data.refundAmount} for order ${data.orderId}`);
    return record;
  }

  processRefund(refundId: string): RefundRecord {
    const refund = this.refunds.get(refundId);
    if (!refund) throw new Error(`Refund ${refundId} not found`);
    if (refund.status !== 'INITIATED') throw new Error(`Cannot process refund with status ${refund.status}`);

    refund.status = 'PROCESSING';
    refund.processedAt = new Date().toISOString();
    refund.updatedAt = new Date().toISOString();
    this.refunds.set(refundId, refund);
    return refund;
  }

  completeRefund(refundId: string, gatewayReference: string): RefundRecord {
    const refund = this.refunds.get(refundId);
    if (!refund) throw new Error(`Refund ${refundId} not found`);
    if (refund.status !== 'PROCESSING') throw new Error(`Cannot complete refund with status ${refund.status}`);

    refund.status = 'COMPLETED';
    refund.gatewayReference = gatewayReference;
    refund.completedAt = new Date().toISOString();
    refund.updatedAt = new Date().toISOString();
    this.refunds.set(refundId, refund);
    logger.info(`Completed refund ${refund.refundNumber}: ${gatewayReference}`);
    return refund;
  }

  failRefund(refundId: string, error: string): RefundRecord {
    const refund = this.refunds.get(refundId);
    if (!refund) throw new Error(`Refund ${refundId} not found`);
    if (refund.status === 'COMPLETED') throw new Error('Cannot fail completed refund');

    refund.status = 'FAILED';
    refund.notes = refund.notes ? `${refund.notes}\nFailed: ${error}` : `Failed: ${error}`;
    refund.updatedAt = new Date().toISOString();
    this.refunds.set(refundId, refund);
    logger.error(`Refund ${refund.refundNumber} failed: ${error}`);
    return refund;
  }

  reverseRefund(refundId: string, reason: string): RefundRecord {
    const refund = this.refunds.get(refundId);
    if (!refund) throw new Error(`Refund ${refundId} not found`);
    if (refund.status !== 'COMPLETED') throw new Error(`Cannot reverse refund with status ${refund.status}`);

    refund.status = 'REVERSED';
    refund.notes = refund.notes ? `${refund.notes}\nReversed: ${reason}` : `Reversed: ${reason}`;
    refund.updatedAt = new Date().toISOString();
    this.refunds.set(refundId, refund);
    logger.info(`Reversed refund ${refund.refundNumber}: ${reason}`);
    return refund;
  }

  linkAccountingEntry(refundId: string, journalEntryId: string): RefundRecord {
    const refund = this.refunds.get(refundId);
    if (!refund) throw new Error(`Refund ${refundId} not found`);
    refund.accountingEntries.push(journalEntryId);
    refund.updatedAt = new Date().toISOString();
    this.refunds.set(refundId, refund);
    return refund;
  }

  getRefund(id: string): RefundRecord | undefined {
    return this.refunds.get(id);
  }

  getRefundByNumber(refundNumber: string): RefundRecord | undefined {
    return Array.from(this.refunds.values()).find(r => r.refundNumber === refundNumber);
  }

  getOrderRefunds(orderId: string): RefundRecord[] {
    return Array.from(this.refunds.values())
      .filter(r => r.orderId === orderId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getRefundsByDateRange(fromDate: string, toDate: string): RefundRecord[] {
    return Array.from(this.refunds.values())
      .filter(r => r.createdAt >= fromDate && r.createdAt <= toDate)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getRefundSummary(period: string): {
    totalRefunds: number; totalAmount: number; totalFeeRefund: number;
    totalTaxRefund: number; totalNetRefund: number;
    byStatus: Record<RefundStatus, number>;
    byReason: Record<RefundReason, number>;
    successRate: number;
  } {
    const all = Array.from(this.refunds.values())
      .filter(r => r.createdAt.startsWith(period));

    const byStatus: Record<string, number> = {};
    const byReason: Record<string, number> = {};
    for (const r of all) {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      byReason[r.reason] = (byReason[r.reason] || 0) + 1;
    }

    const completed = all.filter(r => r.status === 'COMPLETED');
    return {
      totalRefunds: all.length,
      totalAmount: roundTo(sum(all.map(r => r.refundAmount))),
      totalFeeRefund: roundTo(sum(all.map(r => r.feeRefund))),
      totalTaxRefund: roundTo(sum(all.map(r => r.taxRefund))),
      totalNetRefund: roundTo(sum(all.map(r => r.netRefund))),
      byStatus: byStatus as Record<RefundStatus, number>,
      byReason: byReason as Record<RefundReason, number>,
      successRate: all.length > 0 ? roundTo(completed.length / all.length, 4) : 0,
    };
  }

  reset(): void {
    this.refunds.clear();
    this.refundCounter = 0;
  }
}

export default RefundAccountingEngine.getInstance();
