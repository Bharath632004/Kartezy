/**
 * Kartezy Enterprise ERP & Finance Platform — Commission Engine
 *
 * Merchant commission calculation with tiered rates, category-based rates,
 * plan management, and commission lifecycle tracking.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum, calculateGrowthRate } from '../utils/helpers';
import type { CommissionPlan, CommissionEntry, CommissionSummary, CommissionType, CommissionStatus } from '../types';

const logger = createLogger('CommissionEngine');

export class CommissionEngine {
  private static instance: CommissionEngine;
  private plans: Map<string, CommissionPlan> = new Map();
  private entries: Map<string, CommissionEntry> = new Map();

  static getInstance(): CommissionEngine {
    if (!CommissionEngine.instance) {
      CommissionEngine.instance = new CommissionEngine();
    }
    return CommissionEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Commission Engine');
  }

  // ── Commission Plans ──

  createPlan(data: {
    name: string;
    commissionType: CommissionType;
    merchantTier: string;
    defaultRate: number;
    categoryRates?: Record<string, number>;
    tierRates?: Array<{ minRevenue: number; maxRevenue: number; rate: number }>;
    capAmount?: number;
    minAmount?: number;
    effectiveFrom: string;
    effectiveTo?: string;
  }): CommissionPlan {
    const plan: CommissionPlan = {
      id: generateId('CP'),
      name: data.name,
      commissionType: data.commissionType,
      merchantTier: data.merchantTier,
      defaultRate: data.defaultRate,
      categoryRates: data.categoryRates || {},
      tierRates: data.tierRates || [],
      capAmount: data.capAmount,
      minAmount: data.minAmount,
      isActive: true,
      effectiveFrom: data.effectiveFrom,
      effectiveTo: data.effectiveTo,
      createdAt: new Date().toISOString(),
    };
    this.plans.set(plan.id, plan);
    logger.info(`Created commission plan: ${plan.name}`);
    return plan;
  }

  getPlan(id: string): CommissionPlan | undefined {
    return this.plans.get(id);
  }

  getActivePlans(): CommissionPlan[] {
    return Array.from(this.plans.values())
      .filter(p => p.isActive)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updatePlan(id: string, updates: Partial<CommissionPlan>): CommissionPlan {
    const plan = this.plans.get(id);
    if (!plan) throw new Error(`Commission plan ${id} not found`);
    Object.assign(plan, updates);
    this.plans.set(id, plan);
    return plan;
  }

  // ── Commission Calculation ──

  calculateCommission(
    merchantId: string,
    merchantName: string,
    orderId: string,
    orderAmount: number,
    category: string,
    merchantTier: string,
    period: string,
  ): CommissionEntry {
    const plan = Array.from(this.plans.values()).find(p =>
      p.merchantTier === merchantTier && p.isActive &&
      p.effectiveFrom <= period &&
      (!p.effectiveTo || p.effectiveTo >= period)
    );

    let commissionRate = plan?.defaultRate || 0.05; // Default 5%
    let commissionType: CommissionType = plan?.commissionType || 'PERCENTAGE';

    // Check category-specific rate
    if (plan?.categoryRates[category]) {
      commissionRate = plan.categoryRates[category];
    }

    // Check tiered rates
    if (plan?.tierRates.length) {
      const tier = plan.tierRates.find(t =>
        orderAmount >= t.minRevenue && orderAmount <= t.maxRevenue
      );
      if (tier) commissionRate = tier.rate;
    }

    let commissionAmount = roundTo(orderAmount * commissionRate);

    // Apply caps
    if (plan?.capAmount && commissionAmount > plan.capAmount) {
      commissionAmount = plan.capAmount;
    }
    if (plan?.minAmount && commissionAmount < plan.minAmount) {
      commissionAmount = plan.minAmount;
    }

    const entry: CommissionEntry = {
      id: generateId('CE'),
      merchantId,
      merchantName,
      orderId,
      orderAmount,
      commissionType,
      commissionRate,
      commissionAmount,
      category,
      status: 'CALCULATED',
      period,
      createdAt: new Date().toISOString(),
    };

    this.entries.set(entry.id, entry);
    logger.info(`Commission calculated for merchant ${merchantName}: ${commissionAmount} (rate: ${commissionRate})`);
    return entry;
  }

  approveCommission(entryId: string, approvedBy: string): CommissionEntry {
    const entry = this.entries.get(entryId);
    if (!entry) throw new Error(`Commission entry ${entryId} not found`);
    if (entry.status !== 'CALCULATED') throw new Error(`Cannot approve commission with status ${entry.status}`);

    entry.status = 'APPROVED';
    entry.approvedBy = approvedBy;
    entry.approvedAt = new Date().toISOString();
    this.entries.set(entryId, entry);
    logger.info(`Commission ${entryId} approved by ${approvedBy}`);
    return entry;
  }

  markCommissionPaid(entryId: string, settlementId: string): CommissionEntry {
    const entry = this.entries.get(entryId);
    if (!entry) throw new Error(`Commission entry ${entryId} not found`);
    if (entry.status !== 'APPROVED') throw new Error(`Cannot pay commission with status ${entry.status}`);

    entry.status = 'PAID';
    entry.settlementId = settlementId;
    entry.paidAt = new Date().toISOString();
    this.entries.set(entryId, entry);
    logger.info(`Commission ${entryId} paid via settlement ${settlementId}`);
    return entry;
  }

  // ── Queries ──

  getCommissionEntries(merchantId: string, filters?: {
    period?: string; status?: CommissionStatus; fromDate?: string; toDate?: string;
  }): CommissionEntry[] {
    let list = Array.from(this.entries.values()).filter(e => e.merchantId === merchantId);
    if (filters?.period) list = list.filter(e => e.period === filters.period);
    if (filters?.status) list = list.filter(e => e.status === filters.status);
    if (filters?.fromDate) list = list.filter(e => e.createdAt >= filters.fromDate!);
    if (filters?.toDate) list = list.filter(e => e.createdAt <= filters.toDate!);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getCommissionSummary(merchantId: string, period: string): CommissionSummary {
    const entries = this.getCommissionEntries(merchantId, { period });
    const totalOrders = entries.length;
    const totalRevenue = roundTo(sum(entries.map(e => e.orderAmount)));
    const totalCommission = roundTo(sum(entries.map(e => e.commissionAmount)));

    const byCategory: Record<string, { revenue: number; commission: number; rate: number }> = {};
    const byStatus: Record<CommissionStatus, number> = { CALCULATED: 0, APPROVED: 0, PAID: 0, DISPUTED: 0 };

    for (const e of entries) {
      if (!byCategory[e.category]) byCategory[e.category] = { revenue: 0, commission: 0, rate: 0 };
      byCategory[e.category].revenue = roundTo(byCategory[e.category].revenue + e.orderAmount);
      byCategory[e.category].commission = roundTo(byCategory[e.category].commission + e.commissionAmount);
      byCategory[e.category].rate = byCategory[e.category].revenue > 0
        ? roundTo(byCategory[e.category].commission / byCategory[e.category].revenue, 4)
        : 0;
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
    }

    const prevPeriod = this.getPreviousPeriod(period);
    const prevEntries = this.getCommissionEntries(merchantId, { period: prevPeriod });
    const prevCommission = sum(prevEntries.map(e => e.commissionAmount));

    return {
      merchantId,
      merchantName: entries[0]?.merchantName || '',
      period,
      totalOrders,
      totalRevenue,
      totalCommission,
      effectiveRate: totalRevenue > 0 ? roundTo(totalCommission / totalRevenue, 4) : 0,
      byCategory,
      byStatus,
      previousPeriod: prevCommission,
      growthRate: calculateGrowthRate(totalCommission, prevCommission),
    };
  }

  getPlatformCommissionSummary(period: string): {
    totalCommission: number;
    totalOrders: number;
    totalRevenue: number;
    effectiveRate: number;
    byMerchantTier: Record<string, { commission: number; orders: number }>;
  } {
    const entries = Array.from(this.entries.values()).filter(e => e.period === period);
    const byTier: Record<string, { commission: number; orders: number }> = {};

    for (const e of entries) {
      const tier = 'default';
      if (!byTier[tier]) byTier[tier] = { commission: 0, orders: 0 };
      byTier[tier].commission = roundTo(byTier[tier].commission + e.commissionAmount);
      byTier[tier].orders++;
    }

    return {
      totalCommission: roundTo(sum(entries.map(e => e.commissionAmount))),
      totalOrders: entries.length,
      totalRevenue: roundTo(sum(entries.map(e => e.orderAmount))),
      effectiveRate: entries.length > 0
        ? roundTo(sum(entries.map(e => e.commissionAmount)) / sum(entries.map(e => e.orderAmount)), 4)
        : 0,
      byMerchantTier: byTier,
    };
  }

  private getPreviousPeriod(period: string): string {
    const [year, month] = period.split('-').map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
  }

  reset(): void {
    this.plans.clear();
    this.entries.clear();
  }
}

export default CommissionEngine.getInstance();
