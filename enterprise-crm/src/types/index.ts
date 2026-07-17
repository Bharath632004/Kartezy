/**
 * Kartezy Enterprise CRM — Core Types
 *
 * Complete type definitions for customer CRM, merchant CRM, lead management,
 * referral engine, loyalty engine, campaigns (email/SMS/WhatsApp/push),
 * marketing automation, customer segmentation, behavior tracking, A/B testing,
 * coupons, rewards, campaign analytics, and marketing dashboard.
 */

import { z } from 'zod';

// ──────────────────────────────────────────────
// Common / Shared
// ──────────────────────────────────────────────

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';
export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ARCHIVED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface DateRange {
  start: string;
  end: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// ──────────────────────────────────────────────
// Customer CRM
// ──────────────────────────────────────────────

export type CustomerTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
export type CustomerSource = 'DIRECT_SIGNUP' | 'REFERRAL' | 'SOCIAL_MEDIA' | 'ADS' | 'ORGANIC_SEARCH' | 'EMAIL_CAMPAIGN' | 'SMS_CAMPAIGN' | 'WHATSAPP_CAMPAIGN' | 'PARTNER' | 'OTHER';
export type CustomerLifecycleStage = 'LEAD' | 'PROSPECT' | 'ACTIVE' | 'AT_RISK' | 'CHURNED' | 'REACTIVATED';

export interface CustomerProfile {
  id: string;
  externalId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth?: string;
  anniversary?: string;
  gender?: string;
  address?: Address;
  tags: string[];
  notes?: string;
  source: CustomerSource;
  lifecycleStage: CustomerLifecycleStage;
  tier: CustomerTier;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lifetimeValue: number;
  acquisitionDate: string;
  lastPurchaseDate?: string;
  lastInteractionDate?: string;
  preferredCategories: string[];
  preferredChannels: ChannelType[];
  marketingOptIn: boolean;
  smsOptIn: boolean;
  emailOptIn: boolean;
  whatsappOptIn: boolean;
  pushOptIn: boolean;
  customFields?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  activityType: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export type ActivityType =
  | 'PAGE_VIEW' | 'PRODUCT_VIEW' | 'SEARCH' | 'ADD_TO_CART' | 'REMOVE_FROM_CART'
  | 'CHECKOUT_STARTED' | 'ORDER_PLACED' | 'ORDER_CANCELLED' | 'ORDER_DELIVERED'
  | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'REFUND_INITIATED' | 'REFUND_COMPLETED'
  | 'REVIEW_SUBMITTED' | 'SUPPORT_TICKET' | 'EMAIL_OPENED' | 'EMAIL_CLICKED'
  | 'SMS_RECEIVED' | 'WHATSAPP_READ' | 'PUSH_CLICKED' | 'APP_OPENED'
  | 'LOYALTY_EARNED' | 'LOYALTY_REDEEMED' | 'REFERRAL_SENT' | 'REFERRAL_CONVERTED'
  | 'COUPON_APPLIED' | 'COUPON_EXPIRED' | 'SEGMENT_ASSIGNED';

// ──────────────────────────────────────────────
// Merchant CRM
// ──────────────────────────────────────────────

export type MerchantTier = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
export type MerchantLifecycleStage = 'ONBOARDING' | 'ACTIVE' | 'AT_RISK' | 'CHURNED' | 'REACTIVATED';

export interface MerchantProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  address: Address;
  gstin?: string;
  pan?: string;
  tier: MerchantTier;
  lifecycleStage: MerchantLifecycleStage;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  averageRating: number;
  totalProducts: number;
  joinedDate: string;
  lastActiveDate?: string;
  preferredChannels: ChannelType[];
  marketingOptIn: boolean;
  emailOptIn: boolean;
  smsOptIn: boolean;
  whatsappOptIn: boolean;
  tags: string[];
  notes?: string;
  customFields?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Lead Management
// ──────────────────────────────────────────────

export type LeadSource = 'WEBSITE' | 'LANDING_PAGE' | 'REFERRAL' | 'SOCIAL_MEDIA' | 'ADS' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PARTNER' | 'EVENT' | 'COLD_CALL' | 'CHATBOT' | 'API' | 'OTHER';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST' | 'DISQUALIFIED';
export type LeadScoreCategory = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  designation?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  scoreCategory: LeadScoreCategory;
  assignedTo?: string;
  interest: string[];
  budget?: number;
  timeline?: string;
  notes?: string;
  customFields?: Record<string, string>;
  activities: LeadActivity[];
  convertedToCustomerId?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: LeadActivityType;
  description: string;
  performedBy: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export type LeadActivityType =
  | 'NOTE_ADDED' | 'STATUS_CHANGED' | 'EMAIL_SENT' | 'EMAIL_OPENED'
  | 'CALL_MADE' | 'MEETING_SCHEDULED' | 'PROPOSAL_SENT' | 'DEMO_COMPLETED'
  | 'FORM_SUBMITTED' | 'WEBSITE_VISIT' | 'CHAT_INITIATED' | 'SCORE_CHANGED';

export interface LeadScoringRule {
  id: string;
  name: string;
  field: string;
  operator: 'EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN';
  value: string | number | string[];
  score: number;
  isActive: boolean;
}

// ──────────────────────────────────────────────
// Referral Engine
// ──────────────────────────────────────────────

export type ReferralStatus = 'SENT' | 'CLICKED' | 'SIGNED_UP' | 'FIRST_PURCHASE' | 'CONVERTED' | 'EXPIRED' | 'REVOKED';

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  referrerReward: RewardDefinition;
  refereeReward: RewardDefinition;
  maxReferralsPerUser: number;
  maxRewardsPerUser: number;
  rewardCap?: number;
  expiryDays: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  targetSegments: string[];
  channels: ChannelType[];
  createdAt: string;
  updatedAt: string;
}

export interface Referral {
  id: string;
  programId: string;
  referrerId: string;
  referrerName: string;
  refereeId?: string;
  refereeName?: string;
  refereeEmail: string;
  refereePhone?: string;
  referralCode: string;
  status: ReferralStatus;
  rewardEarned: number;
  rewardCurrency: CurrencyCode;
  clickedAt?: string;
  signedUpAt?: string;
  convertedAt?: string;
  expiresAt: string;
  channel: ChannelType;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RewardDefinition {
  type: 'FIXED' | 'PERCENTAGE' | 'POINTS' | 'FREE_PRODUCT' | 'DISCOUNT';
  value: number;
  description: string;
  currency?: CurrencyCode;
}

// ──────────────────────────────────────────────
// Loyalty Engine
// ──────────────────────────────────────────────

export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
export type LoyaltyTransactionType = 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTED' | 'BONUS' | 'TIER_BONUS';
export type LoyaltyRewardType = 'DISCOUNT' | 'FREE_PRODUCT' | 'CASHBACK' | 'FREE_SHIPPING' | 'EXCLUSIVE_ACCESS' | 'GIFT_CARD';

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerCurrency: number;
  currencyPerPoint: number;
  tiers: LoyaltyTierConfig[];
  rewards: LoyaltyReward[];
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface LoyaltyTierConfig {
  tier: LoyaltyTier;
  minPoints: number;
  maxPoints: number;
  multiplier: number;
  benefits: string[];
  renewalPeriodDays: number;
}

export interface LoyaltyPoints {
  id: string;
  customerId: string;
  tier: LoyaltyTier;
  totalPoints: number;
  earnedPoints: number;
  redeemedPoints: number;
  expiredPoints: number;
  pendingPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  nextTierPoints: number;
  tierExpiryDate?: string;
  lastUpdated: string;
  createdAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  transactionType: LoyaltyTransactionType;
  points: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceType: string;
  referenceId: string;
  description: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  programId: string;
  name: string;
  description: string;
  type: LoyaltyRewardType;
  pointsRequired: number;
  value: number;
  currency?: CurrencyCode;
  imageUrl?: string;
  terms?: string;
  isActive: boolean;
  stock?: number;
  validFrom: string;
  validTo?: string;
}

// ──────────────────────────────────────────────
// Campaigns (Email / SMS / WhatsApp / Push)
// ──────────────────────────────────────────────

export type ChannelType = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH_NOTIFICATION' | 'IN_APP';
export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'PAUSED' | 'CANCELLED' | 'COMPLETED';
export type CampaignType = 'PROMOTIONAL' | 'TRANSACTIONAL' | 'ONBOARDING' | 'REACTIVATION' | 'WINBACK' | 'LOYALTY' | 'SEASONAL' | 'AUTOMATED';
export type CampaignPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  channel: ChannelType;
  status: CampaignStatus;
  priority: CampaignPriority;
  subject?: string;
  content: CampaignContent;
  segments: string[];
  excludeSegments: string[];
  targetCustomerIds?: string[];    schedule?: CampaignSchedule;
    abTest?: { id: string; name: string };
  tracking: CampaignTracking;
  stats: CampaignStats;
  createdBy: string;
  approvedBy?: string;
  sentAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignContent {
  subject?: string;
  previewText?: string;
  body: string;
  templateId?: string;
  variables: Record<string, string>;
  attachments?: string[];
  headerImage?: string;
  footer?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface CampaignSchedule {
  sendAt: string;
  timezone: string;
  sendWindowStart?: string;
  sendWindowEnd?: string;
  frequency?: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  endDate?: string;
}

export interface CampaignTracking {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  trackingPixel?: string;
  linkTracking: boolean;
  openTracking: boolean;
}

export interface CampaignStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  totalUnsubscribed: number;
  totalComplained: number;
  totalRevenue: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  revenuePerRecipient: number;
  roi: number;
}

// ──────────────────────────────────────────────
// Marketing Automation
// ──────────────────────────────────────────────

export type TriggerEvent =
  | 'CUSTOMER_SIGNED_UP' | 'CUSTOMER_LOGIN' | 'FIRST_PURCHASE' | 'ORDER_PLACED'
  | 'ORDER_DELIVERED' | 'ORDER_CANCELLED' | 'CART_ABANDONED' | 'PRODUCT_VIEWED'
  | 'SEARCH_PERFORMED' | 'PRICE_DROP' | 'BACK_IN_STOCK' | 'BIRTHDAY'
  | 'ANNIVERSARY' | 'LOYALTY_TIER_UPGRADE' | 'LOYALTY_TIER_DOWNGRADE'
  | 'REFERRAL_CONVERTED' | 'INACTIVITY_7_DAYS' | 'INACTIVITY_14_DAYS'
  | 'INACTIVITY_30_DAYS' | 'INACTIVITY_60_DAYS' | 'INACTIVITY_90_DAYS'
  | 'SEGMENT_ASSIGNED' | 'CUSTOM_EVENT';

export type AutomationActionType =
  | 'SEND_EMAIL' | 'SEND_SMS' | 'SEND_WHATSAPP' | 'SEND_PUSH'
  | 'UPDATE_SEGMENT' | 'ADD_TAG' | 'REMOVE_TAG' | 'Award_LOYALTY_POINTS'
  | 'SEND_COUPON' | 'TRIGGER_WEBHOOK' | 'UPDATE_CRM_FIELD' | 'ASSIGN_TO_USER';

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isActive: boolean;
  stats: AutomationStats;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationTrigger {
  event: TriggerEvent;
  delayMinutes: number;
  filters?: Record<string, unknown>;
}

export interface AutomationCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'IN' | 'NOT_IN' | 'BETWEEN';
  value: unknown;
}

export interface AutomationAction {
  type: AutomationActionType;
  config: Record<string, unknown>;
  order: number;
  condition?: AutomationCondition;
}

export interface AutomationStats {
  totalTriggered: number;
  totalCompleted: number;
  totalFailed: number;
  totalConverted: number;
}

// ──────────────────────────────────────────────
// Customer Segmentation
// ──────────────────────────────────────────────

export type SegmentType = 'BEHAVIORAL' | 'DEMOGRAPHIC' | 'TRANSACTIONAL' | 'RFM' | 'PREDICTIVE' | 'CUSTOM';
export type SegmentOperator = 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IN' | 'NOT_IN' | 'CONTAINS' | 'LAST_X_DAYS';

export interface Segment {
  id: string;
  name: string;
  description: string;
  type: SegmentType;
  rules: SegmentRule[];
  logic: 'AND' | 'OR';
  customerCount: number;
  isDynamic: boolean;
  isActive: boolean;
  lastRefreshed?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentRule {
  field: string;
  operator: SegmentOperator;
  value: unknown;
  valueEnd?: unknown;
}

// ──────────────────────────────────────────────
// Behavior Tracking
// ──────────────────────────────────────────────

export interface BehaviorEvent {
  id: string;
  customerId: string;
  sessionId: string;
  eventType: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  pageUrl?: string;
  referrerUrl?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface Session {
  id: string;
  customerId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  pageViews: number;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  referrer: string;
  isActive: boolean;
}

// ──────────────────────────────────────────────
// A/B Testing
// ──────────────────────────────────────────────

export type ABTestStatus = 'DRAFT' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type ABTestWinnerDetermination = 'MANUAL' | 'AUTOMATIC_CONFIDENCE' | 'AUTOMATIC_REVENUE';

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: ABTestStatus;
  variants: ABVariant[];
  targetSegments: string[];
  sampleSize: number;
  confidenceLevel: number;
  winnerDetermination: ABTestWinnerDetermination;
  winningVariant?: string;
  startDate: string;
  endDate?: string;
  metrics: ABTestMetrics;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ABVariant {
  id: string;
  name: string;
  description: string;
  trafficPercentage: number;
  content: Record<string, unknown>;
  stats: {
    impressions: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  };
}

export interface ABTestMetrics {
  totalImpressions: number;
  totalConversions: number;
  totalRevenue: number;
  overallConversionRate: number;
  significanceLevel: number;
  recommendedVariant?: string;
}

// ──────────────────────────────────────────────
// Coupons & Discounts
// ──────────────────────────────────────────────

export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y' | 'BOGO';
export type CouponStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'DEPLETED' | 'CANCELLED';
export type CouponApplicability = 'ALL' | 'CATEGORY' | 'PRODUCT' | 'MINIMUM_ORDER' | 'CUSTOMER_SEGMENT';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  status: CouponStatus;
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
  applicability: CouponApplicability;
  applicableIds: string[];
  usageLimit: number;
  usageLimitPerCustomer: number;
  totalUsed: number;
  startsAt: string;
  expiresAt: string;
  isStackable: boolean;
  customerSegments: string[];
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponRedemption {
  id: string;
  couponId: string;
  couponCode: string;
  customerId: string;
  orderId: string;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
  redeemedAt: string;
}

// ──────────────────────────────────────────────
// Rewards
// ──────────────────────────────────────────────

export type RewardStatus = 'AVAILABLE' | 'CLAIMED' | 'EXPIRED' | 'CANCELLED' | 'USED';
export type RewardType = 'DISCOUNT' | 'FREE_PRODUCT' | 'FREE_SHIPPING' | 'CASHBACK' | 'GIFT_CARD' | 'EXCLUSIVE_ACCESS' | 'POINTS_BONUS';

export interface Reward {
  id: string;
  customerId: string;
  type: RewardType;
  name: string;
  description: string;
  value: number;
  currency: CurrencyCode;
  status: RewardStatus;
  source: 'LOYALTY' | 'REFERRAL' | 'CAMPAIGN' | 'BIRTHDAY' | 'ANNIVERSARY' | 'MANUAL';
  sourceId: string;
  claimedAt?: string;
  usedAt?: string;
  expiresAt: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ──────────────────────────────────────────────
// Campaign Analytics
// ──────────────────────────────────────────────

export interface CampaignAnalytics {
  campaignId: string;
  campaignName: string;
  channel: ChannelType;
  period: string;
  metrics: CampaignStats;
  trend: Array<{ date: string; metric: string; value: number }>;
  topSegments: Array<{ segment: string; conversionRate: number; revenue: number }>;
  topProducts: Array<{ productId: string; productName: string; revenue: number; conversions: number }>;
  timeOfDayAnalysis: Array<{ hour: number; opens: number; clicks: number; conversions: number }>;
  deviceAnalysis: Array<{ device: string; opens: number; clicks: number; conversionRate: number }>;
}

export interface ChannelAnalytics {
  channel: ChannelType;
  period: string;
  totalCampaigns: number;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageConversionRate: number;
  totalRevenue: number;
  costPerCampaign: number;
  roi: number;
}

// ──────────────────────────────────────────────
// Marketing Dashboard
// ──────────────────────────────────────────────

export interface MarketingDashboardData {
  period: string;
  overview: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalCustomers: number;
    newCustomers: number;
    totalRevenue: number;
    marketingRevenue: number;
    averageROI: number;
  };
  channelPerformance: ChannelAnalytics[];
  topCampaigns: CampaignAnalytics[];
  customerGrowth: Array<{ date: string; newCustomers: number; totalCustomers: number }>;
  revenueAttribution: Array<{ channel: ChannelType; revenue: number; percentage: number }>;
  segmentation: Array<{ segment: string; count: number; percentage: number }>;
  automationStats: {
    activeWorkflows: number;
    totalTriggered: number;
    totalConverted: number;
  };
}

// ──────────────────────────────────────────────
// AI Platform Integration
// ──────────────────────────────────────────────

export interface AIModelPrediction {
  modelName: string;
  predictionType: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  confidence: number;
  timestamp: string;
}

export interface CustomerIntelligence {
  lifetimeValue: number;
  churnProbability: number;
  churnRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  nextBestAction: string;
  recommendedSegment: string;
  recommendedOffer: string;
  preferredChannel: ChannelType;
  optimalSendTime: string;
  productRecommendations: string[];
  engagementScore: number;
}

// ──────────────────────────────────────────────
// Zod Validation Schemas
// ──────────────────────────────────────────────

export const AddressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/),
  country: z.string().default('India'),
});

