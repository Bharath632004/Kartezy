/**
 * Kartezy Enterprise CRM — Customer Segmentation Engine
 *
 * Dynamic customer segmentation with behavioral, demographic,
 * transactional, RFM, and predictive segments.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo } from '../utils/helpers';
import type { Segment, SegmentRule, SegmentType, SegmentOperator } from '../types';
import type { CustomerProfile } from '../types';

const logger = createLogger('SegmentationEngine');

export class SegmentationEngine {
  private static instance: SegmentationEngine;
  private segments: Map<string, Segment> = new Map();

  static getInstance(): SegmentationEngine {
    if (!SegmentationEngine.instance) {
      SegmentationEngine.instance = new SegmentationEngine();
    }
    return SegmentationEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Segmentation Engine');
    this.seedDefaultSegments();
  }

  private seedDefaultSegments(): void {
    this.createSegment({
      name: 'All Customers',
      description: 'All registered customers',
      type: 'DEMOGRAPHIC',
      rules: [{ field: 'email', operator: 'CONTAINS', value: '@' }],
      logic: 'AND',
      isDynamic: true,
      createdBy: 'system',
    });

    this.createSegment({
      name: 'High Value',
      description: 'Customers with LTV > ₹10,000',
      type: 'RFM',
      rules: [{ field: 'lifetimeValue', operator: 'GREATER_THAN', value: 10000 }],
      logic: 'AND',
      isDynamic: true,
      createdBy: 'system',
    });

    this.createSegment({
      name: 'At Risk',
      description: 'Customers with high churn probability',
      type: 'PREDICTIVE',
      rules: [
        { field: 'lifecycleStage', operator: 'EQUALS', value: 'AT_RISK' },
      ],
      logic: 'OR',
      isDynamic: true,
      createdBy: 'system',
    });

    this.createSegment({
      name: 'VIP Gold+',
      description: 'Gold, Platinum and Diamond tier customers',
      type: 'BEHAVIORAL',
      rules: [
        { field: 'tier', operator: 'IN', value: ['GOLD', 'PLATINUM', 'DIAMOND'] },
      ],
      logic: 'OR',
      isDynamic: true,
      createdBy: 'system',
    });

    this.createSegment({
      name: 'New Last 30 Days',
      description: 'Customers acquired in the last 30 days',
      type: 'BEHAVIORAL',
      rules: [
        { field: 'acquisitionDate', operator: 'LAST_X_DAYS', value: 30 },
      ],
      logic: 'AND',
      isDynamic: true,
      createdBy: 'system',
    });

    this.createSegment({
      name: 'Inactive 90 Days',
      description: 'Customers inactive for 90+ days',
      type: 'BEHAVIORAL',
      rules: [
        { field: 'lastPurchaseDate', operator: 'LAST_X_DAYS', value: 90 },
      ],
      logic: 'AND',
      isDynamic: true,
      createdBy: 'system',
    });

    logger.info('Seeded 6 default segments');
  }

  createSegment(data: {
    name: string; description: string; type: SegmentType;
    rules: SegmentRule[]; logic: 'AND' | 'OR'; isDynamic?: boolean;
    createdBy: string;
  }): Segment {
    const segment: Segment = {
      id: generateId('SEG'),
      name: data.name,
      description: data.description,
      type: data.type,
      rules: data.rules,
      logic: data.logic,
      customerCount: 0,
      isDynamic: data.isDynamic ?? true,
      isActive: true,
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.segments.set(segment.id, segment);
    logger.info(`Created segment: ${segment.name}`);
    return segment;
  }

  getSegment(id: string): Segment | undefined {
    return this.segments.get(id);
  }

  getAllSegments(): Segment[] {
    return Array.from(this.segments.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateSegment(id: string, updates: Partial<Segment>): Segment {
    const seg = this.segments.get(id);
    if (!seg) throw new Error(`Segment ${id} not found`);
    Object.assign(seg, updates, { updatedAt: new Date().toISOString() });
    this.segments.set(id, seg);
    return seg;
  }

  // ── Customer Evaluation ──

  evaluateCustomer(customer: CustomerProfile, segmentId: string): boolean {
    const segment = this.segments.get(segmentId);
    if (!segment) throw new Error(`Segment ${segmentId} not found`);

    const results = segment.rules.map(rule => this.evaluateRule(customer, rule));

    if (segment.logic === 'AND') return results.every(Boolean);
    return results.some(Boolean);
  }

  evaluateSegment(customer: CustomerProfile, segment: Segment): boolean {
    const results = segment.rules.map(rule => this.evaluateRule(customer, rule));
    if (segment.logic === 'AND') return results.every(Boolean);
    return results.some(Boolean);
  }

  getCustomerSegments(customer: CustomerProfile): Segment[] {
    return Array.from(this.segments.values())
      .filter(s => s.isActive && this.evaluateSegment(customer, s));
  }

  private evaluateRule(customer: CustomerProfile, rule: SegmentRule): boolean {
    const fieldValue = (customer as any)[rule.field];

    switch (rule.operator) {
      case 'EQUALS': return fieldValue === rule.value;
      case 'NOT_EQUALS': return fieldValue !== rule.value;
      case 'GREATER_THAN': return Number(fieldValue) > Number(rule.value);
      case 'LESS_THAN': return Number(fieldValue) < Number(rule.value);
      case 'BETWEEN': {
        const val = Number(fieldValue);
        return val >= Number(rule.value) && val <= Number(rule.valueEnd || 0);
      }
      case 'IN': return Array.isArray(rule.value) && rule.value.includes(fieldValue);
      case 'NOT_IN': return Array.isArray(rule.value) && !rule.value.includes(fieldValue);
      case 'CONTAINS': {
        if (Array.isArray(fieldValue)) return fieldValue.some((f: string) => f.toLowerCase().includes(String(rule.value).toLowerCase()));
        return String(fieldValue).toLowerCase().includes(String(rule.value).toLowerCase());
      }
      case 'LAST_X_DAYS': {
        if (!fieldValue) return true; // No activity = matches inactivity segments
        const daysAgo = Math.floor((Date.now() - new Date(fieldValue).getTime()) / 86400000);
        return daysAgo >= Number(rule.value);
      }
      default: return false;
    }
  }

  // ── RFM Analysis ──

  calculateRFMScore(recency: number, frequency: number, monetary: number): {
    recencyScore: number; frequencyScore: number; monetaryScore: number;
    rfmSegment: string; overallScore: number;
  } {
    const rScore = recency <= 7 ? 5 : recency <= 30 ? 4 : recency <= 60 ? 3 : recency <= 90 ? 2 : 1;
    const fScore = frequency >= 20 ? 5 : frequency >= 10 ? 4 : frequency >= 5 ? 3 : frequency >= 2 ? 2 : 1;
    const mScore = monetary >= 50000 ? 5 : monetary >= 20000 ? 4 : monetary >= 10000 ? 3 : monetary >= 3000 ? 2 : 1;

    const combined = `${rScore}${fScore}${mScore}`;
    const overallScore = rScore + fScore + mScore;

    let rfmSegment = 'General';
    if (overallScore >= 13) rfmSegment = 'Champions';
    else if (overallScore >= 10) rfmSegment = 'Loyal Customers';
    else if (rScore >= 4 && fScore >= 1) rfmSegment = 'Recent Customers';
    else if (rScore >= 3 && mScore >= 3) rfmSegment = 'Potential Loyalists';
    else if (rScore <= 2 && fScore >= 3) rfmSegment = 'At Risk';
    else if (rScore <= 2 && mScore <= 2) rfmSegment = 'Hibernating';
    else if (rScore <= 2 && fScore <= 2) rfmSegment = 'Lost';

    return { recencyScore: rScore, frequencyScore: fScore, monetaryScore: mScore, rfmSegment, overallScore };
  }

  getSegmentAnalytics(): Array<{ id: string; name: string; customerCount: number; isDynamic: boolean }> {
    return Array.from(this.segments.values()).map(s => ({
      id: s.id, name: s.name, customerCount: s.customerCount, isDynamic: s.isDynamic,
    }));
  }

  reset(): void {
    this.segments.clear();
  }
}

export default SegmentationEngine.getInstance();
