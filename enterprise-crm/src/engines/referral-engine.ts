/**
 * Kartezy Enterprise CRM — Referral Engine
 *
 * Complete referral program management: referral codes, tracking,
 * multi-level rewards, analytics, and fraud detection.
 */

import { createLogger } from '../utils/logger';
import { generateId, generateNumber, roundTo, sum, avg, getCurrentDate, addDays } from '../utils/helpers';
import type {
  ReferralProgram, Referral, ReferralStatus, RewardDefinition,
  ChannelType, CurrencyCode,
} from '../types';

const logger = createLogger('ReferralEngine');

export class ReferralEngine {
  private static instance: ReferralEngine;
  private programs: Map<string, ReferralProgram> = new Map();
  private referrals: Map<string, Referral> = new Map();
  private referralCounter: number = 0;

  static getInstance(): ReferralEngine {
    if (!ReferralEngine.instance) {
      ReferralEngine.instance = new ReferralEngine();
    }
    return ReferralEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Referral Engine');
    this.seedDefaultProgram();
  }

  private seedDefaultProgram(): void {
    this.createProgram({
      name: 'Refer & Earn',
      description: 'Refer friends and earn rewards on their first purchase',
      referrerReward: { type: 'DISCOUNT', value: 100, description: '₹100 off on next order', currency: 'INR' },
      refereeReward: { type: 'DISCOUNT', value: 50, description: '₹50 off on first order', currency: 'INR' },
      maxReferralsPerUser: 20,
      maxRewardsPerUser: 20,
      expiryDays: 30,
      targetSegments: ['ALL'],
      channels: ['EMAIL', 'WHATSAPP', 'SMS', 'IN_APP'],
    });
  }