export const DateRangeSchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const CustomerProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  source: z.enum(['DIRECT_SIGNUP', 'REFERRAL', 'SOCIAL_MEDIA', 'ADS', 'ORGANIC_SEARCH', 'EMAIL_CAMPAIGN', 'SMS_CAMPAIGN', 'WHATSAPP_CAMPAIGN', 'PARTNER', 'OTHER']),
  marketingOptIn: z.boolean().default(true),
});

export const LeadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  source: z.enum(['WEBSITE', 'LANDING_PAGE', 'REFERRAL', 'SOCIAL_MEDIA', 'ADS', 'EMAIL', 'SMS', 'WHATSAPP', 'PARTNER', 'EVENT', 'COLD_CALL', 'CHATBOT', 'API', 'OTHER']),
  interest: z.array(z.string()).default([]),
});

export const CampaignSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['PROMOTIONAL', 'TRANSACTIONAL', 'ONBOARDING', 'REACTIVATION', 'WINBACK', 'LOYALTY', 'SEASONAL', 'AUTOMATED']),
  channel: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH_NOTIFICATION', 'IN_APP']),
  content: z.object({
    subject: z.string().optional(),
    body: z.string().min(1),
    templateId: z.string().optional(),
    variables: z.record(z.string()).default({}),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
  }),
  segments: z.array(z.string()).default([]),
});

export const CouponSchema = z.object({
  code: z.string().min(3).max(20),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'BUY_X_GET_Y', 'BOGO']),
  value: z.number().positive(),
  minOrderValue: z.number().nonnegative().optional(),
  usageLimit: z.number().positive().default(100),
  expiresAt: z.string(),
});
