/**
 * Kartezy Enterprise BI Platform — Performance Benchmark Suite
 *
 * Measures response times for all analytics engine methods under
 * cold-start and warm conditions, reporting min/avg/max/p50/p95/p99
 * latencies across multiple iterations.
 *
 * Usage:
 *   npx jest tests/performance/benchmarks.test.ts --verbose --no-coverage
 *
 * Environment variables:
 *   BENCHMARK_ITERATIONS  — number of iterations per method (default: 25)
 *   BENCHMARK_WARMUP      — number of warm-up rounds (default: 3)
 *   BENCHMARK_LARGE_SCALE — enable large-scale data generation (default: false)
 */

import { performance } from 'node:perf_hooks';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { CustomerAnalytics } from '../../src/analytics/customer-analytics';
import { CohortAnalysis } from '../../src/analytics/cohort-analysis';
import { ChurnPrediction } from '../../src/analytics/churn-prediction';
import { DeliveryAnalytics } from '../../src/analytics/delivery-analytics';
import { FinanceAnalytics } from '../../src/analytics/finance-analytics';
import { FunnelAnalysis } from '../../src/analytics/funnel-analysis';
import { HeatMapAnalytics } from '../../src/analytics/heat-maps';
import { InventoryAnalytics } from '../../src/analytics/inventory-analytics';
import { MarketingAnalytics } from '../../src/analytics/marketing-analytics';
import { ProductAnalytics } from '../../src/analytics/product-analytics';
import { CityAnalytics } from '../../src/analytics/city-analytics';
import { CLVAnalysis } from '../../src/analytics/clv-analysis';

const ITERATIONS = parseInt(process.env.BENCHMARK_ITERATIONS || '25', 10);
const WARMUP = parseInt(process.env.BENCHMARK_WARMUP || '3', 10);
const LARGE_SCALE = process.env.BENCHMARK_LARGE_SCALE === 'true';

// ── Result types ──

interface BenchmarkResult {
  engine: string;
  method: string;
  iterations: number;
  coldStartMs: number;
  warmStats: {
    minMs: number;
    maxMs: number;
    avgMs: number;
    medianMs: number;
    p95Ms: number;
    p99Ms: number;
    stdDevMs: number;
    totalMs: number;
  };
  samples: number[];
}

function percentile(sorted: number[], p: number): number {
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}

function stdDev(values: number[], mean: number): number {
  if (values.length < 2) return 0;
  const sqDiffs = values.map(v => (v - mean) ** 2);
  return Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / (values.length - 1));
}

async function benchmarkMethod<T>(
  engine: string,
  method: string,
  fn: () => Promise<T>,
): Promise<BenchmarkResult> {
  const timings: number[] = [];

  const coldStart = performance.now();
  await fn();
  const coldMs = Math.round((performance.now() - coldStart) * 100) / 100;

  for (let i = 0; i < WARMUP; i++) {
    await fn();
  }

  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    await fn();
    timings.push(Math.round((performance.now() - start) * 100) / 100);
  }

  const sorted = [...timings].sort((a, b) => a - b);
  const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
  const fullName = `${engine}.${method}()`;

  return {
    engine,
    method: fullName,
    iterations: ITERATIONS,
    coldStartMs: coldMs,
    warmStats: {
      minMs: sorted[0],
      maxMs: sorted[sorted.length - 1],
      avgMs: Math.round(avg * 100) / 100,
      medianMs: percentile(sorted, 50),
      p95Ms: percentile(sorted, 95),
      p99Ms: percentile(sorted, 99),
      stdDevMs: Math.round(stdDev(timings, avg) * 100) / 100,
      totalMs: Math.round(timings.reduce((a, b) => a + b, 0) * 100) / 100,
    },
    samples: timings,
  };
}

function formatMs(ms: number): string {
  return ms < 1 ? `${(ms * 1000).toFixed(0)}us` : `${ms.toFixed(2)}ms`;
}

function printResult(r: BenchmarkResult): string {
  const label = `${r.method.padEnd(40)}`;
  const cold = `${r.coldStartMs.toFixed(2).padStart(8)}ms`;
  const avg = `${r.warmStats.avgMs.toFixed(2).padStart(8)}ms`;
  const min = `${r.warmStats.minMs.toFixed(2).padStart(8)}ms`;
  const max = `${r.warmStats.maxMs.toFixed(2).padStart(8)}ms`;
  const p95 = `${r.warmStats.p95Ms.toFixed(2).padStart(8)}ms`;
  const dev = `${r.warmStats.stdDevMs.toFixed(2).padStart(8)}ms`;
  return `${label}  | Cold ${cold} | Avg ${avg} | Min ${min} | Max ${max} | P95 ${p95} | sd ${dev}`;
}

