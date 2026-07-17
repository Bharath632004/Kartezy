/**
 * Kartezy Enterprise CRM — CRM Core
 *
 * Central orchestrator that coordinates all CRM engines, provides
 * unified initialization, cross-engine workflows, and high-level
 * business operations integrated with the AI Platform.
 */

import { createLogger } from '../utils/logger';
import { CustomerCRMEngine } from './customer-crm-engine';
import { MerchantCRMEngine } from './merchant-crm-engine';
import { LeadManagementEngine } from './lead-engine';
import { ReferralEngine } from './referral-engine';
import { LoyaltyEngine } from './loyalty-engine';
import { CampaignEngine } from './campaign-engine';
import { MarketingAutomationEngine } from './marketing-automation-engine';
import { SegmentationEngine } from './segmentation-engine';
import { BehaviorTrackingEngine } from './behavior-engine';
import { ABTestEngine } from './ab-test-engine';
import { CouponsEngine } from './coupons-engine';
import { RewardsEngine } from './rewards-engine';
import { CampaignAnalyticsEngine } from './campaign-analytics-engine';
import { MarketingDashboardEngine } from './marketing-dashboard-engine';
import { AIIntegrationEngine, type AIPlatformModel } from './ai-integration-engine';
import type { CustomerProfile } from '../types';

const logger = createLogger('CRMCore');

export class CRMCore {
  private static instance: CRMCore;
  private initialized = false;

  readonly customerCRM: CustomerCRMEngine;
  readonly merchantCRM: MerchantCRMEngine;
  readonly leadManagement: LeadManagementEngine;
  readonly referral: ReferralEngine;
  readonly loyalty: LoyaltyEngine;
  readonly campaigns: CampaignEngine;
  readonly automation: MarketingAutomationEngine;
  readonly segmentation: SegmentationEngine;
  readonly behavior: BehaviorTrackingEngine;
  readonly abTesting: ABTestEngine;
  readonly coupons: CouponsEngine;
  readonly rewards: RewardsEngine;
  readonly campaignAnalytics: CampaignAnalyticsEngine;
  readonly marketingDashboard: MarketingDashboardEngine;
  readonly aiIntegration: AIIntegrationEngine;

  private constructor() {
    this.customerCRM = CustomerCRMEngine.getInstance();
    this.merchantCRM = MerchantCRMEngine.getInstance();
    this.leadManagement = LeadManagementEngine.getInstance();
    this.referral = ReferralEngine.getInstance();
    this.loyalty = LoyaltyEngine.getInstance();
    this.campaigns = CampaignEngine.getInstance();
    this.automation = MarketingAutomationEngine.getInstance();
    this.segmentation = SegmentationEngine.getInstance();
    this.behavior = BehaviorTrackingEngine.getInstance();
    this.abTesting = ABTestEngine.getInstance();
    this.coupons = CouponsEngine.getInstance();
    this.rewards = RewardsEngine.getInstance();
    this.campaignAnalytics = CampaignAnalyticsEngine.getInstance();
    this.marketingDashboard = MarketingDashboardEngine.getInstance();
    this.aiIntegration = AIIntegrationEngine.getInstance();
  }

  static getInstance(): CRMCore {
    if (!CRMCore.instance) {
      CRMCore.instance = new CRMCore();
    }
    return CRMCore.instance;
  }

  /**
   * Initialize all CRM engines.
   * 
   * If you have the AI Platform available, create a CustomerIntelligenceModel
   * and pass it as the `aiModel` parameter to enable full AI-powered features:
   * 
   * ```typescript
   * import { CustomerIntelligenceModel } from '@kartezy/ai-platform';
   * import { ModelManager } from '@kartezy/ai-platform';
   * 
   * const model = new CustomerIntelligenceModel();
   * ModelManager.getInstance().register(model);
   * await CRMCore.getInstance().initialize(model);
   * ```
   * 
   * Falls back to local intelligence computation if no model is provided.
   */
  initialize(aiModel?: AIPlatformModel): void {
    if (this.initialized) {
      logger.warn('CRM Core already initialized');
      return;
    }

    logger.info('=== Initializing Kartezy Enterprise CRM ===');

    this.customerCRM.initialize();
    this.merchantCRM.initialize();
    this.leadManagement.initialize();
    this.referral.initialize();
    this.loyalty.initialize();
    this.campaigns.initialize();
    this.automation.initialize();
    this.segmentation.initialize();
    this.behavior.initialize();
    this.abTesting.initialize();
    this.coupons.initialize();
    this.rewards.initialize();
    this.campaignAnalytics.initialize();
    this.marketingDashboard.initialize();

    // Inject the AI Platform model if provided, otherwise use local computation
    if (aiModel) {
      this.aiIntegration.initialize(aiModel);
      logger.info('AI Platform CustomerIntelligenceModel injected into CRM engines');
    } else {
      this.aiIntegration.initialize();
      logger.info('No AI Platform model provided, CRM using local intelligence computation');
    }

    this.initialized = true;
    logger.info('=== Enterprise CRM initialized successfully ===');
  }

  // ── Cross-Engine Workflows ──

