/**
 * Kartezy Enterprise ERP & Finance Platform — Merchant Settlement Engine
 *
 * Handles settlement calculation, batch processing, TDS/GST deduction,
 * payout scheduling, and full settlement lifecycle management.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo } from '../utils/helpers';
import type {
  MerchantSettlement, SettlementBatch, SettlementRule, SettlementStatus,
  SettlementPeriod, SettlementMethod,
} from '../types';

const logger = createLogger('SettlementEngine');

export class SettlementEngine {
  private static instance: SettlementEngine;
  private settlements: Map<string, MerchantSettlement> = new Map();
  private batches: Map<string, SettlementBatch> = new Map();
  private rules: Map<string, SettlementRule> = new Map();

  static getInstance(): SettlementEngine {
    if (!SettlementEngine.instance) {
      SettlementEngine.instance = new SettlementEngine();
    }
    return SettlementEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Settlement Engine');
  }

  // ── Settlement Rules ──

  createRule(rule: Omit<SettlementRule, 'id' | 'createdAt' | 'updatedAt'>): SettlementRule {
    const newRule: SettlementRule = {
      ...rule,
      id: generateId('SR'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.rules.set(newRule.id, newRule);
    logger.info(`Created settlement rule for merchant ${rule.merchantId}`);
    return newRule;
  }

  getRule(id: string): SettlementRule | undefined {
    return this.rules.get(id);
  }

  getMerchantRule(merchantId: string): SettlementRule | undefined {
    return Array.from(this.rules.values()).find(r => r.merchantId === merchantId && r.isActive);
  }

  updateRule(id: string, updates: Partial<SettlementRule>): SettlementRule {
    const rule = this.rules.get(id);
    if (!rule) throw new Error(`Settlement rule ${id} not found`);
    Object.assign(rule, updates, { updatedAt: new Date().toISOString() });
    this.rules.set(id, rule);
    return rule;
  }

  // ── Settlement Calculation ──

  calculateSettlement(
    merchantId: string,
    merchantName: string,
    periodStart: string,
    periodEnd: string,
    totalRevenue: number,
    totalCommission: number,
    totalRefunds: number,
    adjustments?: number,
  ): MerchantSettlement {
    const rule = this.getMerchantRule(merchantId);
    const tdsRate = rule?.tdsRate ?? 0.01; // Default 1% TDS
    const adjAmount = adjustments || 0;

    const netAmount = roundTo(totalRevenue - totalCommission - totalRefunds + adjAmount);
    const tdsDeducted = roundTo(netAmount * tdsRate);
    const gstDeducted = roundTo(netAmount * 0.18); // 18% GST on commission
    const finalAmount = roundTo(netAmount - tdsDeducted - gstDeducted);

    const settlement: MerchantSettlement = {
      id: generateId('STL'),
      merchantId,
      merchantName,
      periodStart,
      periodEnd,
      totalRevenue,
      totalCommission,
      totalRefunds,
      totalAdjustments: adjAmount,
      netAmount,
      tdsDeducted,
      gstDeducted,
      finalAmount,
      status: 'PENDING',
      settlementMethod: rule?.settlementMethod || 'BANK_TRANSFER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    logger.info(`Calculated settlement for ${merchantName}: net=${netAmount}, final=${finalAmount}`);
    return settlement;
  }

  createSettlement(settlement: MerchantSettlement): MerchantSettlement {
    this.settlements.set(settlement.id, settlement);
    return settlement;
  }

  // ── Batch Processing ──

  createBatch(
    period: SettlementPeriod,
    periodStart: string,
    periodEnd: string,
    settlements: MerchantSettlement[],
  ): SettlementBatch {
    const batch: SettlementBatch = {
      id: generateId('BAT'),
      period,
      periodStart,
      periodEnd,
      merchantCount: settlements.length,
      totalNetAmount: roundTo(settlements.reduce((s, stl) => s + stl.netAmount, 0)),
      status: 'PENDING',
      settlements: settlements.map(s => ({ ...s, status: 'PROCESSING' })),
      createdAt: new Date().toISOString(),
    };

    this.batches.set(batch.id, batch);
    logger.info(`Created settlement batch ${batch.id} with ${settlements.length} merchants`);
    return batch;
  }

  processBatch(batchId: string): SettlementBatch {
    const batch = this.batches.get(batchId);
    if (!batch) throw new Error(`Batch ${batchId} not found`);

    batch.status = 'PROCESSING';
    batch.settlements = batch.settlements.map(s => {
      const updated: MerchantSettlement = {
        ...s,
        status: 'COMPLETED',
        settledAt: new Date().toISOString(),
        payoutReference: `PAY-${generateId().substring(0, 8)}`,
        updatedAt: new Date().toISOString(),
      };
      this.settlements.set(updated.id, updated);
      return updated;
    });

    batch.status = 'COMPLETED';
    batch.processedAt = new Date().toISOString();
    this.batches.set(batchId, batch);
    logger.info(`Processed batch ${batchId}: ${batch.merchantCount} settlements completed`);
    return batch;
  }

  reverseSettlement(settlementId: string, reason: string): MerchantSettlement {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) throw new Error(`Settlement ${settlementId} not found`);
    if (settlement.status === 'REVERSED') throw new Error('Settlement already reversed');

    const reversed: MerchantSettlement = {
      ...settlement,
      id: generateId('STL'),
      status: 'REVERSED',
      netAmount: -settlement.netAmount,
      finalAmount: -settlement.finalAmount,
      metadata: { ...settlement.metadata, reversedFrom: settlementId, reason },
      updatedAt: new Date().toISOString(),
    };

    this.settlements.set(reversed.id, reversed);
    logger.info(`Reversed settlement ${settlementId}: ${reason}`);
    return reversed;
  }

  // ── Queries ──

  getSettlement(id: string): MerchantSettlement | undefined {
    return this.settlements.get(id);
  }

  getMerchantSettlements(merchantId: string): MerchantSettlement[] {
    return Array.from(this.settlements.values())
      .filter(s => s.merchantId === merchantId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getSettlementsByPeriod(periodStart: string, periodEnd: string): MerchantSettlement[] {
    return Array.from(this.settlements.values())
      .filter(s => s.periodStart >= periodStart && s.periodEnd <= periodEnd)
      .sort((a, b) => a.merchantName.localeCompare(b.merchantName));
  }

  getSettlementsByStatus(status: SettlementStatus): MerchantSettlement[] {
    return Array.from(this.settlements.values())
      .filter(s => s.status === status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getBatch(id: string): SettlementBatch | undefined {
    return this.batches.get(id);
  }

  getAllBatches(): SettlementBatch[] {
    return Array.from(this.batches.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getPendingSettlementsCount(): number {
    return Array.from(this.settlements.values()).filter(s => s.status === 'PENDING').length;
  }

  getSettlementSummary(periodStart: string, periodEnd: string): {
    totalRevenue: number; totalCommission: number; totalSettlements: number;
    totalNetAmount: number; totalTDS: number; totalGST: number; totalFinalAmount: number;
  } {
    const settlements = this.getSettlementsByPeriod(periodStart, periodEnd);
    return {
      totalRevenue: roundTo(settlements.reduce((s, stl) => s + stl.totalRevenue, 0)),
      totalCommission: roundTo(settlements.reduce((s, stl) => s + stl.totalCommission, 0)),
      totalSettlements: settlements.length,
      totalNetAmount: roundTo(settlements.reduce((s, stl) => s + stl.netAmount, 0)),
      totalTDS: roundTo(settlements.reduce((s, stl) => s + stl.tdsDeducted, 0)),
      totalGST: roundTo(settlements.reduce((s, stl) => s + stl.gstDeducted, 0)),
      totalFinalAmount: roundTo(settlements.reduce((s, stl) => s + stl.finalAmount, 0)),
    };
  }

  reset(): void {
    this.settlements.clear();
    this.batches.clear();
    this.rules.clear();
  }
}

export default SettlementEngine.getInstance();