// ── Report generator ──

function generateReport(results: BenchmarkResult[]): string {
  const lines: string[] = [];
  const scaleLabel = LARGE_SCALE ? 'YES (concurrent stress tests included)' : 'NO';
  const sep = '\u2500'.repeat(120);

  lines.push('');
  lines.push('╔════════════════════════════════════════════════════════════════════════════╗');
  lines.push('║     KARTEZY ENTERPRISE BI PLATFORM - PERFORMANCE BENCHMARK REPORT        ║');
  lines.push('╚════════════════════════════════════════════════════════════════════════════╝');
  lines.push('');
  lines.push(`  Date:        ${new Date().toISOString()}`);
  lines.push(`  Iterations:  ${ITERATIONS} per method`);
  lines.push(`  Warm-up:     ${WARMUP} rounds`);
  lines.push(`  Large-scale: ${scaleLabel}`);
  lines.push(`  Node.js:     ${process.version}`);
  lines.push('');
  lines.push(sep);

  const grouped: Record<string, BenchmarkResult[]> = {};
  for (const r of results) {
    if (!grouped[r.engine]) grouped[r.engine] = [];
    grouped[r.engine].push(r);
  }

  const engineOrder = [
    'CustomerAnalytics', 'DeliveryAnalytics', 'FinanceAnalytics',
    'MarketingAnalytics', 'ProductAnalytics', 'InventoryAnalytics',
    'CohortAnalysis', 'FunnelAnalysis', 'CLVAnalysis',
    'ChurnPrediction', 'HeatMapAnalytics', 'CityAnalytics',
  ];

  for (const engine of engineOrder) {
    const group = grouped[engine];
    if (!group) continue;

    lines.push('');
    lines.push(`  ** ${engine} **`);
    lines.push(sep);
    lines.push(`  ${'Method'.padEnd(42)} | Cold Start | Avg     | Min     | Max     | P95     | Std Dev`);
    lines.push(sep);

    group.sort((a, b) => a.warmStats.avgMs - b.warmStats.avgMs);
    for (const r of group) {
      lines.push(`  ${printResult(r)}`);
    }
    lines.push(sep);
  }

  // Include stress test results if present
  const stressGroup = grouped['StressTest'];
  if (stressGroup) {
    lines.push('');
    lines.push(`  ** Stress Tests (concurrent) **`);
    lines.push(sep);
    for (const r of stressGroup) {
      lines.push(`  ${r.method.padEnd(46)} ${formatMs(r.warmStats.avgMs)} (single run)`);
    }
    lines.push(sep);
  }

  // Overall summary
  const allAvgs = results.filter(r => r.engine !== 'StressTest').map(r => r.warmStats.avgMs);
  const overallAvg = allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length;
  const totalCold = results.reduce((s, r) => s + r.coldStartMs, 0);
  const totalWarm = results.filter(r => r.engine !== 'StressTest').reduce((s, r) => s + r.warmStats.totalMs, 0);

  lines.push('');
  lines.push('  ** OVERALL SUMMARY **');
  lines.push(sep);
  lines.push(`  Total methods benchmarked:  ${allAvgs.length}`);
  lines.push(`  Overall average response:   ${formatMs(overallAvg)}`);
  lines.push(`  Total cold-start time:      ${formatMs(totalCold)}`);
  lines.push(`  Total warm execution time:  ${formatMs(totalWarm)}`);

  const fastest = results.filter(r => r.engine !== 'StressTest').reduce((a, b) => a.warmStats.avgMs < b.warmStats.avgMs ? a : b);
  const slowest = results.filter(r => r.engine !== 'StressTest').reduce((a, b) => a.warmStats.avgMs > b.warmStats.avgMs ? a : b);
  lines.push(`  Fastest method:             ${fastest.method} @ ${formatMs(fastest.warmStats.avgMs)}`);
  lines.push(`  Slowest method:             ${slowest.method} @ ${formatMs(slowest.warmStats.avgMs)}`);

  if (totalWarm > 0) {
    const ratio = totalCold / (totalWarm / ITERATIONS);
    lines.push(`  Cold-start overhead:        ${ratio.toFixed(1)}x`);
  }

  // Bottleneck analysis
  lines.push('');
  lines.push(sep);
  lines.push('  ** BOTTLENECK ANALYSIS **');
  lines.push(sep);

  const slowMethods = results.filter(r => r.engine !== 'StressTest' && r.warmStats.avgMs > 10);
  if (slowMethods.length > 0) {
    lines.push('  Methods with avg > 10ms:');
    for (const r of slowMethods.sort((a, b) => b.warmStats.avgMs - a.warmStats.avgMs)) {
      lines.push(`    WARNING ${r.method.padEnd(45)} ${formatMs(r.warmStats.avgMs)}`);
    }
  } else {
    lines.push('  All methods below 10ms average. No bottlenecks detected.');
  }

  const highVariance = results.filter(r => r.engine !== 'StressTest' && r.warmStats.stdDevMs > r.warmStats.avgMs * 0.5 && r.warmStats.avgMs > 0);
  if (highVariance.length > 0) {
    lines.push('');
    lines.push('  Methods with high variance (sd > 50% of avg):');
    for (const r of highVariance) {
      lines.push(`    NOTE ${r.method.padEnd(45)} avg=${formatMs(r.warmStats.avgMs)} sd=${formatMs(r.warmStats.stdDevMs)}`);
    }
  }

  // Recommendations
  lines.push('');
  lines.push(sep);
  lines.push('  ** RECOMMENDATIONS **');
  lines.push(sep);
  lines.push('  - All methods use in-memory mock data (no DB latency)');
  lines.push('  - Real PostgreSQL queries add 10-100ms per call');
  lines.push('  - For production, add Redis caching for frequently accessed analytics');
  lines.push('  - Consider pre-computing cohort/revenue matrices via scheduled ETL');
  lines.push('  - Worker threads recommended for heat map spatial computations');
  lines.push('  - DeliveryTrend has highest variance - investigate randomization');
  lines.push('');
  lines.push(sep);

  return lines.join('\n');
}

