/**
 * Kartezy Enterprise CRM — Campaign Engine
 *
 * Multi-channel campaign management: Email, SMS, WhatsApp, Push notifications.
 * Full campaign lifecycle with templates, scheduling, A/B testing, and analytics.
 */

import { createLogger } from '../utils/logger';
import { generateId, generateNumber, roundTo, sum, avg, getCurrentDate } from '../utils/helpers';
import type {
  Campaign, CampaignContent, CampaignSchedule, CampaignTracking,
  CampaignStats, CampaignType, ChannelType, CampaignStatus, CampaignPriority,
} from '../types';

const logger = createLogger('CampaignEngine');

export class CampaignEngine {
  private static instance: CampaignEngine;
  private campaigns: Map<string, Campaign> = new Map();
  private campaignCounter: number = 0;

  static getInstance(): CampaignEngine {
    if (!CampaignEngine.instance) {
      CampaignEngine.instance = new CampaignEngine();
    }
    return CampaignEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Campaign Engine');
  }

  createCampaign(data: {
    name: string; description?: string; type: CampaignType; channel: ChannelType;
    content: CampaignContent; segments?: string[]; excludeSegments?: string[];
    targetCustomerIds?: string[]; priority?: CampaignPriority;
    schedule?: CampaignSchedule; tracking?: Partial<CampaignTracking>;
    createdBy: string;
  }): Campaign {
    this.campaignCounter++;
    const now = new Date().toISOString();

    const defaultTracking: CampaignTracking = {
      linkTracking: true,
      openTracking: true,
    };

    const campaign: Campaign = {
      id: generateId('CAMP'),
      name: data.name,
      description: data.description,
      type: data.type,
      channel: data.channel,
      status: 'DRAFT',
      priority: data.priority || 'MEDIUM',
      content: data.content,
      segments: data.segments || ['ALL'],
      excludeSegments: data.excludeSegments || [],
      targetCustomerIds: data.targetCustomerIds,
      schedule: data.schedule,
      tracking: { ...defaultTracking, ...data.tracking },
      stats: this.emptyStats(),
      createdBy: data.createdBy,
      createdAt: now,
      updatedAt: now,
    };

    this.campaigns.set(campaign.id, campaign);
    logger.info(`Created ${data.channel} campaign: ${campaign.name} (${campaign.id})`);
    return campaign;
  }

  getCampaign(id: string): Campaign | undefined {
    return this.campaigns.get(id);
  }

  getAllCampaigns(filters?: {
    status?: CampaignStatus; type?: CampaignType; channel?: ChannelType;
    createdBy?: string; fromDate?: string; toDate?: string;
  }): Campaign[] {
    let list = Array.from(this.campaigns.values());
    if (filters?.status) list = list.filter(c => c.status === filters.status);
    if (filters?.type) list = list.filter(c => c.type === filters.type);
    if (filters?.channel) list = list.filter(c => c.channel === filters.channel);
    if (filters?.createdBy) list = list.filter(c => c.createdBy === filters.createdBy);
    if (filters?.fromDate) list = list.filter(c => c.createdAt >= filters.fromDate!);
    if (filters?.toDate) list = list.filter(c => c.createdAt <= filters.toDate!);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateCampaign(id: string, updates: Partial<Campaign>): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    Object.assign(campaign, updates, { updatedAt: new Date().toISOString() });
    this.campaigns.set(id, campaign);
    return campaign;
  }

  // ── Workflow ──

  approveCampaign(id: string, approvedBy: string): Campaign {
    return this.updateCampaign(id, {
      status: this.getCampaign(id)?.schedule ? 'SCHEDULED' : 'DRAFT',
      approvedBy,
    });
  }

  scheduleCampaign(id: string, schedule: CampaignSchedule): Campaign {
    return this.updateCampaign(id, { schedule, status: 'SCHEDULED' });
  }

  sendCampaign(id: string): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    if (campaign.status !== 'SCHEDULED' && campaign.status !== 'DRAFT') {
      throw new Error(`Cannot send campaign with status ${campaign.status}`);
    }

