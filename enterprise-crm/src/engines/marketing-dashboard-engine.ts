/**
 * Kartezy Enterprise CRM — Marketing Dashboard Engine
 *
 * Central marketing dashboard aggregating KPIs across all marketing
 * activities: campaigns, channels, customer growth, revenue attribution,
 * segmentation, and automation performance.
 */

import { createLogger } from '../utils/logger';
import { roundTo, sum, avg, getCurrentDate, getPreviousPeriod } from '../utils/helpers';
import type {
  MarketingDashboardData, ChannelAnalytics, CampaignAnalytics,
  Campaign, CustomerProfile, ChannelType, Segment,
} from '../types';

const logger = createLogger('MarketingDashboardEngine');

export class MarketingDashboardEngine {
  private static instance: MarketingDashboardEngine;

  static getInstance(): MarketingDashboardEngine {
    if (!MarketingDashboardEngine.instance) {
      MarketingDashboardEngine.instance = new MarketingDashboardEngine();
    }
    return MarketingDashboardEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Marketing Dashboard Engine');
  }

  generateDashboard(
    period: string,
    campaigns: Campaign[],
    customers: CustomerProfile[],
    channelAnalytics: ChannelAnalytics[],
    segments: Segment[],
    automationStats: { activeWorkflows: number; totalTriggered: number; totalConverted: number },
  ): MarketingDashboardData {
    const activeCampaigns = campaigns.filter(c =>
      ['DRAFT', 'SCHEDULED', 'SENDING'].includes(c.status)
    );

    const revenueFromCampaigns = sum(campaigns.map(c => c.stats.totalRevenue));
    const totalRevenue = sum(customers.map(c => c.totalSpent));

    const periodStart = period + '-01';
    const newCustomers = customers.filter(c => c.acquisitionDate.startsWith(period));

    // Channel revenue attribution
    const revenueAttribution = channelAnalytics.map(ch => ({
      channel: ch.channel,
      revenue: ch.totalRevenue,
      percentage: revenueFromCampaigns > 0 ? roundTo(ch.totalRevenue / revenueFromCampaigns, 4) : 0,
    }));

    // Customer growth (simulated trend)
    const customerGrowth = this.generateCustomerGrowth(customers, period);

    // Segmentation breakdown
    const segmentation = segments.map(s => ({
      segment: s.name,
      count: s.customerCount,
      percentage: customers.length > 0 ? roundTo(s.customerCount / customers.length, 4) : 0,
    }));

    const topCampaigns = this.getTopCampaigns(campaigns);

    return {
      period,
      overview: {
        totalCampaigns: campaigns.length,
        activeCampaigns: activeCampaigns.length,
        totalCustomers: customers.length,
        newCustomers: newCustomers.length,
        totalRevenue: roundTo(totalRevenue),
        marketingRevenue: roundTo(revenueFromCampaigns),
        averageROI: campaigns.length > 0
          ? roundTo(sum(campaigns.map(c => c.stats.roi)) / campaigns.length, 2) : 0,
      },
      channelPerformance: channelAnalytics,
      topCampaigns,
      customerGrowth,
      revenueAttribution,
      segmentation,
      automationStats,
    };
  }

  private getTopCampaigns(campaigns: Campaign[]): CampaignAnalytics[] {
    return campaigns
      .filter(c => c.stats.totalSent > 0)
      .sort((a, b) => b.stats.totalRevenue - a.stats.totalRevenue)
      .slice(0, 5)
      .map(c => ({
        campaignId: c.id,
        campaignName: c.name,
        channel: c.channel,
        period: c.createdAt.substring(0, 7),
        metrics: c.stats,
        trend: [],
        topSegments: [],
        topProducts: [],
        timeOfDayAnalysis: [],
        deviceAnalysis: [],
      }));
  }

  private generateCustomerGrowth(customers: CustomerProfile[], currentPeriod: string): Array<{ date: string; newCustomers: number; totalCustomers: number }> {
    const growth: Array<{ date: string; newCustomers: number; totalCustomers: number }> = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const newInPeriod = customers.filter(c => c.acquisitionDate.startsWith(period)).length;
      const totalUpTo = customers.filter(c => c.acquisitionDate <= `${period}-31`).length;

      growth.push({
        date: period,
        newCustomers: newInPeriod,
        totalCustomers: totalUpTo,
      });
    }

    return growth;
  }

  getKeyMetrics(period: string, campaigns: Campaign[], customers: CustomerProfile[]): {
    customerAcquisitionCost: number;
    customerLifetimeValue: number;
    ltvToCacRatio: number;
    marketingRevenuePercentage: number;
    campaignROI: number;
    emailEngagementRate: number;
    smsConversionRate: number;
    whatsappConversionRate: number;
  } {
    const totalMarketingSpend = campaigns.length * 1000; // Simplified
    const newCustomers = customers.filter(c => c.acquisitionDate.startsWith(period));
    const cac = newCustomers.length > 0 ? totalMarketingSpend / newCustomers.length : 0;
    const avgLTV = customers.length > 0 ? avg(customers.map(c => c.lifetimeValue)) : 0;
    const totalRevenue = sum(customers.map(c => c.totalSpent));
    const marketingRevenue = sum(campaigns.filter(c => c.stats.totalRevenue > 0).map(c => c.stats.totalRevenue));

    const emailCamps = campaigns.filter(c => c.channel === 'EMAIL' && c.stats.totalSent > 0);
    const smsCamps = campaigns.filter(c => c.channel === 'SMS' && c.stats.totalSent > 0);
    const waCamps = campaigns.filter(c => c.channel === 'WHATSAPP' && c.stats.totalSent > 0);

    return {
      customerAcquisitionCost: roundTo(cac, 2),
      customerLifetimeValue: roundTo(avgLTV, 2),
      ltvToCacRatio: cac > 0 ? roundTo(avgLTV / cac, 2) : 0,
      marketingRevenuePercentage: totalRevenue > 0 ? roundTo(marketingRevenue / totalRevenue, 4) : 0,
      campaignROI: totalMarketingSpend > 0 ? roundTo(marketingRevenue / totalMarketingSpend, 2) : 0,
      emailEngagementRate: emailCamps.length > 0 ? roundTo(avg(emailCamps.map(c => c.stats.openRate)), 4) : 0,
      smsConversionRate: smsCamps.length > 0 ? roundTo(avg(smsCamps.map(c => c.stats.conversionRate)), 4) : 0,
      whatsappConversionRate: waCamps.length > 0 ? roundTo(avg(waCamps.map(c => c.stats.conversionRate)), 4) : 0,
    };
  }

  reset(): void {
    // No state to reset
  }
}

export default MarketingDashboardEngine.getInstance();
