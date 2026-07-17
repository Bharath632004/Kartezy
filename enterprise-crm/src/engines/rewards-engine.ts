/**
 * Kartezy Enterprise CRM — Rewards Engine
 *
 * Unified rewards management across loyalty, referral, campaigns,
 * birthday/anniversary, and manual reward distribution.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum, getCurrentDate, addDays } from '../utils/helpers';
import type { Reward, RewardStatus, RewardType, CurrencyCode } from '../types';

const logger = createLogger('RewardsEngine');

export class RewardsEngine {
  private static instance: RewardsEngine;
  private rewards: Map<string, Reward> = new Map();

  static getInstance(): RewardsEngine {
    if (!RewardsEngine.instance) {
      RewardsEngine.instance = new RewardsEngine();
    }
    return RewardsEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Rewards Engine');
  }

  issueReward(data: {
    customerId: string; type: RewardType; name: string; description: string;
    value: number; currency?: CurrencyCode;
    source: 'LOYALTY' | 'REFERRAL' | 'CAMPAIGN' | 'BIRTHDAY' | 'ANNIVERSARY' | 'MANUAL';
    sourceId: string; expiresInDays?: number;
    metadata?: Record<string, unknown>;
  }): Reward {
    const reward: Reward = {
      id: generateId('RWD'),
      customerId: data.customerId,
      type: data.type,
      name: data.name,
      description: data.description,
      value: data.value,
      currency: data.currency || 'INR',
      status: 'AVAILABLE',
      source: data.source,
      sourceId: data.sourceId,
      expiresAt: addDays(getCurrentDate(), data.expiresInDays || 90),
      metadata: data.metadata,
      createdAt: new Date().toISOString(),
    };

    this.rewards.set(reward.id, reward);
    logger.info(`Reward issued to ${data.customerId}: ${data.name} (${data.value})`);
    return reward;
  }

  claimReward(rewardId: string): Reward {
    const reward = this.rewards.get(rewardId);
    if (!reward) throw new Error(`Reward ${rewardId} not found`);
    if (reward.status !== 'AVAILABLE') throw new Error(`Reward is ${reward.status}`);

    reward.status = 'CLAIMED';
    reward.claimedAt = new Date().toISOString();
    this.rewards.set(rewardId, reward);
    return reward;
  }

  useReward(rewardId: string): Reward {
    const reward = this.rewards.get(rewardId);
    if (!reward) throw new Error(`Reward ${rewardId} not found`);
    if (reward.status !== 'CLAIMED') throw new Error(`Reward must be claimed first, status: ${reward.status}`);

    reward.status = 'USED';
    reward.usedAt = new Date().toISOString();
    this.rewards.set(rewardId, reward);
    return reward;
  }

  expireReward(rewardId: string): Reward {
    const reward = this.rewards.get(rewardId);
    if (!reward) throw new Error(`Reward ${rewardId} not found`);
    reward.status = 'EXPIRED';
    this.rewards.set(rewardId, reward);
    return reward;
  }

  cancelReward(rewardId: string): Reward {
    const reward = this.rewards.get(rewardId);
    if (!reward) throw new Error(`Reward ${rewardId} not found`);
    reward.status = 'CANCELLED';
    this.rewards.set(rewardId, reward);
    return reward;
  }

  getCustomerRewards(customerId: string, status?: RewardStatus): Reward[] {
    let list = Array.from(this.rewards.values()).filter(r => r.customerId === customerId);
    if (status) list = list.filter(r => r.status === status);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getAvailableRewards(customerId: string): Reward[] {
    return this.getCustomerRewards(customerId, 'AVAILABLE');
  }

  // ── Automated Rewards ──

  issueBirthdayReward(customerId: string): Reward {
    return this.issueReward({
      customerId,
      type: 'DISCOUNT',
      name: 'Birthday Special',
      description: 'Happy Birthday! Enjoy this special discount on your next order.',
      value: 200,
      source: 'BIRTHDAY',
      sourceId: `birthday-${customerId}`,
      expiresInDays: 30,
      metadata: { occasion: 'birthday' },
    });
  }

  issueAnniversaryReward(customerId: string, years: number): Reward {
    return this.issueReward({
      customerId,
      type: 'DISCOUNT',
      name: `${years} Year Anniversary Reward`,
      description: `Thank you for being with us for ${years} years!`,
      value: 500 * years,
      source: 'ANNIVERSARY',
      sourceId: `anniversary-${customerId}-${years}`,
      expiresInDays: 45,
      metadata: { occasion: 'anniversary', years },
    });
  }

  issueReferralReward(customerId: string, referralId: string, value: number): Reward {
    return this.issueReward({
      customerId,
      type: 'DISCOUNT',
      name: 'Referral Reward',
      description: 'Thanks for referring a friend! Enjoy this reward.',
      value,
      source: 'REFERRAL',
      sourceId: referralId,
      expiresInDays: 60,
    });
  }

  // ── Analytics ──

  getRewardsSummary(): {
    totalIssued: number; totalClaimed: number; totalUsed: number;
    totalExpired: number; totalValue: number;
    byType: Record<RewardType, { count: number; value: number }>;
    bySource: Record<string, { count: number; value: number }>;
  } {
    const all = Array.from(this.rewards.values());
    const byType: Record<string, { count: number; value: number }> = {};
    const bySource: Record<string, { count: number; value: number }> = {};

    for (const r of all) {
      if (!byType[r.type]) byType[r.type] = { count: 0, value: 0 };
      byType[r.type].count++;
      byType[r.type].value += r.value;

      if (!bySource[r.source]) bySource[r.source] = { count: 0, value: 0 };
      bySource[r.source].count++;
      bySource[r.source].value += r.value;
    }

    return {
      totalIssued: all.length,
      totalClaimed: all.filter(r => r.status === 'CLAIMED').length,
      totalUsed: all.filter(r => r.status === 'USED').length,
      totalExpired: all.filter(r => r.status === 'EXPIRED').length,
      totalValue: roundTo(sum(all.map(r => r.value))),
      byType: byType as Record<RewardType, { count: number; value: number }>,
      bySource: bySource as Record<string, { count: number; value: number }>,
    };
  }

  checkExpiredRewards(): Reward[] {
    const today = getCurrentDate();
    const expired: Reward[] = [];
    for (const reward of this.rewards.values()) {
      if (reward.status === 'AVAILABLE' && reward.expiresAt < today) {
        reward.status = 'EXPIRED';
        this.rewards.set(reward.id, reward);
        expired.push(reward);
      }
    }
    return expired;
  }

  reset(): void {
    this.rewards.clear();
  }
}

export default RewardsEngine.getInstance();
