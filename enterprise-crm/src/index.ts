/**
 * Kartezy Enterprise CRM
 * 
 * Complete customer relationship management with lead management, referral engine,
 * loyalty engine, marketing campaigns (Email/SMS/WhatsApp/Push), marketing automation,
 * customer segmentation, behavior tracking, A/B testing, coupons, rewards,
 * campaign analytics, and marketing dashboard - all integrated with AI Platform.
 */

// ─── Types ───
export type {
  CurrencyCode, EntityStatus, Priority, DateRange, Address,
  CustomerTier, CustomerSource, CustomerLifecycleStage, CustomerProfile, CustomerActivity, ActivityType,
  MerchantTier, MerchantLifecycleStage, MerchantProfile,
  LeadSource, LeadStatus, LeadScoreCategory, Lead, LeadActivity, LeadActivityType, LeadScoringRule,
  ReferralStatus, ReferralProgram, Referral, RewardDefinition,
  LoyaltyTier, LoyaltyTransactionType, LoyaltyRewardType, LoyaltyProgram, LoyaltyTierConfig,
  LoyaltyPoints, LoyaltyTransaction, LoyaltyReward,
  ChannelType, CampaignStatus, CampaignType, CampaignPriority, Campaign, CampaignContent,
  CampaignSchedule, CampaignTracking, CampaignStats,
  TriggerEvent, AutomationActionType, AutomationWorkflow, AutomationTrigger,
  AutomationCondition, AutomationAction, AutomationStats,
  SegmentType, SegmentOperator, Segment, SegmentRule,
  BehaviorEvent, Session,
  ABTestStatus, ABTestWinnerDetermination, ABTest, ABVariant, ABTestMetrics,
  CouponType, CouponStatus, CouponApplicability, Coupon, CouponRedemption,
  RewardStatus, RewardType, Reward,
  CampaignAnalytics, ChannelAnalytics,
  MarketingDashboardData,
  AIModelPrediction, CustomerIntelligence,
} from './types';

// ─── Zod Schemas ───
export { AddressSchema, DateRangeSchema, CustomerProfileSchema, LeadSchema, CampaignSchema, CouponSchema } from './types';

// ─── Engines ───
export { CustomerCRMEngine } from './engines/customer-crm-engine';
export { MerchantCRMEngine } from './engines/merchant-crm-engine';
export { LeadManagementEngine } from './engines/lead-engine';
export { ReferralEngine } from './engines/referral-engine';
export { LoyaltyEngine } from './engines/loyalty-engine';
export { CampaignEngine } from './engines/campaign-engine';
export { MarketingAutomationEngine } from './engines/marketing-automation-engine';
export { SegmentationEngine } from './engines/segmentation-engine';
export { BehaviorTrackingEngine } from './engines/behavior-engine';
export { ABTestEngine } from './engines/ab-test-engine';
export { CouponsEngine } from './engines/coupons-engine';
export { RewardsEngine } from './engines/rewards-engine';
export { CampaignAnalyticsEngine } from './engines/campaign-analytics-engine';
export { MarketingDashboardEngine } from './engines/marketing-dashboard-engine';
export { AIIntegrationEngine, type AIPlatformModel } from './engines/ai-integration-engine';
export { CRMCore, crmCore } from './engines/crm-core';

// ─── Utils ───
export { generateId, generateNumber, formatCurrency, formatPercent, roundTo, sum, avg, getCurrentDate, addDays, daysBetween } from './utils/helpers';
export { createLogger } from './utils/logger';
