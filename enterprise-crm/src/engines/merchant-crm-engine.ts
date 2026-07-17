/**
 * Kartezy Enterprise CRM — Merchant CRM Engine
 *
 * Merchant relationship management: profiles, performance tracking,
 * tier management, engagement scoring, and retention analysis.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum, avg, getCurrentDate, daysBetween } from '../utils/helpers';
import type { MerchantProfile, MerchantTier, MerchantLifecycleStage, Address, ChannelType } from '../types';

const logger = createLogger('MerchantCRMEngine');

export class MerchantCRMEngine {
  private static instance: MerchantCRMEngine;
  private merchants: Map<string, MerchantProfile> = new Map();

  static getInstance(): MerchantCRMEngine {
    if (!MerchantCRMEngine.instance) {
      MerchantCRMEngine.instance = new MerchantCRMEngine();
    }
    return MerchantCRMEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Merchant CRM Engine');
  }

  createProfile(data: {
    businessName: string; ownerName: string; email: string; phone: string;
    businessType: string; address: Address; gstin?: string; pan?: string;
  }): MerchantProfile {
    const now = new Date().toISOString();

    const profile: MerchantProfile = {
      id: generateId('MERC'),
      businessName: data.businessName,
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,
      businessType: data.businessType,
      address: data.address,
      gstin: data.gstin,
      pan: data.pan,
      tier: 'BASIC',
      lifecycleStage: 'ONBOARDING',
      totalOrders: 0,
      totalRevenue: 0,
      totalCommission: 0,
      averageRating: 0,
      totalProducts: 0,
      joinedDate: getCurrentDate(),
      preferredChannels: ['EMAIL'],
      marketingOptIn: true,
      emailOptIn: true,
      smsOptIn: false,
      whatsappOptIn: false,
      tags: [],
      createdAt: now,
      updatedAt: now,
    };

    this.merchants.set(profile.id, profile);
    logger.info(`Created merchant profile: ${profile.businessName} (${profile.id})`);
    return profile;
  }

  getProfile(id: string): MerchantProfile | undefined {
    return this.merchants.get(id);
  }

  getAllProfiles(filters?: {
    tier?: MerchantTier; stage?: MerchantLifecycleStage; search?: string;
  }): MerchantProfile[] {
    let list = Array.from(this.merchants.values());
    if (filters?.tier) list = list.filter(m => m.tier === filters.tier);
    if (filters?.stage) list = list.filter(m => m.lifecycleStage === filters.stage);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(m =>
        m.businessName.toLowerCase().includes(s) || m.ownerName.toLowerCase().includes(s) || m.email.toLowerCase().includes(s)
      );
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateProfile(id: string, updates: Partial<MerchantProfile>): MerchantProfile {
    const profile = this.merchants.get(id);
    if (!profile) throw new Error(`Merchant ${id} not found`);
    Object.assign(profile, updates, { updatedAt: new Date().toISOString() });
    this.merchants.set(id, profile);
    return profile;
  }

  updateTier(id: string, tier: MerchantTier): MerchantProfile {
    return this.updateProfile(id, { tier });
  }

  updateLifecycleStage(id: string, stage: MerchantLifecycleStage): MerchantProfile {
    return this.updateProfile(id, { lifecycleStage: stage });
  }

  recordOrderMetrics(id: string, revenue: number, commission: number, rating: number): MerchantProfile {
    const profile = this.merchants.get(id);
    if (!profile) throw new Error(`Merchant ${id} not found`);

    profile.totalOrders++;
    profile.totalRevenue = roundTo(profile.totalRevenue + revenue);
    profile.totalCommission = roundTo(profile.totalCommission + commission);
    profile.averageRating = roundTo(((profile.averageRating * (profile.totalOrders - 1)) + rating) / profile.totalOrders, 2);
    profile.lastActiveDate = new Date().toISOString();
    profile.lifecycleStage = 'ACTIVE';

    // Auto-tier based on revenue
    if (profile.totalRevenue >= 10000000) profile.tier = 'ENTERPRISE';
    else if (profile.totalRevenue >= 5000000) profile.tier = 'PREMIUM';
    else if (profile.totalRevenue >= 1000000) profile.tier = 'STANDARD';

    this.merchants.set(id, profile);
    return profile;
  }

  getMerchantSummary(): {
    totalMerchants: number; activeMerchants: number; onboarding: number;
    atRisk: number; churned: number;
    byTier: Record<MerchantTier, number>;
    byStage: Record<MerchantLifecycleStage, number>;
    totalRevenue: number; totalCommission: number; avgRating: number;
  } {
    const all = Array.from(this.merchants.values());
    return {
      totalMerchants: all.length,
      activeMerchants: all.filter(m => m.lifecycleStage === 'ACTIVE').length,
      onboarding: all.filter(m => m.lifecycleStage === 'ONBOARDING').length,
      atRisk: all.filter(m => m.lifecycleStage === 'AT_RISK').length,
      churned: all.filter(m => m.lifecycleStage === 'CHURNED').length,
      byTier: {
        BASIC: all.filter(m => m.tier === 'BASIC').length,
        STANDARD: all.filter(m => m.tier === 'STANDARD').length,
        PREMIUM: all.filter(m => m.tier === 'PREMIUM').length,
        ENTERPRISE: all.filter(m => m.tier === 'ENTERPRISE').length,
      },
      byStage: {
        ONBOARDING: all.filter(m => m.lifecycleStage === 'ONBOARDING').length,
        ACTIVE: all.filter(m => m.lifecycleStage === 'ACTIVE').length,
        AT_RISK: all.filter(m => m.lifecycleStage === 'AT_RISK').length,
        CHURNED: all.filter(m => m.lifecycleStage === 'CHURNED').length,
        REACTIVATED: all.filter(m => m.lifecycleStage === 'REACTIVATED').length,
      },
      totalRevenue: roundTo(sum(all.map(m => m.totalRevenue))),
      totalCommission: roundTo(sum(all.map(m => m.totalCommission))),
      avgRating: all.length > 0 ? roundTo(avg(all.map(m => m.averageRating)), 2) : 0,
    };
  }

  checkAtRiskMerchants(daysThreshold: number = 30): MerchantProfile[] {
    const today = new Date();
    const atRisk: MerchantProfile[] = [];
    for (const merchant of this.merchants.values()) {
      if (merchant.lifecycleStage === 'ACTIVE' && merchant.lastActiveDate) {
        const daysInactive = daysBetween(merchant.lastActiveDate, today.toISOString().split('T')[0]);
        if (daysInactive >= daysThreshold) {
          merchant.lifecycleStage = 'AT_RISK';
          merchant.updatedAt = new Date().toISOString();
          this.merchants.set(merchant.id, merchant);
          atRisk.push(merchant);
        }
      }
    }
    return atRisk;
  }

  reset(): void {
    this.merchants.clear();
  }
}

export default MerchantCRMEngine.getInstance();
