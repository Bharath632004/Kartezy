/**
 * Kartezy Enterprise BI Platform - Funnel Analysis
 *
 * Conversion funnel analysis for tracking user journeys from
 * app open through to order delivery with drop-off analytics.
 */

import { createBILogger } from '../utils/logger';

const logger = createBILogger('FunnelAnalysis');

export interface FunnelStage {
  name: string;
  users: number;
  percentage: number;
  dropOff: number;
  dropOffRate: number;
  description: string;
}

export interface FunnelComparison {
  stage: string;
  currentPeriod: number;
  previousPeriod: number;
  change: number;
  benchmark: number;
}

export interface FunnelInsight {
  stage: string;
  issue: string;
  impact: string;
  recommendation: string;
  potentialGain: number;
}

export class FunnelAnalysis {
  static getInstance(): FunnelAnalysis {
    return new FunnelAnalysis();
  }

  /** Main ordering funnel from app open to delivery */
  async getOrderFunnel(): Promise<FunnelStage[]> {
    let users = 100000;
    const stages = [
      { name: 'App Open', description: 'User opens the application', dropOffFactor: 0.05 },
      { name: 'Browse Products', description: 'User browses product catalog', dropOffFactor: 0.15 },
      { name: 'Product View', description: 'User views individual product details', dropOffFactor: 0.10 },
      { name: 'Add to Cart', description: 'User adds item to shopping cart', dropOffFactor: 0.25 },
      { name: 'Cart View', description: 'User views their cart', dropOffFactor: 0.10 },
      { name: 'Checkout Start', description: 'User initiates checkout process', dropOffFactor: 0.15 },
      { name: 'Address Selection', description: 'User selects delivery address', dropOffFactor: 0.08 },
      { name: 'Payment Initiation', description: 'User selects payment method', dropOffFactor: 0.12 },
      { name: 'Payment Success', description: 'Payment processed successfully', dropOffFactor: 0.15 },
      { name: 'Order Confirmed', description: 'Order is confirmed', dropOffFactor: 0.02 },
      { name: 'Order Delivered', description: 'Order delivered to customer', dropOffFactor: 0.03 },
    ];

    const funnel: FunnelStage[] = [];
    let previousUsers = users;

    for (const stage of stages) {
      const stageUsers = Math.floor(previousUsers * (1 - stage.dropOffFactor));
      const dropOff = previousUsers - stageUsers;
      funnel.push({
        name: stage.name,
        users: stageUsers,
        percentage: Math.round((stageUsers / users) * 10000) / 100,
        dropOff,
        dropOffRate: Math.round((dropOff / previousUsers) * 10000) / 100,
        description: stage.description,
      });
      previousUsers = stageUsers;
    }

    return funnel;
  }

  /** Get funnel comparison between periods */
  async getFunnelComparison(): Promise<FunnelComparison[]> {
    const stages = ['App Open', 'Browse Products', 'Product View', 'Add to Cart', 'Checkout', 'Payment', 'Order Confirmed', 'Delivered'];
    return stages.map(stage => {
      const current = 10000 + Math.floor(Math.random() * 50000);
      const previous = Math.floor(current * (0.8 + Math.random() * 0.4));
      return {
        stage,
        currentPeriod: current,
        previousPeriod: previous,
        change: Math.round(((current - previous) / previous) * 10000) / 100,
        benchmark: 50000 + Math.floor(Math.random() * 30000),
      };
    });
  }

  /** Get funnel insights and recommendations */
  async getInsights(): Promise<FunnelInsight[]> {
    return [
      { stage: 'Add to Cart', issue: 'High drop-off on product pages without clear pricing', impact: '25% of browsing users leave without adding', recommendation: 'Show in-cart total earlier, add urgency indicators', potentialGain: 15000000 },
      { stage: 'Checkout Start', issue: 'Guest users abandon at login requirement', impact: '20% drop when forced registration', recommendation: 'Enable guest checkout with SMS OTP', potentialGain: 8000000 },
      { stage: 'Payment', issue: 'Payment failures due to insufficient UPI limits', impact: '15% payment failure rate', recommendation: 'Show UPI limits, offer COD as fallback', potentialGain: 12000000 },
      { stage: 'Cart View', issue: 'Unexpected delivery fee causes cart abandonment', impact: '18% drop at cart view', recommendation: 'Show delivery fee earlier, offer free delivery threshold', potentialGain: 6000000 },
      { stage: 'Address Selection', issue: 'No saved addresses for new users', impact: '12% drop during address entry', recommendation: 'Auto-detect location, allow pincode-only checkout', potentialGain: 5000000 },
    ];
  }

  /** Marketing funnel - from impression to conversion */
  async getMarketingFunnel(): Promise<FunnelStage[]> {
    let users = 500000;
    const stages = [
      { name: 'Impressions', description: 'Ad or campaign impression', dropOffFactor: 0.0 },
      { name: 'Reach', description: 'Unique users reached', dropOffFactor: 0.60 },
      { name: 'Engagement', description: 'Users who engaged with content', dropOffFactor: 0.70 },
      { name: 'Click-through', description: 'Users who clicked through', dropOffFactor: 0.50 },
      { name: 'Landing Page', description: 'Users who landed on page', dropOffFactor: 0.10 },
      { name: 'Sign-up', description: 'Users who completed sign-up', dropOffFactor: 0.40 },
      { name: 'First Purchase', description: 'Users who made first purchase', dropOffFactor: 0.30 },
    ];

    return stages.map(stage => {
      const stageUsers = Math.floor(users * (1 - stage.dropOffFactor));
      const dropOff = users - stageUsers;
      const result = {
        name: stage.name,
        users: stageUsers,
        percentage: Math.round((stageUsers / 500000) * 10000) / 100,
        dropOff,
        dropOffRate: Math.round((dropOff / users) * 10000) / 100,
        description: stage.description,
      };
      users = stageUsers;
      return result;
    });
  }
}

export default FunnelAnalysis.getInstance();