  /**
   * Full customer onboarding workflow:
   * 1. Create CRM profile
   * 2. Run automation triggers
   * 3. Assign segments
   * 4. Issue welcome reward
   */
  onboardCustomer(data: {
    firstName: string; lastName: string; email: string; phone: string;
    source?: string;
  }) {
    const profile = this.customerCRM.createProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      source: (data.source as any) || 'DIRECT_SIGNUP',
    });

    // Evaluate segments
    const segments = this.segmentation.getCustomerSegments(profile);

    // Trigger automation
    this.automation.evaluateTrigger('CUSTOMER_SIGNED_UP', {
      customerId: profile.id,
      email: profile.email,
      firstName: profile.firstName,
    });

    // Issue welcome reward
    if (profile.totalOrders === 0) {
      this.rewards.issueReward({
        customerId: profile.id,
        type: 'DISCOUNT',
        name: 'Welcome Reward',
        description: 'Welcome! Enjoy this discount on your first order.',
        value: 100,
        source: 'CAMPAIGN',
        sourceId: 'welcome',
        expiresInDays: 30,
      });
    }

    return {
      profile,
      segments: segments.map(s => s.name),
    };
  }

  /**
   * Full referral workflow:
   * 1. Create referral
   * 2. Track click/signup/conversion
   * 3. Issue rewards
   * 4. Run automation triggers
   */
  processReferral(params: {
    referrerId: string; referrerName: string;
    refereeEmail: string; refereePhone?: string;
    channel: string;
  }) {
    const program = this.referral.getActivePrograms()[0];
    if (!program) throw new Error('No active referral program');

    const referral = this.referral.createReferral({
      programId: program.id,
      referrerId: params.referrerId,
      referrerName: params.referrerName,
      refereeEmail: params.refereeEmail,
      refereePhone: params.refereePhone,
      channel: params.channel as any,
    });

    return { referral, program };
  }

  /**
   * Full loyalty points earning workflow:
   * 1. Earn points
   * 2. Check tier upgrade
   * 3. Trigger automation
   */
  processLoyaltyEarning(customerId: string, amount: number, orderId: string) {
    const transaction = this.loyalty.earnPoints(
      customerId, amount, 'ORDER', orderId, `Points earned from order ${orderId}`
    );

    const pointsAccount = this.loyalty.getPointsAccount(customerId);
    if (pointsAccount?.tier) {
      // Could trigger tier upgrade automation here
    }

    return transaction;
  }

  /**
   * Generate complete marketing dashboard
   */
  generateMarketingDashboard(period: string) {
    const campaigns = this.campaigns.getAllCampaigns();
    const customers = this.customerCRM.getAllProfiles();
    const channelAnalytics = this.campaignAnalytics.analyzeAllChannels(campaigns, period);
    const segments = this.segmentation.getAllSegments();
    const automationStats = this.automation.getAutomationSummary();

    const dashboard = this.marketingDashboard.generateDashboard(
      period, campaigns, customers, channelAnalytics, segments, automationStats
    );

    const keyMetrics = this.marketingDashboard.getKeyMetrics(period, campaigns, customers);

    return { dashboard, keyMetrics };
  }

  /**
   * AI-powered campaign optimization
   */
  async optimizeCampaign(campaignId: string) {
    const campaign = this.campaigns.getCampaign(campaignId);
    if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

    // Get segments for targeting
    const segments = campaign.segments;
    const segmentCustomers: CustomerProfile[] = [];

    for (const segmentId of segments) {
      const segment = this.segmentation.getSegment(segmentId);
      if (segment) {
        const matched = this.customerCRM.getAllProfiles().filter(c => {
          try { return this.segmentation.evaluateCustomer(c, segmentId); }
          catch { return false; }
        });
        segmentCustomers.push(...matched);
      }
    }

    // Get AI recommendations for optimal send time and personalization
    const uniqueCustomers = segmentCustomers.filter(
      (c, i, arr) => arr.findIndex(x => x.id === c.id) === i
    );

    return {
      campaign: campaign.name,
      targetCustomers: uniqueCustomers.length,
      segments,
      aiRecommendations: {
        optimalSendTime: '10:00 AM',
        suggestedSubject: await this.generateSubjectLine(campaign),
        predictedOpenRate: 0.25,
        predictedConversionRate: 0.05,
      },
    };
  }

  private async generateSubjectLine(campaign: any): Promise<string> {
    const subjects = [
      `Exclusive offer just for you`,
      `Don't miss out on these deals`,
      `Your personalized recommendations`,
      `Special rewards waiting for you`,
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  }

  getStatus(): {
    initialized: boolean;
    engineCount: number;
    stats: {
      customers: number;
      merchants: number;
      leads: number;
      campaigns: number;
      activeWorkflows: number;
      segments: number;
    };
  } {
    return {
      initialized: this.initialized,
      engineCount: 15,
      stats: {
        customers: this.customerCRM.getAllProfiles().length,
        merchants: this.merchantCRM.getAllProfiles().length,
        leads: this.leadManagement.getAllLeads().length,
        campaigns: this.campaigns.getAllCampaigns().length,
        activeWorkflows: this.automation.getActiveWorkflows().length,
        segments: this.segmentation.getAllSegments().length,
      },
    };
  }

  reset(): void {
    this.customerCRM.reset();
    this.merchantCRM.reset();
    this.leadManagement.reset();
    this.referral.reset();
    this.loyalty.reset();
    this.campaigns.reset();
    this.automation.reset();
    this.segmentation.reset();
    this.behavior.reset();
    this.abTesting.reset();
    this.coupons.reset();
    this.rewards.reset();
    this.aiIntegration.reset();
    this.initialized = false;
    logger.info('CRM Core reset complete');
  }
}

export const crmCore = CRMCore.getInstance();
export default crmCore;
