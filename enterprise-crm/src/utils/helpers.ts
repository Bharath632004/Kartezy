/**
 * Kartezy Enterprise CRM — Helpers
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

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function daysBetween(from: string, to: string): number {
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getPreviousPeriod(period: string): string {
  const [year, month] = period.split('-').map(Number);
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
}