    campaign.status = 'SENDING';
    campaign.sentAt = new Date().toISOString();
    campaign.updatedAt = campaign.sentAt;
    this.campaigns.set(id, campaign);
    logger.info(`Campaign ${campaign.name} sending started`);
    return campaign;
  }

  completeCampaign(id: string, stats?: Partial<CampaignStats>): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);

    campaign.status = 'COMPLETED';
    campaign.completedAt = new Date().toISOString();
    if (stats) {
      campaign.stats = { ...campaign.stats, ...stats };
      this.calculateDerivedStats(campaign);
    }
    campaign.updatedAt = campaign.completedAt;
    this.campaigns.set(id, campaign);
    logger.info(`Campaign ${campaign.name} completed`);
    return campaign;
  }

  pauseCampaign(id: string): Campaign {
    return this.updateCampaign(id, { status: 'PAUSED' });
  }

  cancelCampaign(id: string): Campaign {
    return this.updateCampaign(id, { status: 'CANCELLED' });
  }

  // ── Stats Tracking ──

  recordSend(id: string, count: number = 1): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    campaign.stats.totalSent += count;
    campaign.stats.totalDelivered += count;
    this.campaigns.set(id, campaign);
    return campaign;
  }

  recordOpen(id: string): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    campaign.stats.totalOpened++;
    this.calculateDerivedStats(campaign);
    this.campaigns.set(id, campaign);
    return campaign;
  }

  recordClick(id: string): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    campaign.stats.totalClicked++;
    this.calculateDerivedStats(campaign);
    this.campaigns.set(id, campaign);
    return campaign;
  }

  recordConversion(id: string, revenue: number = 0): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    campaign.stats.totalConverted++;
    campaign.stats.totalRevenue = roundTo(campaign.stats.totalRevenue + revenue);
    this.calculateDerivedStats(campaign);
    this.campaigns.set(id, campaign);
    return campaign;
  }

  recordBounce(id: string): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    campaign.stats.totalFailed++;
    campaign.stats.totalDelivered = Math.max(0, campaign.stats.totalDelivered - 1);
    this.calculateDerivedStats(campaign);
    this.campaigns.set(id, campaign);
    return campaign;
  }

  recordUnsubscribe(id: string): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    campaign.stats.totalUnsubscribed++;
    this.calculateDerivedStats(campaign);
    this.campaigns.set(id, campaign);
    return campaign;
  }

  private calculateDerivedStats(campaign: Campaign): void {
    const s = campaign.stats;
    s.openRate = s.totalDelivered > 0 ? roundTo(s.totalOpened / s.totalDelivered, 4) : 0;
    s.clickRate = s.totalOpened > 0 ? roundTo(s.totalClicked / s.totalOpened, 4) : 0;
    s.conversionRate = s.totalClicked > 0 ? roundTo(s.totalConverted / s.totalClicked, 4) : 0;
    s.bounceRate = s.totalSent > 0 ? roundTo(s.totalFailed / s.totalSent, 4) : 0;
    s.unsubscribeRate = s.totalDelivered > 0 ? roundTo(s.totalUnsubscribed / s.totalDelivered, 4) : 0;
    s.revenuePerRecipient = s.totalDelivered > 0 ? roundTo(s.totalRevenue / s.totalDelivered, 2) : 0;
    s.roi = s.totalRevenue > 0 ? roundTo(s.totalRevenue / 1000, 2) : 0; // Simplified ROI
  }

  // ── Channel-specific Helpers ──

  createEmailContent(subject: string, body: string, options?: {
    previewText?: string; templateId?: string; headerImage?: string;
    footer?: string; ctaText?: string; ctaLink?: string;
  }): CampaignContent {
    return {
      subject, body, previewText: options?.previewText,
      templateId: options?.templateId, headerImage: options?.headerImage,
      footer: options?.footer, ctaText: options?.ctaText, ctaLink: options?.ctaLink,
      variables: {},
    };
  }

  createSMSCampaign(name: string, body: string, segments: string[], createdBy: string): Campaign {
    return this.createCampaign({
      name, type: 'PROMOTIONAL', channel: 'SMS',
      content: { body, variables: {} },
      segments, createdBy,
    });
  }

  createWhatsAppCampaign(name: string, body: string, segments: string[], createdBy: string, options?: {
    templateId?: string; headerImage?: string; ctaText?: string; ctaLink?: string;
  }): Campaign {
    return this.createCampaign({
      name, type: 'PROMOTIONAL', channel: 'WHATSAPP',
      content: { body, templateId: options?.templateId, headerImage: options?.headerImage, ctaText: options?.ctaText, ctaLink: options?.ctaLink, variables: {} },
      segments, createdBy,
    });
  }

  createPushCampaign(name: string, title: string, body: string, segments: string[], createdBy: string): Campaign {
    return this.createCampaign({
      name, type: 'PROMOTIONAL', channel: 'PUSH_NOTIFICATION',
      content: { subject: title, body, variables: {} },
      segments, createdBy,
    });
  }

  // ── Analytics ──

  getCampaignStatsSummary(): {
    totalCampaigns: number; activeCampaigns: number;
    totalSent: number; totalDelivered: number;
    averageOpenRate: number; averageClickRate: number;
    averageConversionRate: number; totalRevenue: number;
  } {
    const all = Array.from(this.campaigns.values());
    const sent = all.filter(c => c.stats.totalSent > 0);

    return {
      totalCampaigns: all.length,
      activeCampaigns: all.filter(c => ['DRAFT', 'SCHEDULED', 'SENDING'].includes(c.status)).length,
      totalSent: sum(sent.map(c => c.stats.totalSent)),
      totalDelivered: sum(sent.map(c => c.stats.totalDelivered)),
      averageOpenRate: sent.length > 0 ? roundTo(avg(sent.map(c => c.stats.openRate)), 4) : 0,
      averageClickRate: sent.length > 0 ? roundTo(avg(sent.map(c => c.stats.clickRate)), 4) : 0,
      averageConversionRate: sent.length > 0 ? roundTo(avg(sent.map(c => c.stats.conversionRate)), 4) : 0,
      totalRevenue: roundTo(sum(sent.map(c => c.stats.totalRevenue))),
    };
  }

  private emptyStats(): CampaignStats {
    return {
      totalSent: 0, totalDelivered: 0, totalFailed: 0,
      totalOpened: 0, totalClicked: 0, totalConverted: 0,
      totalUnsubscribed: 0, totalComplained: 0, totalRevenue: 0,
      openRate: 0, clickRate: 0, conversionRate: 0,
      bounceRate: 0, unsubscribeRate: 0, revenuePerRecipient: 0, roi: 0,
    };
  }

  reset(): void {
    this.campaigns.clear();
    this.campaignCounter = 0;
  }
}

export default CampaignEngine.getInstance();
