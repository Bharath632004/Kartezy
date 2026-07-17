/**
 * Kartezy Enterprise CRM — Customer CRM Engine
 *
 * Complete customer lifecycle management: profiles, activity timeline,
 * segmentation, tier management, engagement scoring, and customer 360 view.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum, avg, getCurrentDate } from '../utils/helpers';
import type {
  CustomerProfile, CustomerActivity, CustomerTier, CustomerSource,
  CustomerLifecycleStage, ActivityType, ChannelType, CurrencyCode, Address,
} from '../types';

const logger = createLogger('CustomerCRMEngine');

export class CustomerCRMEngine {
  private static instance: CustomerCRMEngine;
  private customers: Map<string, CustomerProfile> = new Map();
  private activities: Map<string, CustomerActivity> = new Map();

  static getInstance(): CustomerCRMEngine {
    if (!CustomerCRMEngine.instance) {
      CustomerCRMEngine.instance = new CustomerCRMEngine();
    }
    return CustomerCRMEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Customer CRM Engine');
  }

  // ── Profile Management ──

  createProfile(data: {
    firstName: string; lastName: string; email: string; phone: string;
    source?: CustomerSource; marketingOptIn?: boolean;
    address?: Address; tags?: string[];
  }): CustomerProfile {
    const now = new Date().toISOString();
    const today = getCurrentDate();

    const profile: CustomerProfile = {
      id: generateId('CUST'),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      source: data.source || 'DIRECT_SIGNUP',
      lifecycleStage: 'LEAD',
      tier: 'BRONZE',
      tags: data.tags || [],
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      lifetimeValue: 0,
      acquisitionDate: today,
      preferredCategories: [],
      preferredChannels: ['EMAIL'],
      marketingOptIn: data.marketingOptIn ?? true,
      smsOptIn: data.marketingOptIn ?? false,
      emailOptIn: data.marketingOptIn ?? true,
      whatsappOptIn: false,
      pushOptIn: data.marketingOptIn ?? false,
      address: data.address,
      createdAt: now,
      updatedAt: now,
    };

    this.customers.set(profile.id, profile);
    logger.info(`Created customer profile: ${profile.firstName} ${profile.lastName} (${profile.id})`);

    // Record signup activity
    this.recordActivity({
      customerId: profile.id,
      activityType: 'APP_OPENED',
      description: 'Customer signed up',
      metadata: { source: profile.source },
    });

    return profile;
  }

  getProfile(id: string): CustomerProfile | undefined {
    return this.customers.get(id);
  }

  getProfileByEmail(email: string): CustomerProfile | undefined {
    return Array.from(this.customers.values()).find(c => c.email === email);
  }

  getProfileByPhone(phone: string): CustomerProfile | undefined {
    return Array.from(this.customers.values()).find(c => c.phone === phone);
  }

  getAllProfiles(filters?: {
    tier?: CustomerTier; lifecycleStage?: CustomerLifecycleStage;
    source?: CustomerSource; tags?: string[]; search?: string;
  }): CustomerProfile[] {
    let list = Array.from(this.customers.values());
    if (filters?.tier) list = list.filter(c => c.tier === filters.tier);
    if (filters?.lifecycleStage) list = list.filter(c => c.lifecycleStage === filters.lifecycleStage);
    if (filters?.source) list = list.filter(c => c.source === filters.source);
    if (filters?.tags?.length) list = list.filter(c => filters.tags!.some(t => c.tags.includes(t)));
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(c =>
        c.firstName.toLowerCase().includes(s) || c.lastName.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) || c.phone.includes(s)
      );
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateProfile(id: string, updates: Partial<CustomerProfile>): CustomerProfile {
    const profile = this.customers.get(id);
    if (!profile) throw new Error(`Customer ${id} not found`);
    Object.assign(profile, updates, { updatedAt: new Date().toISOString() });
    this.customers.set(id, profile);
    return profile;
  }

  updateLifecycleStage(id: string, stage: CustomerLifecycleStage): CustomerProfile {
    const profile = this.updateProfile(id, { lifecycleStage: stage });
    this.recordActivity({
      customerId: id,
      activityType: 'SEGMENT_ASSIGNED',
      description: `Lifecycle stage changed to ${stage}`,
      metadata: { previousStage: profile.lifecycleStage, newStage: stage },
    });
    return profile;
  }

  updateTier(id: string, tier: CustomerTier): CustomerProfile {
    return this.updateProfile(id, { tier });
  }

  // ── Activity Tracking ──

  recordActivity(data: {
    customerId: string; activityType: ActivityType;
    description: string; metadata?: Record<string, unknown>;
  }): CustomerActivity {
    const activity: CustomerActivity = {
      id: generateId('ACT'),
      customerId: data.customerId,
      activityType: data.activityType,
      description: data.description,
      metadata: data.metadata,
      timestamp: new Date().toISOString(),
    };

    this.activities.set(activity.id, activity);

    // Update last interaction date
    const profile = this.customers.get(data.customerId);
    if (profile) {
      profile.lastInteractionDate = activity.timestamp;
      this.customers.set(data.customerId, profile);
    }

    return activity;
  }

  getCustomerActivities(customerId: string, limit?: number): CustomerActivity[] {
    let acts = Array.from(this.activities.values())
      .filter(a => a.customerId === customerId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return limit ? acts.slice(0, limit) : acts;
  }

  getRecentActivities(limit: number = 50): CustomerActivity[] {
    return Array.from(this.activities.values())
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, limit);
  }

  // ── Order Tracking ──

  recordOrder(customerId: string, orderAmount: number): CustomerProfile {
    const profile = this.customers.get(customerId);
    if (!profile) throw new Error(`Customer ${customerId} not found`);

    profile.totalOrders++;
    profile.totalSpent = roundTo(profile.totalSpent + orderAmount);
    profile.averageOrderValue = roundTo(profile.totalSpent / profile.totalOrders);
    profile.lifetimeValue = profile.totalSpent;
    profile.lastPurchaseDate = new Date().toISOString();
    profile.lifecycleStage = 'ACTIVE';
    profile.updatedAt = new Date().toISOString();

    // Tier upgrade based on LTV
    if (profile.lifetimeValue >= 50000) profile.tier = 'DIAMOND';
    else if (profile.lifetimeValue >= 25000) profile.tier = 'PLATINUM';
    else if (profile.lifetimeValue >= 10000) profile.tier = 'GOLD';
    else if (profile.lifetimeValue >= 3000) profile.tier = 'SILVER';

    this.customers.set(customerId, profile);

    this.recordActivity({
      customerId,
      activityType: 'ORDER_PLACED',
      description: `Order placed: ${orderAmount}`,
      metadata: { amount: orderAmount },
    });

    return profile;
  }

  // ── Analytics ──

  getCustomerSummary(): {
    totalCustomers: number; activeCustomers: number; newCustomers: number;
    atRiskCustomers: number; churnedCustomers: number;
    byTier: Record<CustomerTier, number>;
    byStage: Record<CustomerLifecycleStage, number>;
    averageLTV: number; averageOrders: number; totalRevenue: number;
  } {
    const all = Array.from(this.customers.values());
    const today = getCurrentDate();
    const monthStart = today.substring(0, 7);

    return {
      totalCustomers: all.length,
      activeCustomers: all.filter(c => c.lifecycleStage === 'ACTIVE').length,
      newCustomers: all.filter(c => c.acquisitionDate.startsWith(monthStart)).length,
      atRiskCustomers: all.filter(c => c.lifecycleStage === 'AT_RISK').length,
      churnedCustomers: all.filter(c => c.lifecycleStage === 'CHURNED').length,
      byTier: {
        BRONZE: all.filter(c => c.tier === 'BRONZE').length,
        SILVER: all.filter(c => c.tier === 'SILVER').length,
        GOLD: all.filter(c => c.tier === 'GOLD').length,
        PLATINUM: all.filter(c => c.tier === 'PLATINUM').length,
        DIAMOND: all.filter(c => c.tier === 'DIAMOND').length,
      },
      byStage: {
        LEAD: all.filter(c => c.lifecycleStage === 'LEAD').length,
        PROSPECT: all.filter(c => c.lifecycleStage === 'PROSPECT').length,
        ACTIVE: all.filter(c => c.lifecycleStage === 'ACTIVE').length,
        AT_RISK: all.filter(c => c.lifecycleStage === 'AT_RISK').length,
        CHURNED: all.filter(c => c.lifecycleStage === 'CHURNED').length,
        REACTIVATED: all.filter(c => c.lifecycleStage === 'REACTIVATED').length,
      },
      averageLTV: all.length > 0 ? roundTo(avg(all.map(c => c.lifetimeValue))) : 0,
      averageOrders: all.length > 0 ? roundTo(avg(all.map(c => c.totalOrders)), 1) : 0,
      totalRevenue: roundTo(sum(all.map(c => c.totalSpent))),
    };
  }

  getCustomer360(customerId: string): {
    profile: CustomerProfile;
    activities: CustomerActivity[];
    summary: {
      orderCount: number; totalSpent: number; avgOrderValue: number;
      daysSinceLastPurchase: number; daysSinceLastInteraction: number;
      engagementScore: number;
    };
  } | undefined {
    const profile = this.customers.get(customerId);
    if (!profile) return undefined;

    const activities = this.getCustomerActivities(customerId);
    const today = new Date();
    const lastPurchase = profile.lastPurchaseDate ? new Date(profile.lastPurchaseDate) : null;
    const lastInteraction = profile.lastInteractionDate ? new Date(profile.lastInteractionDate) : null;

    return {
      profile,
      activities,
      summary: {
        orderCount: profile.totalOrders,
        totalSpent: profile.totalSpent,
        avgOrderValue: profile.averageOrderValue,
        daysSinceLastPurchase: lastPurchase ? Math.floor((today.getTime() - lastPurchase.getTime()) / 86400000) : -1,
        daysSinceLastInteraction: lastInteraction ? Math.floor((today.getTime() - lastInteraction.getTime()) / 86400000) : -1,
        engagementScore: profile.totalOrders > 0 ? roundTo(Math.min(profile.totalOrders / 10, 1), 2) : 0,
      },
    };
  }

  reset(): void {
    this.customers.clear();
    this.activities.clear();
  }
}

export default CustomerCRMEngine.getInstance();