// ── Benchmark suite ──

describe('Performance Benchmarks', () => {
  const results: BenchmarkResult[] = [];
  const TIMEOUT = 120_000;

  afterAll(() => {
    const report = generateReport(results);
    const reportDir = path.join(__dirname, '..', '..', 'dist', 'benchmarks');
    fs.mkdirSync(reportDir, { recursive: true });
    const reportPath = path.join(reportDir, 'performance-report.txt');
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`\nReport saved to: ${reportPath}\n`);
    console.log(report);
  });

  // ── CustomerAnalytics (6 methods) ──
  describe('CustomerAnalytics', () => {
    const engine = CustomerAnalytics.getInstance();

    it('getSegments', async () => {
      results.push(await benchmarkMethod('CustomerAnalytics', 'getSegments', () => engine.getSegments()));
    }, TIMEOUT);

    it('getBehavior', async () => {
      results.push(await benchmarkMethod('CustomerAnalytics', 'getBehavior', () => engine.getBehavior()));
    }, TIMEOUT);

    it('getRetentionCohorts', async () => {
      results.push(await benchmarkMethod('CustomerAnalytics', 'getRetentionCohorts', () => engine.getRetentionCohorts()));
    }, TIMEOUT);

    it('getOverview', async () => {
      results.push(await benchmarkMethod('CustomerAnalytics', 'getOverview', () => engine.getOverview()));
    }, TIMEOUT);

    it('getCustomer360', async () => {
      results.push(await benchmarkMethod('CustomerAnalytics', 'getCustomer360', () => engine.getCustomer360('CUST-12345')));
    }, TIMEOUT);

    it('getAcquisitionTrend', async () => {
      results.push(await benchmarkMethod('CustomerAnalytics', 'getAcquisitionTrend', () => engine.getAcquisitionTrend('last_30_days')));
    }, TIMEOUT);
  });

  // ── CohortAnalysis (5 methods) ──
  describe('CohortAnalysis', () => {
    const engine = CohortAnalysis.getInstance();

    it('getSummary', async () => {
      results.push(await benchmarkMethod('CohortAnalysis', 'getSummary', () => engine.getSummary()));
    }, TIMEOUT);

    it('getRetentionMatrix (quarterly)', async () => {
      results.push(await benchmarkMethod('CohortAnalysis', 'getRetentionMatrix', () => engine.getRetentionMatrix('quarterly')));
    }, TIMEOUT);

    it('getRevenueCohorts', async () => {
      results.push(await benchmarkMethod('CohortAnalysis', 'getRevenueCohorts', () => engine.getRevenueCohorts()));
    }, TIMEOUT);

    it('getRetentionMatrix (monthly)', async () => {
      results.push(await benchmarkMethod('CohortAnalysis', 'getRetentionMatrix', () => engine.getRetentionMatrix('monthly')));
    }, TIMEOUT);

    it('getRetentionMatrix (weekly)', async () => {
      results.push(await benchmarkMethod('CohortAnalysis', 'getRetentionMatrix', () => engine.getRetentionMatrix('weekly')));
    }, TIMEOUT);
  });

  // ── ChurnPrediction (3 methods) ──
  describe('ChurnPrediction', () => {
    const engine = ChurnPrediction.getInstance();

    it('predictCustomerChurn', async () => {
      results.push(await benchmarkMethod('ChurnPrediction', 'predictCustomerChurn', () => engine.predictCustomerChurn('CUST-12345')));
    }, TIMEOUT);

    it('getChurnSegments', async () => {
      results.push(await benchmarkMethod('ChurnPrediction', 'getChurnSegments', () => engine.getChurnSegments()));
    }, TIMEOUT);

    it('getOverview', async () => {
      results.push(await benchmarkMethod('ChurnPrediction', 'getOverview', () => engine.getOverview()));
    }, TIMEOUT);
  });

  // ── DeliveryAnalytics (4 methods) ──
  describe('DeliveryAnalytics', () => {
    const engine = DeliveryAnalytics.getInstance();

    it('getOverview', async () => {
      results.push(await benchmarkMethod('DeliveryAnalytics', 'getOverview', () => engine.getOverview()));
    }, TIMEOUT);

    it('getDriverPerformance', async () => {
      results.push(await benchmarkMethod('DeliveryAnalytics', 'getDriverPerformance', () => engine.getDriverPerformance('DRV-001')));
    }, TIMEOUT);

    it('getZoneAnalytics', async () => {
      results.push(await benchmarkMethod('DeliveryAnalytics', 'getZoneAnalytics', () => engine.getZoneAnalytics()));
    }, TIMEOUT);

    it('getDeliveryTrend', async () => {
      results.push(await benchmarkMethod('DeliveryAnalytics', 'getDeliveryTrend', () => engine.getDeliveryTrend('last_30_days')));
    }, TIMEOUT);
  });

  // ── FinanceAnalytics (6 methods) ──
  describe('FinanceAnalytics', () => {
    const engine = FinanceAnalytics.getInstance();

    it('getRevenueBreakdown', async () => {
      results.push(await benchmarkMethod('FinanceAnalytics', 'getRevenueBreakdown', () => engine.getRevenueBreakdown()));
    }, TIMEOUT);

    it('getGSTReport', async () => {
      results.push(await benchmarkMethod('FinanceAnalytics', 'getGSTReport', () => engine.getGSTReport()));
    }, TIMEOUT);

    it('getPayoutSummary', async () => {
      results.push(await benchmarkMethod('FinanceAnalytics', 'getPayoutSummary', () => engine.getPayoutSummary()));
    }, TIMEOUT);

    it('getForecast', async () => {
      results.push(await benchmarkMethod('FinanceAnalytics', 'getForecast', () => engine.getForecast()));
    }, TIMEOUT);

    it('getOverview', async () => {
      results.push(await benchmarkMethod('FinanceAnalytics', 'getOverview', () => engine.getOverview()));
    }, TIMEOUT);

    it('getCommissionSummary', async () => {
      results.push(await benchmarkMethod('FinanceAnalytics', 'getCommissionSummary', () => engine.getCommissionSummary()));
    }, TIMEOUT);
  });

  // ── MarketingAnalytics (3 methods) ──
  describe('MarketingAnalytics', () => {
    const engine = MarketingAnalytics.getInstance();

    it('getOverview', async () => {
      results.push(await benchmarkMethod('MarketingAnalytics', 'getOverview', () => engine.getOverview()));
    }, TIMEOUT);

    it('getCampaignPerformance', async () => {
      results.push(await benchmarkMethod('MarketingAnalytics', 'getCampaignPerformance', () => engine.getCampaignPerformance('CAMP-001')));
    }, TIMEOUT);

    it('getChannelPerformance', async () => {
      results.push(await benchmarkMethod('MarketingAnalytics', 'getChannelPerformance', () => engine.getChannelPerformance()));
    }, TIMEOUT);
  });

  // ── ProductAnalytics (3 methods) ──
  describe('ProductAnalytics', () => {
    const engine = ProductAnalytics.getInstance();

    it('getProductPerformance', async () => {
      results.push(await benchmarkMethod('ProductAnalytics', 'getProductPerformance', () => engine.getProductPerformance('PROD-001')));
    }, TIMEOUT);

    it('getOverview', async () => {
      results.push(await benchmarkMethod('ProductAnalytics', 'getOverview', () => engine.getOverview()));
    }, TIMEOUT);

    it('getCategoryAnalytics', async () => {
      results.push(await benchmarkMethod('ProductAnalytics', 'getCategoryAnalytics', () => engine.getCategoryAnalytics()));
    }, TIMEOUT);
  });

  // ── InventoryAnalytics (3 methods) ──
  describe('InventoryAnalytics', () => {
    const engine = InventoryAnalytics.getInstance();

    it('getProductInventory', async () => {
      results.push(await benchmarkMethod('InventoryAnalytics', 'getProductInventory', () => engine.getProductInventory('PROD-001')));
    }, TIMEOUT);

    it('getOverview', async () => {
      results.push(await benchmarkMethod('InventoryAnalytics', 'getOverview', () => engine.getOverview()));
    }, TIMEOUT);

    it('getReplenishmentSuggestions', async () => {
      results.push(await benchmarkMethod('InventoryAnalytics', 'getReplenishmentSuggestions', () => engine.getReplenishmentSuggestions()));
    }, TIMEOUT);
  });

  // ── FunnelAnalysis (4 methods) ──
  describe('FunnelAnalysis', () => {
    const engine = FunnelAnalysis.getInstance();

    it('getInsights', async () => {
      results.push(await benchmarkMethod('FunnelAnalysis', 'getInsights', () => engine.getInsights()));
    }, TIMEOUT);

    it('getMarketingFunnel', async () => {
      results.push(await benchmarkMethod('FunnelAnalysis', 'getMarketingFunnel', () => engine.getMarketingFunnel()));
    }, TIMEOUT);

    it('getOrderFunnel', async () => {
      results.push(await benchmarkMethod('FunnelAnalysis', 'getOrderFunnel', () => engine.getOrderFunnel()));
    }, TIMEOUT);

    it('getFunnelComparison', async () => {
      results.push(await benchmarkMethod('FunnelAnalysis', 'getFunnelComparison', () => engine.getFunnelComparison()));
    }, TIMEOUT);
  });

  // ── CLVAnalysis (4 methods) ──
  describe('CLVAnalysis', () => {
    const engine = CLVAnalysis.getInstance();

    it('getCustomerCLV', async () => {
      results.push(await benchmarkMethod('CLVAnalysis', 'getCustomerCLV', () => engine.getCustomerCLV('CUST-12345')));
    }, TIMEOUT);

    it('getDistribution', async () => {
      results.push(await benchmarkMethod('CLVAnalysis', 'getDistribution', () => engine.getDistribution()));
    }, TIMEOUT);

    it('predictFromRFM', async () => {
      results.push(await benchmarkMethod('CLVAnalysis', 'predictFromRFM', () => engine.predictFromRFM(75)));
    }, TIMEOUT);

    it('getForecast', async () => {
      results.push(await benchmarkMethod('CLVAnalysis', 'getForecast', () => engine.getForecast()));
    }, TIMEOUT);
  });

  // ── HeatMapAnalytics (4 methods) ──
  describe('HeatMapAnalytics', () => {
    const engine = HeatMapAnalytics.getInstance();

    it('getDeliveryHeatMap', async () => {
      results.push(await benchmarkMethod('HeatMapAnalytics', 'getDeliveryHeatMap', () => engine.getDeliveryHeatMap('Mumbai')));
    }, TIMEOUT);

    it('getMerchantDensity', async () => {
      results.push(await benchmarkMethod('HeatMapAnalytics', 'getMerchantDensity', () => engine.getMerchantDensity('Mumbai')));
    }, TIMEOUT);

    it('getActivityHeatMap', async () => {
      results.push(await benchmarkMethod('HeatMapAnalytics', 'getActivityHeatMap', () => engine.getActivityHeatMap()));
    }, TIMEOUT);

    it('getOrderDensity', async () => {
      results.push(await benchmarkMethod('HeatMapAnalytics', 'getOrderDensity', () => engine.getOrderDensity('Mumbai')));
    }, TIMEOUT);
  });

  // ── CityAnalytics (4 methods) ──
  describe('CityAnalytics', () => {
    const engine = CityAnalytics.getInstance();

    it('getCityHeatMap', async () => {
      results.push(await benchmarkMethod('CityAnalytics', 'getCityHeatMap', () => engine.getCityHeatMap('Mumbai')));
    }, TIMEOUT);

    it('getExpansionOpportunities', async () => {
      results.push(await benchmarkMethod('CityAnalytics', 'getExpansionOpportunities', () => engine.getExpansionOpportunities()));
    }, TIMEOUT);

    it('getAllCities', async () => {
      results.push(await benchmarkMethod('CityAnalytics', 'getAllCities', () => engine.getAllCities()));
    }, TIMEOUT);

    it('getComparison', async () => {
      results.push(await benchmarkMethod('CityAnalytics', 'getComparison', () => engine.getComparison()));
    }, TIMEOUT);
  });

  // ── Large-scale stress tests (conditional) ──
  if (LARGE_SCALE) {
    describe('LargeScale Stress Tests', () => {
      it('getCustomer360 - 100 concurrent', async () => {
        const engine = CustomerAnalytics.getInstance();
        const ids = Array.from({ length: 100 }, (_, i) => `CUST-${i}`);
        const start = performance.now();
        await Promise.all(ids.map(id => engine.getCustomer360(id)));
        const elapsed = Math.round((performance.now() - start) * 100) / 100;
        results.push({
          engine: 'StressTest',
          method: 'getCustomer360(100 concurrent)',
          iterations: 1,
          coldStartMs: elapsed,
          warmStats: { minMs: elapsed, maxMs: elapsed, avgMs: elapsed, medianMs: elapsed, p95Ms: elapsed, p99Ms: elapsed, stdDevMs: 0, totalMs: elapsed },
          samples: [elapsed],
        });
        console.log(`  100 concurrent Customer360 lookups: ${elapsed.toFixed(2)}ms`);
      }, TIMEOUT);

      it('predictCustomerChurn - 100 concurrent', async () => {
        const engine = ChurnPrediction.getInstance();
        const ids = Array.from({ length: 100 }, (_, i) => `CUST-${i}`);
        const start = performance.now();
        await Promise.all(ids.map(id => engine.predictCustomerChurn(id)));
        const elapsed = Math.round((performance.now() - start) * 100) / 100;
        results.push({
          engine: 'StressTest',
          method: 'predictCustomerChurn(100 concurrent)',
          iterations: 1,
          coldStartMs: elapsed,
          warmStats: { minMs: elapsed, maxMs: elapsed, avgMs: elapsed, medianMs: elapsed, p95Ms: elapsed, p99Ms: elapsed, stdDevMs: 0, totalMs: elapsed },
          samples: [elapsed],
        });
        console.log(`  100 concurrent Churn predictions: ${elapsed.toFixed(2)}ms`);
      }, TIMEOUT);

      it('getOrderDensity - 10 cities', async () => {
        const engine = HeatMapAnalytics.getInstance();
        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
        const start = performance.now();
        await Promise.all(cities.map(city => engine.getOrderDensity(city)));
        const elapsed = Math.round((performance.now() - start) * 100) / 100;
        results.push({
          engine: 'StressTest',
          method: 'getOrderDensity(10 cities)',
          iterations: 1,
          coldStartMs: elapsed,
          warmStats: { minMs: elapsed, maxMs: elapsed, avgMs: elapsed, medianMs: elapsed, p95Ms: elapsed, p99Ms: elapsed, stdDevMs: 0, totalMs: elapsed },
          samples: [elapsed],
        });
        console.log(`  10 concurrent city heatmaps: ${elapsed.toFixed(2)}ms`);
      }, TIMEOUT);
    });
  }
});
