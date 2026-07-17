/**
 * Kartezy Enterprise CRM — Loyalty Engine
 *
 * Complete loyalty program: points management, tier progression,
 * rewards catalog, transaction tracking, expiry management.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum, getCurrentDate, addDays } from '../utils/helpers';
import type {
  LoyaltyProgram, LoyaltyTierConfig, LoyaltyPoints, LoyaltyTransaction,
  LoyaltyReward, LoyaltyTier, LoyaltyTransactionType, LoyaltyRewardType,
} from '../types';

const logger = createLogger('LoyaltyEngine');

export class LoyaltyEngine {
  private static instance: LoyaltyEngine;
  private programs: Map<string, LoyaltyProgram> = new Map();
  private pointsAccounts: Map<string, LoyaltyPoints> = new Map();
  private transactions: Map<string, LoyaltyTransaction> = new Map();
  private rewards: Map<string, LoyaltyReward> = new Map();

  static getInstance(): LoyaltyEngine {
    if (!LoyaltyEngine.instance) {
      LoyaltyEngine.instance = new LoyaltyEngine();
    }
    return LoyaltyEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Loyalty Engine');
    this.seedDefaultProgram();
  }

  private seedDefaultProgram(): void {
    const program: LoyaltyProgram = {
      id: generateId('LP'),
      name: 'Kartezy Rewards',
      description: 'Earn points on every order and unlock exclusive benefits',
      pointsPerCurrency: 1,
      currencyPerPoint: 0.5,
      tiers: [
        { tier: 'BRONZE', minPoints: 0, maxPoints: 999, multiplier: 1, benefits: ['Welcome offer', 'Birthday reward'], renewalPeriodDays: 365 },
        { tier: 'SILVER', minPoints: 1000, maxPoints: 4999, multiplier: 1.25, benefits: ['Extra 25% points', 'Free delivery', 'Priority support'], renewalPeriodDays: 365 },
        { tier: 'GOLD', minPoints: 5000, maxPoints: 19999, multiplier: 1.5, benefits: ['Extra 50% points', 'Free delivery', 'Priority support', 'Exclusive offers'], renewalPeriodDays: 365 },
        { tier: 'PLATINUM', minPoints: 20000, maxPoints: 49999, multiplier: 2, benefits: ['Double points', 'Free delivery', 'VIP support', 'Early access', 'Birthday gift'], renewalPeriodDays: 365 },
        { tier: 'DIAMOND', minPoints: 50000, maxPoints: Infinity, multiplier: 3, benefits: ['Triple points', 'Free delivery', 'Concierge service', 'Early access', 'Annual gift', 'Invite-only events'], renewalPeriodDays: 365 },
      ],
      rewards: [],
      isActive: true,
      startDate: getCurrentDate(),
      createdAt: new Date().toISOString(),
    };
    this.programs.set(program.id, program);
  }

  getActiveProgram(): LoyaltyProgram | undefined {
    return Array.from(this.programs.values()).find(p => p.isActive);
  }

  // ── Points Management ──

  getOrCreatePointsAccount(customerId: string): LoyaltyPoints {
    const existing = Array.from(this.pointsAccounts.values()).find(p => p.customerId === customerId);
    if (existing) return existing;

    const now = new Date().toISOString();
    const account: LoyaltyPoints = {
      id: generateId('LPA'),
      customerId,
      tier: 'BRONZE',
      totalPoints: 0, earnedPoints: 0, redeemedPoints: 0,
      expiredPoints: 0, pendingPoints: 0, availablePoints: 0,
      lifetimePoints: 0,
      nextTierPoints: 1000,
      lastUpdated: now,
      createdAt: now,
    };
    this.pointsAccounts.set(account.id, account);
    return account;
  }

  getPointsAccount(customerId: string): LoyaltyPoints | undefined {
    return this.pointsAccounts.get(customerId);
  }

  earnPoints(customerId: string, amount: number, referenceType: string, referenceId: string, description: string): LoyaltyTransaction {
    const program = this.getActiveProgram();
    if (!program) throw new Error('No active loyalty program');

    const account = this.getOrCreatePointsAccount(customerId);
    const tierConfig = program.tiers.find(t => t.tier === account.tier);
    const multiplier = tierConfig?.multiplier || 1;
    const pointsEarned = Math.round(amount * program.pointsPerCurrency * multiplier);

    const now = new Date().toISOString();
    const availableNow = account.availablePoints;
    const balanceAfter = account.availablePoints + pointsEarned;

    const transaction: LoyaltyTransaction = {
      id: generateId('LPT'),
      customerId,
      transactionType: 'EARNED',
      points: pointsEarned,
      balanceBefore: availableNow,
      balanceAfter,
      referenceType,
      referenceId,
      description,
      expiresAt: addDays(getCurrentDate(), 365),
      createdAt: now,
    };

    this.transactions.set(transaction.id, transaction);

    // Update account
    account.earnedPoints += pointsEarned;
    account.totalPoints += pointsEarned;
    account.availablePoints = balanceAfter;
    account.lifetimePoints += pointsEarned;
    account.pendingPoints = 0;
    account.lastUpdated = now;

    // Check tier upgrade
    this.checkTierUpgrade(account, program);

    this.pointsAccounts.set(account.id, account);
    logger.info(`Customer ${customerId} earned ${pointsEarned} points (${description})`);
    return transaction;
  }

  redeemPoints(customerId: string, points: number, referenceType: string, referenceId: string, description: string): LoyaltyTransaction {
    const account = this.getOrCreatePointsAccount(customerId);
    if (account.availablePoints < points) {
      throw new Error(`Insufficient points: have ${account.availablePoints}, need ${points}`);
    }

    const now = new Date().toISOString();
    const balanceAfter = account.availablePoints - points;

    const transaction: LoyaltyTransaction = {
      id: generateId('LPT'),
      customerId,
      transactionType: 'REDEEMED',
      points: -points,
      balanceBefore: account.availablePoints,
      balanceAfter,
      referenceType,
      referenceId,
      description,
      createdAt: now,
    };

    this.transactions.set(transaction.id, transaction);

    account.redeemedPoints += points;
    account.availablePoints = balanceAfter;
    account.lastUpdated = now;
    this.pointsAccounts.set(account.id, account);

    logger.info(`Customer ${customerId} redeemed ${points} points`);
    return transaction;
  }

  awardBonusPoints(customerId: string, points: number, reason: string): LoyaltyTransaction {
    return this.earnPoints(customerId, points / (this.getActiveProgram()?.pointsPerCurrency || 1), 'BONUS', customerId, reason);
  }

  // ── Tier Management ──

  private checkTierUpgrade(account: LoyaltyPoints, program: LoyaltyProgram): void {
    const sortedTiers = [...program.tiers].sort((a, b) => b.minPoints - a.minPoints);
    for (const tier of sortedTiers) {
      if (account.lifetimePoints >= tier.minPoints && account.lifetimePoints <= tier.maxPoints) {
        if (account.tier !== tier.tier) {
          const oldTier = account.tier;
          account.tier = tier.tier;
          logger.info(`Customer ${account.customerId} upgraded from ${oldTier} to ${tier.tier}`);
        }
        const nextTier = sortedTiers[sortedTiers.indexOf(tier) - 1];
        account.nextTierPoints = nextTier ? nextTier.minPoints - account.lifetimePoints : 0;
        break;
      }
    }
  }

  getCustomerTier(customerId: string): LoyaltyTier {
    const account = this.getPointsAccount(customerId);
    return account?.tier || 'BRONZE';
  }

  // ── Rewards Catalog ──

  addReward(reward: Omit<LoyaltyReward, 'id'>): LoyaltyReward {
    const newReward: LoyaltyReward = { ...reward, id: generateId('LR') };
    this.rewards.set(newReward.id, newReward);

    const program = this.getActiveProgram();
    if (program) {
      program.rewards.push(newReward);
      this.programs.set(program.id, program);
    }
    return newReward;
  }

  getAvailableRewards(): LoyaltyReward[] {
    return Array.from(this.rewards.values()).filter(r => r.isActive);
  }

  claimReward(customerId: string, rewardId: string): { transaction: LoyaltyTransaction; reward: LoyaltyReward } {
    const reward = this.rewards.get(rewardId);
    if (!reward) throw new Error(`Reward ${rewardId} not found`);
    if (!reward.isActive) throw new Error('Reward is no longer available');
    if (reward.stock !== undefined && reward.stock <= 0) throw new Error('Reward out of stock');

    const transaction = this.redeemPoints(customerId, reward.pointsRequired, 'REWARD', rewardId, `Redeemed: ${reward.name}`);

    if (reward.stock !== undefined) {
      reward.stock--;
      this.rewards.set(rewardId, reward);
    }

    if (reward.stock !== undefined) {
      const program = this.getActiveProgram();
      if (program) {
        const idx = program.rewards.findIndex(r => r.id === rewardId);
        if (idx >= 0) program.rewards[idx] = reward;
      }
    }

    return { transaction, reward };
  }

  // ── Transactions ──

  getTransactions(customerId: string, limit?: number): LoyaltyTransaction[] {
    let txns = Array.from(this.transactions.values())
      .filter(t => t.customerId === customerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return limit ? txns.slice(0, limit) : txns;
  }

  // ── Analytics ──

  getLoyaltyAnalytics(): {
    totalMembers: number; activeMembers: number;
    totalPointsEarned: number; totalPointsRedeemed: number;
    redemptionRate: number;
    byTier: Record<LoyaltyTier, { members: number; points: number }>;
  } {
    const accounts = Array.from(this.pointsAccounts.values());
    const byTier: Record<string, { members: number; points: number }> = {
      BRONZE: { members: 0, points: 0 }, SILVER: { members: 0, points: 0 },
      GOLD: { members: 0, points: 0 }, PLATINUM: { members: 0, points: 0 }, DIAMOND: { members: 0, points: 0 },
    };

    let totalPointsEarned = 0;
    let totalPointsRedeemed = 0;

    for (const a of accounts) {
      byTier[a.tier].members++;
      byTier[a.tier].points += a.availablePoints;
      totalPointsEarned += a.earnedPoints;
      totalPointsRedeemed += a.redeemedPoints;
    }

    return {
      totalMembers: accounts.length,
      activeMembers: accounts.filter(a => a.earnedPoints > 0).length,
      totalPointsEarned,
      totalPointsRedeemed,
      redemptionRate: totalPointsEarned > 0 ? roundTo(totalPointsRedeemed / totalPointsEarned, 4) : 0,
      byTier: byTier as Record<LoyaltyTier, { members: number; points: number }>,
    };
  }

  reset(): void {
    this.programs.clear();
    this.pointsAccounts.clear();
    this.transactions.clear();
    this.rewards.clear();
  }
}

export default LoyaltyEngine.getInstance();
