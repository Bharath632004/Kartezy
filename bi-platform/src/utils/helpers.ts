/**
 * Kartezy Enterprise BI Platform - Helper Utilities
 */

import { v4 as uuidv4 } from 'uuid';

/** Generate unique ID for reports, analytics runs, etc. */
export function generateBIId(): string {
  return `bi_${uuidv4().replace(/-/g, '').substring(0, 20)}`;
}

/** Format currency in INR */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format percentage */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Calculate growth rate between two periods */
export function growthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 1 : 0;
  return (current - previous) / previous;
}

/** Calculate compound annual growth rate (CAGR) */
export function cagr(beginValue: number, endValue: number, periods: number): number {
  if (beginValue <= 0 || periods <= 0) return 0;
  return Math.pow(endValue / beginValue, 1 / periods) - 1;
}

/** Moving average */
export function movingAverage(data: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

/** Simple linear regression - returns { slope, intercept, r2 } */
export function linearRegression(x: number[], y: number[]): { slope: number; intercept: number; r2: number } {
  const n = Math.min(x.length, y.length);
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, xi, i) => a + xi * y[i], 0);
  const sumX2 = x.reduce((a, xi) => a + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R-squared
  const meanY = sumY / n;
  const ssRes = y.reduce((a, yi, i) => a + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
  const ssTot = y.reduce((a, yi) => a + Math.pow(yi - meanY, 2), 0);
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { slope, intercept: isNaN(intercept) ? 0 : intercept, r2: isNaN(r2) ? 0 : r2 };
}

/** Date range helpers */
export interface DateRange {
  startDate: string;
  endDate: string;
  label: string;
}

export function getDateRange(period: string): DateRange {
  const now = new Date();
  const end = now.toISOString().split('T')[0];
  let start: Date;

  switch (period) {
    case 'today':
      start = now;
      break;
    case 'yesterday':
      start = new Date(now.getTime() - 86400000);
      break;
    case 'last_7_days':
      start = new Date(now.getTime() - 7 * 86400000);
      break;
    case 'last_30_days':
      start = new Date(now.getTime() - 30 * 86400000);
      break;
    case 'this_month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'last_month':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    case 'this_quarter':
      start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      break;
    case 'this_year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now.getTime() - 30 * 86400000);
  }

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end,
    label: period,
  };
}

/** Pagination helper */
export function paginate<T>(data: T[], page: number = 1, size: number = 20): { data: T[]; total: number; page: number; size: number; totalPages: number } {
  const total = data.length;
  const totalPages = Math.ceil(total / size);
  const start = (page - 1) * size;
  return {
    data: data.slice(start, start + size),
    total,
    page,
    size,
    totalPages,
  };
}

/** Aggregate data by a key */
export function aggregateBy<T>(data: T[], keyFn: (item: T) => string, valueFn: (item: T) => number): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of data) {
    const key = keyFn(item);
    result[key] = (result[key] || 0) + valueFn(item);
  }
  return result;
}

/** Generate a time series from date range */
export function generateTimeSeries(startDate: string, endDate: string, interval: 'day' | 'week' | 'month' = 'day'): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  while (start <= end) {
    dates.push(start.toISOString().split('T')[0]);
    switch (interval) {
      case 'day': start.setDate(start.getDate() + 1); break;
      case 'week': start.setDate(start.getDate() + 7); break;
      case 'month': start.setMonth(start.getMonth() + 1); break;
    }
  }
  return dates;
}

/** Sleep utility */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