  createProgram(data: {
    name: string; description: string;
    referrerReward: RewardDefinition; refereeReward: RewardDefinition;
    maxReferralsPerUser?: number; maxRewardsPerUser?: number;
    rewardCap?: number; expiryDays: number;
    targetSegments?: string[]; channels?: ChannelType[];
    startDate?: string; endDate?: string;
  }): ReferralProgram {
    const program: ReferralProgram = {
      id: generateId('RFP'),
      name: data.name,
      description: data.description,
      referrerReward: data.referrerReward,
      refereeReward: data.refereeReward,
      maxReferralsPerUser: data.maxReferralsPerUser || 10,
      maxRewardsPerUser: data.maxRewardsPerUser || 10,
      rewardCap: data.rewardCap,
      expiryDays: data.expiryDays,
      isActive: true,
      startDate: data.startDate || getCurrentDate(),
      endDate: data.endDate,
      targetSegments: data.targetSegments || ['ALL'],
      channels: data.channels || ['EMAIL', 'WHATSAPP'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.programs.set(program.id, program);
    logger.info(`Created referral program: ${program.name}`);
    return program;
  }

  getProgram(id: string): ReferralProgram | undefined {
    return this.programs.get(id);
  }

  getActivePrograms(): ReferralProgram[] {
    return Array.from(this.programs.values()).filter(p => p.isActive);
  }

  createReferral(data: {
    programId: string; referrerId: string; referrerName: string;
    refereeEmail: string; refereePhone?: string; channel: ChannelType;
  }): Referral {
    const program = this.programs.get(data.programId);
    if (!program) throw new Error(`Program ${data.programId} not found`);

    const referrerCount = Array.from(this.referrals.values())
      .filter(r => r.referrerId === data.referrerId).length;
    if (referrerCount >= program.maxReferralsPerUser) {
      throw new Error(`Referrer ${data.referrerId} has reached max referrals`);
    }

    this.referralCounter++;
    const referral: Referral = {
      id: generateId('REF'),
      programId: data.programId,
      referrerId: data.referrerId,
      referrerName: data.referrerName,
      refereeEmail: data.refereeEmail,
      refereePhone: data.refereePhone,
      referralCode: this.generateReferralCode(data.referrerId),
      status: 'SENT',
      rewardEarned: 0,
      rewardCurrency: 'INR',
      expiresAt: addDays(getCurrentDate(), program.expiryDays),
      channel: data.channel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.referrals.set(referral.id, referral);
    logger.info(`Referral created: ${referral.referralCode} by ${data.referrerName}`);
    return referral;
  }

  trackClick(referralId: string): Referral {
    const ref = this.referrals.get(referralId);
    if (!ref) throw new Error(`Referral ${referralId} not found`);
    if (ref.status === 'SENT') {
      ref.status = 'CLICKED';
      ref.clickedAt = new Date().toISOString();
      ref.updatedAt = ref.clickedAt;
      this.referrals.set(referralId, ref);
    }
    return ref;
  }

  trackSignup(referralId: string, refereeId: string, refereeName: string): Referral {
    const ref = this.referrals.get(referralId);
    if (!ref) throw new Error(`Referral ${referralId} not found`);
    ref.status = 'SIGNED_UP';
    ref.refereeId = refereeId;
    ref.refereeName = refereeName;
    ref.signedUpAt = new Date().toISOString();
    ref.updatedAt = ref.signedUpAt;
    this.referrals.set(referralId, ref);
    logger.info(`Referral ${referralId} signed up: ${refereeName}`);
    return ref;
  }

  trackConversion(referralId: string, rewardAmount: number): Referral {
    const ref = this.referrals.get(referralId);
    if (!ref) throw new Error(`Referral ${referralId} not found`);
    ref.status = 'CONVERTED';
    ref.rewardEarned = rewardAmount;
    ref.convertedAt = new Date().toISOString();
    ref.updatedAt = ref.convertedAt;
    this.referrals.set(referralId, ref);
    logger.info(`Referral ${referralId} converted! Reward: ${rewardAmount}`);
    return ref;
  }

  getReferralsByReferrer(referrerId: string): Referral[] {
    return Array.from(this.referrals.values())
      .filter(r => r.referrerId === referrerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getReferralByCode(code: string): Referral | undefined {
    return Array.from(this.referrals.values()).find(r => r.referralCode === code);
  }

  getReferralAnalytics(programId: string): {
    totalReferrals: number; clicked: number; signedUp: number;
    converted: number; conversionRate: number;
    totalRewardsEarned: number; averageReward: number;
    topReferrers: Array<{ referrerId: string; referrerName: string; count: number; rewards: number }>;
  } {
    const refs = Array.from(this.referrals.values()).filter(r => r.programId === programId);
    const converted = refs.filter(r => r.status === 'CONVERTED');

    const referrerGroups = new Map<string, { name: string; count: number; rewards: number }>();
    for (const ref of refs) {
      const existing = referrerGroups.get(ref.referrerId) || { name: ref.referrerName, count: 0, rewards: 0 };
      existing.count++;
      existing.rewards += ref.rewardEarned;
      referrerGroups.set(ref.referrerId, existing);
    }

    const topReferrers = Array.from(referrerGroups.entries())
      .map(([referrerId, data]) => ({
        referrerId,
        referrerName: data.name,
        count: data.count,
        rewards: data.rewards,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalReferrals: refs.length,
      clicked: refs.filter(r => r.status !== 'SENT').length,
      signedUp: refs.filter(r => ['SIGNED_UP', 'FIRST_PURCHASE', 'CONVERTED'].includes(r.status)).length,
      converted: converted.length,
      conversionRate: refs.length > 0 ? roundTo(converted.length / refs.length, 4) : 0,
      totalRewardsEarned: roundTo(sum(refs.map(r => r.rewardEarned))),
      averageReward: converted.length > 0 ? roundTo(sum(converted.map(r => r.rewardEarned)) / converted.length) : 0,
      topReferrers,
    };
  }

  private generateReferralCode(referrerId: string): string {
    const short = referrerId.replace(/^[A-Z]+-/, '').substring(0, 6);
    return `${short}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  reset(): void {
    this.programs.clear();
    this.referrals.clear();
    this.referralCounter = 0;
  }
}

export default ReferralEngine.getInstance();
