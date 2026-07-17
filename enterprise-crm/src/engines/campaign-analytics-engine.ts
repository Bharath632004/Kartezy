/**
 * Kartezy Enterprise CRM — Campaign Analytics Engine
 *
 * Cross-channel campaign performance analysis, attribution,
 * ROI calculation, and actionable insights.
 */

import { createLogger } from '../utils/logger';
import { roundTo, sum, avg, getPreviousPeriod } from '../utils/helpers';
import type {
  Campaign, CampaignAnalytics, ChannelAnalytics, ChannelType,
  CampaignStats, CampaignType,
} from '../types';

const logger = createLogger('CampaignAnalyticsEngine');

export class CampaignAnalyticsEngine {
  private static instance: CampaignAnalyticsEngine;

  static getInstance(): CampaignAnalyticsEngine {
    if (!CampaignAnalyticsEngine.instance) {
      CampaignAnalyticsEngine.instance = new CampaignAnalyticsEngine();
    }
    return CampaignAnalyticsEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Campaign Analytics Engine');
  }

  analyzeCampaign(campaign: Campaign): CampaignAnalytics {
    const s = campaign.stats;
    return {
      campaignId: campaign.id,
      campaignName: campaign.name,
      channel: campaign.channel,
      period: campaign.createdAt.substring(0, 7),
      metrics: s,
      trend: [],
      topSegments: [],
      topProducts: [],
      timeOfDayAnalysis: [],
      deviceAnalysis: [],
    };
  }

  analyzeChannel(campaigns: Campaign[], channel: ChannelType, period: string): ChannelAnalytics {
    const channelCamps = campaigns.filter(c => c.channel === channel);
    const sent = channelCamps.filter(c => c.stats.totalSent > 0);

    return {
      channel,
      period,
      totalCampaigns: channelCamps.length,
      totalSent: sum(sent.map(c => c.stats.totalSent)),
      totalDelivered: sum(sent.map(c => c.stats.totalDelivered)),
      totalOpened: sum(sent.map(c => c.stats.totalOpened)),
      totalClicked: sum(sent.map(c => c.stats.totalClicked)),
      totalConverted: sum(sent.map(c => c.stats.totalConverted)),
      averageOpenRate: sent.length > 0 ? roundTo(avg(sent.map(c => c.stats.openRate)), 4) : 0,
      averageClickRate: sent.length > 0 ? roundTo(avg(sent.map(c => c.stats.clickRate)), 4) : 0,
      averageConversionRate: sent.length > 0 ? roundTo(avg(sent.map(c => c.stats.conversionRate)), 4) : 0,
      totalRevenue: roundTo(sum(sent.map(c => c.stats.totalRevenue))),
      costPerCampaign: roundTo(avg(sent.map(c => c.stats.totalSent * 0.5))), // Simplified cost calc
      roi: sent.length > 0 ? roundTo(sum(sent.map(c => c.stats.totalRevenue)) / (sent.length * 1000), 2) : 0,
    };
  }

  analyzeAllChannels(campaigns: Campaign[], period: string): ChannelAnalytics[] {
    const channels: ChannelType[] = ['EMAIL', 'SMS', 'WHATSAPP', 'PUSH_NOTIFICATION', 'IN_APP'];
    return channels.map(ch => this.analyzeChannel(campaigns, ch, period));
  }

  getConversionFunnel(campaigns: Campaign[]): Array<{ stage: string; count: number; percentage: number }> {
    const sent = sum(campaigns.map(c => c.stats.totalSent));
    const delivered = sum(campaigns.map(c => c.stats.totalDelivered));
    const opened = sum(campaigns.map(c => c.stats.totalOpened));
    const clicked = sum(campaigns.map(c => c.stats.totalClicked));
    const converted = sum(campaigns.map(c => c.stats.totalConverted));

    return [
      { stage: 'Sent', count: sent, percentage: 100 },
      { stage: 'Delivered', count: delivered, percentage: sent > 0 ? roundTo(delivered / sent * 100, 1) : 0 },
      { stage: 'Opened', count: opened, percentage: delivered > 0 ? roundTo(opened / delivered * 100, 1) : 0 },
      { stage: 'Clicked', count: clicked, percentage: opened > 0 ? roundTo(clicked / opened * 100, 1) : 0 },
      { stage: 'Converted', count: converted, percentage: clicked > 0 ? roundTo(converted / clicked * 100, 1) : 0 },
    ];
  }

  getChannelEffectiveness(campaigns: Campaign[]): Array<{
    channel: ChannelType; campaigns: number; sent: number;
    openRate: number; clickRate: number; conversionRate: number;
    revenue: number; roi: number; score: number;
  }> {
    const channels: ChannelType[] = ['EMAIL', 'SMS', 'WHATSAPP', 'PUSH_NOTIFICATION', 'IN_APP'];
    return channels.map(ch => {
      const chCamps = campaigns.filter(c => c.channel === ch && c.stats.totalSent > 0);
      const rev = sum(chCamps.map(c => c.stats.totalRevenue));
      const openRate = chCamps.length > 0 ? avg(chCamps.map(c => c.stats.openRate)) : 0;
      const clickRate = chCamps.length > 0 ? avg(chCamps.map(c => c.stats.clickRate)) : 0;
      const convRate = chCamps.length > 0 ? avg(chCamps.map(c => c.stats.conversionRate)) : 0;
      const roiVal = chCamps.length > 0 ? rev / (chCamps.length * 1000) : 0;

      return {
        channel: ch,
        campaigns: chCamps.length,
        sent: sum(chCamps.map(c => c.stats.totalSent)),
        openRate,
        clickRate,
        conversionRate: convRate,
        revenue: rev,
        roi: roundTo(roiVal, 2),
        score: roundTo((openRate * 0.3 + clickRate * 0.3 + convRate * 0.4) * 100, 1),
      };
    }).filter(ch => ch.campaigns > 0).sort((a, b) => b.score - a.score);
  }

  getCampaignTypeBreakdown(campaigns: Campaign[]): Array<{
    type: CampaignType; count: number; sent: number; revenue: number;
    avgOpenRate: number; avgConversionRate: number;
  }> {
    const types: CampaignType[] = ['PROMOTIONAL', 'TRANSACTIONAL', 'ONBOARDING', 'REACTIVATION', 'WINBACK', 'LOYALTY', 'SEASONAL', 'AUTOMATED'];
    return types.map(type => {
      const typed = campaigns.filter(c => c.type === type);
      const sent = typed.filter(c => c.stats.totalSent > 0);
      return {
        type,
        count: typed.length,
        sent: sum(sent.map(c => c.stats.totalSent)),
        revenue: roundTo(sum(sent.map(c => c.stats.totalRevenue))),
        avgOpenRate: sent.length > 0 ? roundTo(avg(sent.map(c => c.stats.openRate)), 4) : 0,
        avgConversionRate: sent.length > 0 ? roundTo(avg(sent.map(c => c.stats.conversionRate)), 4) : 0,
      };
    }).filter(t => t.count > 0);
  }

  reset(): void {
    // No state to reset
  }
}

export default CampaignAnalyticsEngine.getInstance();
