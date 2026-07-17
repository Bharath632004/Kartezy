/**
 * Kartezy Enterprise ERP & Finance Platform — Revenue Engine
 *
 * Revenue recognition, categorization, deferred revenue tracking,
 * and revenue analytics across all revenue streams.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum, calculateGrowthRate } from '../utils/helpers';
import type { RevenueRecord, RevenueSummary, RevenueCategory, RevenueRecognitionMethod, CurrencyCode } from '../types';

const logger = createLogger('RevenueEngine');

export class RevenueEngine {
  private static instance: RevenueEngine;
  private records: Map<string, RevenueRecord> = new Map();

  static getInstance(): RevenueEngine {
    if (!RevenueEngine.instance) {
      RevenueEngine.instance = new RevenueEngine();
    }
    return RevenueEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Revenue Engine');
  }

  recognizeRevenue(data: {
    revenueCategory: RevenueCategory;
    sourceId: string;
    sourceType: 'ORDER' | 'SUBSCRIPTION' | 'ADVERTISING' | 'SETTLEMENT';
    amount: number;
    currency?: CurrencyCode;
    recognitionMethod: RevenueRecognitionMethod;
    deferredAmount?: number;
    period: string;
    customerId?: string;
    merchantId?: string;
    description?: string;
  }): RevenueRecord {
    const recognizedAmount = data.recognitionMethod === 'POINT_IN_TIME' ? data.amount : 0;
    const deferred = data.deferredAmount ?? (data.recognitionMethod === 'POINT_IN_TIME' ? 0 : data.amount);

    const record: RevenueRecord = {
      id: generateId('REV'),
      revenueCategory: data.revenueCategory,
      sourceId: data.sourceId,
      sourceType: data.sourceType,
      amount: data.amount,
      currency: data.currency || 'INR',
      recognizedDate: new Date().toISOString().split('T')[0],
      recognitionMethod: data.recognitionMethod,
      deferredAmount: deferred,
      recognizedAmount,
      period: data.period,
      customerId: data.customerId,
      merchantId: data.merchantId,
      description: data.description,
      createdAt: new Date().toISOString(),
    };

    this.records.set(record.id, record);
    logger.info(`Recognized revenue: ${data.revenueCategory} = ${data.amount} (${data.period})`);
    return record;
  }

  recognizeDeferredRevenue(recordId: string, amountToRecognize: number): RevenueRecord {
    const record = this.records.get(recordId);
    if (!record) throw new Error(`Revenue record ${recordId} not found`);
    if (amountToRecognize > record.deferredAmount) {
      throw new Error(`Cannot recognize more than deferred amount (${record.deferredAmount})`);
    }

    record.recognizedAmount = roundTo(record.recognizedAmount + amountToRecognize);
    record.deferredAmount = roundTo(record.deferredAmount - amountToRecognize);
    this.records.set(recordId, record);
    logger.info(`Recognized deferred revenue: ${amountToRecognize} for record ${recordId}`);
    return record;
  }

  getRevenueRecords(filters?: {
    category?: RevenueCategory; period?: string; sourceType?: string;
    merchantId?: string; fromDate?: string; toDate?: string;
  }): RevenueRecord[] {
    let list = Array.from(this.records.values());
    if (filters?.category) list = list.filter(r => r.revenueCategory === filters.category);
    if (filters?.period) list = list.filter(r => r.period === filters.period);
    if (filters?.sourceType) list = list.filter(r => r.sourceType === filters.sourceType);
    if (filters?.merchantId) list = list.filter(r => r.merchantId === filters.merchantId);
    if (filters?.fromDate) list = list.filter(r => r.recognizedDate >= filters.fromDate!);
    if (filters?.toDate) list = list.filter(r => r.recognizedDate <= filters.toDate!);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getRevenueSummary(period: string): RevenueSummary {
    const records = Array.from(this.records.values()).filter(r => r.period === period);
    const totalRevenue = roundTo(sum(records.map(r => r.recognizedAmount)));

    const byCategory: Record<RevenueCategory, number> = {
      COMMISSION: 0, DELIVERY_FEES: 0, SUBSCRIPTION: 0,
      ADVERTISING: 0, INTEREST: 0, OTHER: 0,
    };
    for (const record of records) {
      byCategory[record.revenueCategory] = roundTo(
        (byCategory[record.revenueCategory] || 0) + record.recognizedAmount
      );
    }

    const prevPeriodRecords = Array.from(this.records.values())
      .filter(r => this.getPreviousPeriod(period) === r.period);
    const previousPeriodRevenue = roundTo(sum(prevPeriodRecords.map(r => r.recognizedAmount)));

    return {
      period,
      totalRevenue,
      byCategory,
      previousPeriod: previousPeriodRevenue,
      growthRate: calculateGrowthRate(totalRevenue, previousPeriodRevenue),
      deferredRevenue: roundTo(sum(records.map(r => r.deferredAmount))),
      recognizedRevenue: totalRevenue,
    };
  }

  getRevenueByCategory(period: string): Array<{ category: RevenueCategory; amount: number; percentage: number }> {
    const summary = this.getRevenueSummary(period);
    return (Object.entries(summary.byCategory) as [RevenueCategory, number][])
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: summary.totalRevenue > 0 ? roundTo(amount / summary.totalRevenue, 4) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  getMonthlyRevenueTrend(months: number = 12): Array<{ period: string; revenue: number }> {
    const periods = new Set(Array.from(this.records.values()).map(r => r.period));
    return Array.from(periods)
      .sort()
      .slice(-months)
      .map(period => ({
        period,
        revenue: roundTo(
          sum(Array.from(this.records.values()).filter(r => r.period === period).map(r => r.recognizedAmount))
        ),
      }));
  }

  private getPreviousPeriod(period: string): string {
    const [year, month] = period.split('-').map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
  }

  reset(): void {
    this.records.clear();
  }
}

export default RevenueEngine.getInstance();
