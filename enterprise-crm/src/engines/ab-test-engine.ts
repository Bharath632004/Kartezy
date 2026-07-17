/**
 * Kartezy Enterprise CRM — A/B Testing Engine
 *
 * Create and manage A/B tests for campaigns, content, and offers.
 * Statistical significance calculation and winner determination.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum, avg } from '../utils/helpers';
import type {
  ABTest, ABVariant, ABTestStatus, ABTestWinnerDetermination,
  ABTestMetrics,
} from '../types';

const logger = createLogger('ABTestEngine');

export class ABTestEngine {
  private static instance: ABTestEngine;
  private tests: Map<string, ABTest> = new Map();

  static getInstance(): ABTestEngine {
    if (!ABTestEngine.instance) {
      ABTestEngine.instance = new ABTestEngine();
    }
    return ABTestEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing A/B Testing Engine');
  }

  createTest(data: {
    name: string; description: string;
    variants: Array<{ name: string; description: string; trafficPercentage: number; content: Record<string, unknown> }>;
    targetSegments?: string[]; sampleSize?: number;
    confidenceLevel?: number; winnerDetermination?: ABTestWinnerDetermination;
    startDate?: string; endDate?: string; createdBy: string;
  }): ABTest {
    const totalTraffic = data.variants.reduce((s, v) => s + v.trafficPercentage, 0);
    if (Math.abs(totalTraffic - 100) > 0.01) {
      throw new Error(`Traffic distribution must sum to 100%, got ${totalTraffic}%`);
    }

    const now = new Date().toISOString();
    const variants: ABVariant[] = data.variants.map(v => ({
      id: generateId('ABV'),
      name: v.name,
      description: v.description,
      trafficPercentage: v.trafficPercentage,
      content: v.content,
      stats: { impressions: 0, conversions: 0, revenue: 0, conversionRate: 0 },
    }));

    const test: ABTest = {
      id: generateId('ABT'),
      name: data.name,
      description: data.description,
      status: 'DRAFT',
      variants,
      targetSegments: data.targetSegments || ['ALL'],
      sampleSize: data.sampleSize || 1000,
      confidenceLevel: data.confidenceLevel || 0.95,
      winnerDetermination: data.winnerDetermination || 'AUTOMATIC_CONFIDENCE',
      startDate: data.startDate || now,
      endDate: data.endDate,
      metrics: {
        totalImpressions: 0, totalConversions: 0, totalRevenue: 0,
        overallConversionRate: 0, significanceLevel: 0,
      },
      createdBy: data.createdBy,
      createdAt: now,
      updatedAt: now,
    };

    this.tests.set(test.id, test);
    logger.info(`Created A/B test: ${test.name} with ${variants.length} variants`);
    return test;
  }

  getTest(id: string): ABTest | undefined {
    return this.tests.get(id);
  }

  getAllTests(): ABTest[] {
    return Array.from(this.tests.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  startTest(id: string): ABTest {
    const test = this.tests.get(id);
    if (!test) throw new Error(`Test ${id} not found`);
    test.status = 'RUNNING';
    test.startDate = new Date().toISOString();
    test.updatedAt = test.startDate;
    this.tests.set(id, test);
    logger.info(`A/B test started: ${test.name}`);
    return test;
  }

  pauseTest(id: string): ABTest {
    return this.updateTestStatus(id, 'PAUSED');
  }

  completeTest(id: string): ABTest {
    const test = this.tests.get(id);
    if (!test) throw new Error(`Test ${id} not found`);

    test.status = 'COMPLETED';
    test.endDate = new Date().toISOString();
    this.calculateMetrics(test);
    this.determineWinner(test);
    test.updatedAt = test.endDate;
    this.tests.set(id, test);
    logger.info(`A/B test completed: ${test.name}`);
    return test;
  }

  private updateTestStatus(id: string, status: ABTestStatus): ABTest {
    const test = this.tests.get(id);
    if (!test) throw new Error(`Test ${id} not found`);
    test.status = status;
    test.updatedAt = new Date().toISOString();
    this.tests.set(id, test);
    return test;
  }

  // ── Tracking ──

  recordImpression(testId: string, variantId: string): ABTest {
    const test = this.tests.get(testId);
    if (!test) throw new Error(`Test ${testId} not found`);

    const variant = test.variants.find(v => v.id === variantId);
    if (!variant) throw new Error(`Variant ${variantId} not found in test ${testId}`);

    variant.stats.impressions++;
    test.metrics.totalImpressions++;
    this.tests.set(testId, test);
    return test;
  }

  recordConversion(testId: string, variantId: string, revenue: number = 0): ABTest {
    const test = this.tests.get(testId);
    if (!test) throw new Error(`Test ${testId} not found`);

    const variant = test.variants.find(v => v.id === variantId);
    if (!variant) throw new Error(`Variant ${variantId} not found`);

    variant.stats.conversions++;
    variant.stats.revenue = roundTo(variant.stats.revenue + revenue);
    variant.stats.conversionRate = variant.stats.impressions > 0
      ? roundTo(variant.stats.conversions / variant.stats.impressions, 4) : 0;

    test.metrics.totalConversions++;
    test.metrics.totalRevenue = roundTo(test.metrics.totalRevenue + revenue);
    this.tests.set(testId, test);
    return test;
  }

  // ── Statistical Analysis ──

  private calculateMetrics(test: ABTest): void {
    for (const variant of test.variants) {
      variant.stats.conversionRate = variant.stats.impressions > 0
        ? roundTo(variant.stats.conversions / variant.stats.impressions, 4) : 0;
    }

    test.metrics.overallConversionRate = test.metrics.totalImpressions > 0
      ? roundTo(test.metrics.totalConversions / test.metrics.totalImpressions, 4) : 0;

    // Simple significance calculation using z-test approximation
    if (test.variants.length >= 2 && test.metrics.totalConversions > 0) {
      const control = test.variants[0];
      const bestVariant = [...test.variants].sort(
        (a, b) => b.stats.conversionRate - a.stats.conversionRate
      )[0];

      if (bestVariant && control && bestVariant.id !== control.id) {
        const p1 = control.stats.conversionRate;
        const p2 = bestVariant.stats.conversionRate;
        const n1 = control.stats.impressions || 1;
        const n2 = bestVariant.stats.impressions || 1;

        const pPool = ((p1 * n1) + (p2 * n2)) / (n1 + n2);
        const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
        const z = se > 0 ? (p2 - p1) / se : 0;

        test.metrics.significanceLevel = roundTo(Math.min(Math.abs(z) / 2.58, 1), 4);
      }
    }
  }

  private determineWinner(test: ABTest): void {
    if (test.winnerDetermination === 'MANUAL') return;

    const sorted = [...test.variants].sort(
      (a, b) => b.stats.conversionRate - a.stats.conversionRate
    );

    if (sorted.length > 1 && sorted[0].stats.conversionRate > sorted[1].stats.conversionRate) {
      test.winningVariant = sorted[0].id;
      test.metrics.recommendedVariant = sorted[0].id;
    }
  }

  getTestResults(testId: string): ABTest | undefined {
    const test = this.tests.get(testId);
    if (!test) return undefined;
    this.calculateMetrics(test);
    return test;
  }

  reset(): void {
    this.tests.clear();
  }
}

export default ABTestEngine.getInstance();
