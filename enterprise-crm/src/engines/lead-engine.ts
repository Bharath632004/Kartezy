/**
 * Kartezy Enterprise CRM — Lead Management Engine
 *
 * Complete lead lifecycle: capture, scoring, pipeline management,
 * activity tracking, conversion, and integration with customer CRM.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum, avg, getCurrentDate } from '../utils/helpers';
import type {
  Lead, LeadActivity, LeadSource, LeadStatus, LeadScoreCategory,
  LeadActivityType, LeadScoringRule,
} from '../types';

const logger = createLogger('LeadEngine');

export class LeadManagementEngine {
  private static instance: LeadManagementEngine;
  private leads: Map<string, Lead> = new Map();
  private scoringRules: Map<string, LeadScoringRule> = new Map();

  static getInstance(): LeadManagementEngine {
    if (!LeadManagementEngine.instance) {
      LeadManagementEngine.instance = new LeadManagementEngine();
    }
    return LeadManagementEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Lead Management Engine');
    this.seedDefaultScoringRules();
  }

  private seedDefaultScoringRules(): void {
    const rules: Omit<LeadScoringRule, 'id'>[] = [
      { name: 'Has Email', field: 'email', operator: 'CONTAINS', value: '@', score: 10, isActive: true },
      { name: 'Has Phone', field: 'phone', operator: 'GREATER_THAN', value: 10, score: 10, isActive: true },
      { name: 'High Budget', field: 'budget', operator: 'GREATER_THAN', value: 100000, score: 30, isActive: true },
      { name: 'Multiple Interests', field: 'interest', operator: 'GREATER_THAN', value: 2, score: 20, isActive: true },
      { name: 'From Website', field: 'source', operator: 'EQUALS', value: 'WEBSITE', score: 15, isActive: true },
      { name: 'From Referral', field: 'source', operator: 'EQUALS', value: 'REFERRAL', score: 25, isActive: true },
      { name: 'Has Company Info', field: 'company', operator: 'CONTAINS', value: '', score: 15, isActive: true },
    ];
    for (const rule of rules) {
      this.scoringRules.set(generateId('LSR'), { ...rule, id: generateId('LSR') });
    }
  }

  // ── Lead CRUD ──

  createLead(data: {
    firstName: string; lastName: string; email: string; phone: string;
    company?: string; designation?: string; source: LeadSource;
    interest?: string[]; budget?: number; timeline?: string; notes?: string;
    assignedTo?: string; customFields?: Record<string, string>;
  }): Lead {
    const now = new Date().toISOString();
    const lead: Lead = {
      id: generateId('LEAD'),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      designation: data.designation,
      source: data.source,
      status: 'NEW',
      score: 0,
      scoreCategory: 'LOW',
      assignedTo: data.assignedTo,
      interest: data.interest || [],
      budget: data.budget,
      timeline: data.timeline,
      notes: data.notes,
      customFields: data.customFields,
      activities: [],
      createdAt: now,
      updatedAt: now,
    };

    // Calculate initial score
    const scoring = this.calculateScore(lead);
    lead.score = scoring.score;
    lead.scoreCategory = scoring.category;

    this.leads.set(lead.id, lead);
    logger.info(`Created lead: ${lead.firstName} ${lead.lastName} (${lead.id})`);
    return lead;
  }

  getLead(id: string): Lead | undefined {
    return this.leads.get(id);
  }

  getAllLeads(filters?: {
    status?: LeadStatus; source?: LeadSource; assignedTo?: string;
    scoreCategory?: LeadScoreCategory; search?: string;
  }): Lead[] {
    let list = Array.from(this.leads.values());
    if (filters?.status) list = list.filter(l => l.status === filters.status);
    if (filters?.source) list = list.filter(l => l.source === filters.source);
    if (filters?.assignedTo) list = list.filter(l => l.assignedTo === filters.assignedTo);
    if (filters?.scoreCategory) list = list.filter(l => l.scoreCategory === filters.scoreCategory);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(l =>
        l.firstName.toLowerCase().includes(s) || l.lastName.toLowerCase().includes(s) ||
        l.email.toLowerCase().includes(s) || l.company?.toLowerCase().includes(s)
      );
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateLead(id: string, updates: Partial<Lead>): Lead {
    const lead = this.leads.get(id);
    if (!lead) throw new Error(`Lead ${id} not found`);

    const previousStatus = lead.status;
    Object.assign(lead, updates, { updatedAt: new Date().toISOString() });

    // Recalculate score if relevant fields changed
    if (updates.budget || updates.interest || updates.company) {
      const scoring = this.calculateScore(lead);
      lead.score = scoring.score;
      lead.scoreCategory = scoring.category;
    }

    this.leads.set(id, lead);

    // Log status change
    if (updates.status && previousStatus !== updates.status) {
      this.addActivity(id, {
        type: 'STATUS_CHANGED',
        description: `Status changed from ${previousStatus} to ${updates.status}`,
        performedBy: updates.assignedTo || 'system',
        metadata: { from: previousStatus, to: updates.status },
      });
    }

    return lead;
  }

  updateLeadStatus(id: string, status: LeadStatus, performedBy: string): Lead {
    return this.updateLead(id, { status });
  }

  // ── Scoring ──

  calculateScore(lead: Lead): { score: number; category: LeadScoreCategory } {
    let score = 0;
    for (const rule of this.scoringRules.values()) {
      if (!rule.isActive) continue;

      const fieldValue = (lead as any)[rule.field];
      if (fieldValue === undefined || fieldValue === null) continue;

      let matched = false;
      switch (rule.operator) {
        case 'EQUALS': matched = String(fieldValue) === String(rule.value); break;
        case 'CONTAINS': matched = String(fieldValue).toLowerCase().includes(String(rule.value).toLowerCase()); break;
        case 'GREATER_THAN': matched = Number(fieldValue) > Number(rule.value); break;
        case 'LESS_THAN': matched = Number(fieldValue) < Number(rule.value); break;
        case 'IN': matched = Array.isArray(rule.value) && rule.value.includes(fieldValue); break;
        case 'NOT_IN': matched = Array.isArray(rule.value) && !rule.value.includes(fieldValue); break;
      }
      if (matched) score += rule.score;
    }

    return {
      score,
      category: score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW',
    };
  }

  addScoringRule(rule: Omit<LeadScoringRule, 'id'>): LeadScoringRule {
    const newRule: LeadScoringRule = { ...rule, id: generateId('LSR') };
    this.scoringRules.set(newRule.id, newRule);
    return newRule;
  }

  getScoringRules(): LeadScoringRule[] {
    return Array.from(this.scoringRules.values());
  }

  // ── Activities ──

  addActivity(leadId: string, data: {
    type: LeadActivityType; description: string;
    performedBy: string; metadata?: Record<string, unknown>;
  }): Lead {
    const lead = this.leads.get(leadId);
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    const activity: LeadActivity = {
      id: generateId('LACT'),
      leadId,
      type: data.type,
      description: data.description,
      performedBy: data.performedBy,
      metadata: data.metadata,
      timestamp: new Date().toISOString(),
    };

    lead.activities.push(activity);
    lead.updatedAt = activity.timestamp;
    this.leads.set(leadId, lead);
    return lead;
  }

  // ── Conversion ──

  convertToCustomer(leadId: string, customerId: string): Lead {
    const lead = this.leads.get(leadId);
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    lead.status = 'WON';
    lead.convertedToCustomerId = customerId;
    lead.convertedAt = new Date().toISOString();
    lead.updatedAt = lead.convertedAt;
    this.leads.set(leadId, lead);

    this.addActivity(leadId, {
      type: 'STATUS_CHANGED',
      description: `Lead converted to customer (${customerId})`,
      performedBy: 'system',
      metadata: { customerId },
    });

    logger.info(`Lead ${leadId} converted to customer ${customerId}`);
    return lead;
  }

  // ── Pipeline Analytics ──

  getPipelineSummary(): {
    totalLeads: number; newLeads: number; contacted: number;
    qualified: number; proposal: number; negotiation: number;
    won: number; lost: number; conversionRate: number;
    bySource: Record<LeadSource, number>;
    byScore: Record<LeadScoreCategory, number>;
    averageScore: number;
  } {
    const all = Array.from(this.leads.values());
    const bySource: Record<string, number> = {};
    const byScore: Record<string, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };

    for (const l of all) {
      bySource[l.source] = (bySource[l.source] || 0) + 1;
      byScore[l.scoreCategory]++;
    }

    return {
      totalLeads: all.length,
      newLeads: all.filter(l => l.status === 'NEW').length,
      contacted: all.filter(l => l.status === 'CONTACTED').length,
      qualified: all.filter(l => l.status === 'QUALIFIED').length,
      proposal: all.filter(l => l.status === 'PROPOSAL').length,
      negotiation: all.filter(l => l.status === 'NEGOTIATION').length,
      won: all.filter(l => l.status === 'WON').length,
      lost: all.filter(l => l.status === 'LOST').length,
      conversionRate: all.length > 0 ? roundTo(all.filter(l => l.status === 'WON').length / all.length, 4) : 0,
      bySource: bySource as Record<LeadSource, number>,
      byScore: byScore as Record<LeadScoreCategory, number>,
      averageScore: all.length > 0 ? roundTo(avg(all.map(l => l.score)), 1) : 0,
    };
  }

  reset(): void {
    this.leads.clear();
    this.scoringRules.clear();
  }
}

export default LeadManagementEngine.getInstance();
