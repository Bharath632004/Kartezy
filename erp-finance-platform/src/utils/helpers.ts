/**
 * Kartezy Enterprise ERP & Finance Platform — Helpers
 */

import { v4 as uuidv4 } from 'uuid';

export function generateId(prefix?: string): string {
  const id = uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
  return prefix ? `${prefix}-${id}` : id;
}

export function generateNumber(prefix: string, seq: number): string {
  const padded = String(seq).padStart(6, '0');
  return `${prefix}-${padded}`;
}

export function formatCurrency(amount: number, locale = 'en-IN', currency = 'INR'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function formatNumber(value: number, locale = 'en-IN'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 1 : 0;
  return (current - previous) / previous;
}

export function roundTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

export function parseDateRange(range: string): { start: Date; end: Date } {
  if (range.includes(':')) {
    const [start, end] = range.split(':');
    return { start: new Date(start), end: new Date(end) };
  }

  const now = new Date();
  const end = new Date(now);

  switch (range) {
    case 'today':
      return { start: new Date(now.getFullYear(), now.getMonth(), now.getDate()), end };
    case 'this_week': {
      const day = now.getDay();
      const start = new Date(now);
      start.setDate(now.getDate() - day);
      return { start, end };
    }
    case 'this_month':
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end };
    case 'this_quarter': {
      const q = Math.floor(now.getMonth() / 3);
      return { start: new Date(now.getFullYear(), q * 3, 1), end };
    }
    case 'this_year':
      return { start: new Date(now.getFullYear(), 0, 1), end };
    case 'last_30_days': {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      return { start, end };
    }
    case 'last_90_days': {
      const start = new Date(now);
      start.setDate(now.getDate() - 90);
      return { start, end };
    }
    case 'last_month': {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: first, end: last };
    }
    case 'last_year':
      return { start: new Date(now.getFullYear() - 1, 0, 1), end: new Date(now.getFullYear() - 1, 11, 31) };
    default:
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end };
  }
}

export function getFiscalYear(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

export function getFinancialPeriods(fiscalYear: string): string[] {
  const [startYear] = fiscalYear.split('-').map(Number);
  return Array.from({ length: 12 }, (_, i) => {
    const month = (i + 4) % 12 || 12;
    const year = month >= 4 ? startYear : startYear + 1;
    return `${year}-${String(month).padStart(2, '0')}`;
  });
}

export function calculateTax(amount: number, rate: number): number {
  return roundTo(amount * (rate / 100));
}

export function calculateGST(amount: number, rate: number, isInterstate: boolean): { cgst: number; sgst: number; igst: number; total: number } {
  const totalTax = calculateTax(amount, rate);
  if (isInterstate) {
    return { cgst: 0, sgst: 0, igst: totalTax, total: totalTax };
  }
  const half = roundTo(totalTax / 2);
  return { cgst: half, sgst: half, igst: 0, total: totalTax };
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
