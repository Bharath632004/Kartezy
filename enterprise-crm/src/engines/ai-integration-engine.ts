/**
 * Kartezy Enterprise CRM — AI Platform Integration Engine
 *
 * Integration layer between Enterprise CRM and the AI Platform.
 * Uses the Dependency Injection pattern: the AI Platform model is
 * injected at initialization time by the application composition root.
 *
 * This keeps the CRM decoupled from the AI Platform at compile time
 * while allowing full AI integration at runtime. The engine provides
 * local computation as a built-in fallback.
 *
 * The CRM Core passes in the AI Platform's CustomerIntelligenceModel
 * instance during initialization. If no model is provided, the engine
 * falls back to local intelligence computation.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo } from '../utils/helpers';
import type {
  AIModelPrediction, CustomerIntelligence, CustomerProfile, ChannelType,
} from '../types';

const logger = createLogger('AIIntegrationEngine');

// ── AI Platform Model Interface ──
// This interface defines the contract that any AI Platform model
// must satisfy. The CRM remains decoupled from the AI Platform
// package at compile time.

export interface AIPlatformModel {
  predict(input: { customerId: string; segment?: string }, options?: { mode?: string }): {
    prediction: unknown;
    confidence: number;
    modelVersion: string;
    latencyMs: number;
  };
  getFeatureImportance(): Record<string, number>;
  getMetadata(): {
    id: string;
    name: string;
    currentVersion: string;
    status: string;
  };
  dispose(): void;
}

export class AIIntegrationEngine {
  private static instance: AIIntegrationEngine;
  private predictions: Map<string, AIModelPrediction> = new Map();
  private intelligenceCache: Map<string, CustomerIntelligence & { expiresAt: string }> = new Map();
  private model: AIPlatformModel | null = null;
  private modelReady = false;

  static getInstance(): AIIntegrationEngine {
    if (!AIIntegrationEngine.instance) {
      AIIntegrationEngine.instance = new AIIntegrationEngine();
    }
    return AIIntegrationEngine.instance;
  }

  /**
   * Initialize with optional AI Platform model.
   * The model should be an instance of CustomerIntelligenceModel
   * from @kartezy/ai-platform, wrapped to satisfy AIPlatformModel.
   * 
   * @param model - Optional AI Platform model instance
   */
  initialize(model?: AIPlatformModel): void {
    if (model) {
      this.model = model;
      this.modelReady = true;
      logger.info('AI Platform CustomerIntelligenceModel injected successfully');
    } else {
      this.modelReady = false;
      logger.info('No AI Platform model provided, using local intelligence computation');
    }
  }

  // ── Customer Intelligence ──

  /**
   * Get comprehensive customer intelligence using the AI Platform
   * model (mode='profile'), falling back to local computation.
   * Results are cached with 1-hour TTL.
   */
  async getCustomerIntelligence(customerProfile: CustomerProfile): Promise<CustomerIntelligence> {
    const cacheKey = customerProfile.id;
    const cached = this.intelligenceCache.get(cacheKey);
    if (cached && cached.expiresAt > new Date().toISOString()) {
      return cached;
    }

    let intelligence: CustomerIntelligence;

    if (this.modelReady && this.model) {
      try {
        const result = this.model.predict(
          { customerId: customerProfile.id, segment: customerProfile.tier },
          { mode: 'profile' }
        );

        const profile = result.prediction as Record<string, unknown>;

        intelligence = {
          lifetimeValue: (profile.lifetimeValue as number) || customerProfile.lifetimeValue,
          churnProbability: (profile.churnProbability as number) || 0,
          churnRisk: ((profile.churnProbability as number) || 0) > 0.3 ? 'HIGH' :
                     ((profile.churnProbability as number) || 0) > 0.15 ? 'MEDIUM' : 'LOW',
          nextBestAction: (profile.nextBestAction as string) || 'Continue engagement',
          recommendedSegment: (profile.customerSegment as string) || 'GENERAL',
          recommendedOffer: this.generateRecommendedOffer(profile),
          preferredChannel: this.determinePreferredChannel(customerProfile),
          optimalSendTime: '10:00',
          productRecommendations: (profile.preferredCategories as string[]) || customerProfile.preferredCategories,
          engagementScore: (profile.engagementScore as number) || this.calculateEngagementScore(customerProfile),
        };

        this.recordPrediction({
          modelName: 'CustomerIntelligenceModel',
          predictionType: 'profile',
          input: { customerId: customerProfile.id, segment: customerProfile.tier },
          output: { ...profile, confidence: result.confidence, modelVersion: result.modelVersion },
          confidence: result.confidence,
        });

        logger.debug(`AI prediction for ${customerProfile.id}: conf=${roundTo(result.confidence, 3)}, latency=${result.latencyMs}ms`);
      } catch (modelError) {
        logger.error('AI model prediction failed, using fallback', { error: modelError });
        intelligence = this.computeLocalIntelligence(customerProfile);
      }
    } else {
      intelligence = this.computeLocalIntelligence(customerProfile);
      this.recordPrediction({
        modelName: 'customer-intelligence-fallback',
        predictionType: 'full_profile',
        input: { customerId: customerProfile.id, segment: customerProfile.tier },
        output: intelligence as unknown as Record<string, unknown>,
        confidence: 0.75,
      });
    }

    this.intelligenceCache.set(cacheKey, {
      ...intelligence,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    return intelligence;
  }

  /**
   * Predict churn risk using AI Platform's churn mode or fallback.
   */
  async predictChurn(customerId: string, profile: CustomerProfile): Promise<{
    probability: number; riskLevel: string; riskFactors: string[];
    recommendedAction: string;
  }> {
    if (this.modelReady && this.model) {
      try {
        const result = this.model.predict({ customerId }, { mode: 'churn' });
        const churn = result.prediction as Record<string, unknown>;

        this.recordPrediction({
          modelName: 'CustomerIntelligenceModel',
          predictionType: 'churn',
          input: { customerId },
          output: churn,
          confidence: result.confidence,
        });

        return {
          probability: (churn.churnProbability as number) || 0,
          riskLevel: (churn.riskLevel as string) || 'LOW',
          riskFactors: (churn.riskFactors as string[]) || [],
          recommendedAction: (churn.recommendedAction as string) || 'MAINTAIN_ENGAGEMENT',
        };
      } catch (err) {
        logger.error('Churn prediction failed, using fallback', { error: err });
      }
    }

    const intelligence = await this.getCustomerIntelligence(profile);
    const factors: string[] = [];

    if (!profile.lastPurchaseDate) factors.push('Never purchased');
    else {
      const days = Math.floor((Date.now() - new Date(profile.lastPurchaseDate).getTime()) / 86400000);
      if (days > 60) factors.push(`Inactive for ${days} days`);
    }
    if (profile.totalOrders === 0) factors.push('No orders placed');
    if (profile.totalOrders === 0 || (profile.lastPurchaseDate && this.daysSince(profile.lastPurchaseDate) > 30)) {
      factors.push('Low engagement');
    }

    return {
      probability: intelligence.churnProbability,
      riskLevel: intelligence.churnRisk,
      riskFactors: factors,
      recommendedAction: intelligence.nextBestAction,
    };
  }

  async predictCLV(customerId: string): Promise<{
    predictedLifetimeValue: number;
    confidence: number;
    timeHorizonMonths: number;
  }> {
    if (this.modelReady && this.model) {
      try {
        const result = this.model.predict({ customerId }, { mode: 'clv' });
        const clv = result.prediction as Record<string, unknown>;

        this.recordPrediction({
          modelName: 'CustomerIntelligenceModel',
          predictionType: 'clv',
          input: { customerId },
          output: clv,
          confidence: result.confidence,
        });

        return {
          predictedLifetimeValue: (clv.predictedLifetimeValue as number) || 0,
          confidence: (clv.confidence as number) || result.confidence,
          timeHorizonMonths: (clv.timeHorizonMonths as number) || 24,
        };
      } catch { /* fall through */ }
    }
    return { predictedLifetimeValue: 0, confidence: 0, timeHorizonMonths: 24 };
  }

  async predictNextPurchase(customerId: string): Promise<{
    expectedPurchaseDate: string;
    predictedCategory: string;
    predictedAmount: number;
    confidence: number;
  }> {
    if (this.modelReady && this.model) {
      try {
        const result = this.model.predict({ customerId }, { mode: 'purchase' });
        const purchase = result.prediction as Record<string, unknown>;

        this.recordPrediction({
          modelName: 'CustomerIntelligenceModel',
          predictionType: 'purchase',
          input: { customerId },
          output: purchase,
          confidence: result.confidence,
        });

        return {
          expectedPurchaseDate: (purchase.expectedPurchaseDate as string) || '',
          predictedCategory: (purchase.predictedCategory as string) || '',
          predictedAmount: (purchase.predictedAmount as number) || 0,
          confidence: (purchase.confidence as number) || result.confidence,
        };
      } catch { /* fall through */ }
    }
    return { expectedPurchaseDate: '', predictedCategory: '', predictedAmount: 0, confidence: 0 };
  }

  async getSegmentProbabilities(customerId: string): Promise<Array<{
    segment: string; probability: number; description: string;
  }>> {
    if (this.modelReady && this.model) {
      try {
        const result = this.model.predict({ customerId }, { mode: 'segments' });
        return result.prediction as Array<{
          segment: string; probability: number; description: string;
        }>;
      } catch { /* fall through */ }
    }
    return [];
  }

  async getEngagementScore(customerId: string): Promise<{
    engagementScore: number; level: string; components: Record<string, unknown>;
  }> {
    if (this.modelReady && this.model) {
      try {
        const result = this.model.predict({ customerId }, { mode: 'engagement' });
        const eng = result.prediction as Record<string, unknown>;
        return {
          engagementScore: (eng.engagementScore as number) || 0,
          level: (eng.level as string) || 'LOW',
          components: (eng.components as Record<string, unknown>) || {},
        };
      } catch { /* fall through */ }
    }
    return { engagementScore: 0, level: 'LOW', components: {} };
  }

  // ── CRM-specific AI Features ──

  async predictNextBestAction(customerId: string, profile: CustomerProfile): Promise<{
    action: string; channel: ChannelType; confidence: number;
  }> {
    const intelligence = await this.getCustomerIntelligence(profile);
    return {
      action: intelligence.nextBestAction,
      channel: intelligence.preferredChannel,
      confidence: 0.75 + (profile.totalOrders > 0 ? 0.1 : 0),
    };
  }

  async personalizeOffer(customerProfile: CustomerProfile): Promise<{
    offerType: string; discountPercent: number; expiresInDays: number;
    personalizedMessage: string;
  }> {
    const intelligence = await this.getCustomerIntelligence(customerProfile);
    let discountPercent = 5;
    let offerType = 'Standard';
    let message = `Hi ${customerProfile.firstName}, check out our latest offers!`;

    if (intelligence.churnRisk === 'HIGH') {
      discountPercent = 20;
      offerType = 'Win-back';
      message = `${customerProfile.firstName}, we miss you! Here's 20% off your next order.`;
    } else if (customerProfile.lifetimeValue > 10000) {
      discountPercent = 15;
      offerType = 'VIP Exclusive';
      message = `${customerProfile.firstName}, enjoy this exclusive VIP offer: 15% off!`;
    } else if (customerProfile.totalOrders === 0) {
      discountPercent = 10;
      offerType = 'Welcome';
      message = `Welcome ${customerProfile.firstName}! Enjoy 10% off your first order.`;
    }

    return { offerType, discountPercent, expiresInDays: 7, personalizedMessage: message };
  }

  async optimalSendTime(customerId: string): Promise<string> {
    if (this.modelReady && this.model) {
      try {
        const result = this.model.predict({ customerId }, { mode: 'engagement' });
        const eng = result.prediction as Record<string, unknown>;
        const components = eng.components as Record<string, unknown> | undefined;
        if (components?.appOpens !== undefined) {
          const hour = Math.round(8 + Number(components.appOpens) * 12);
          return `${String(hour).padStart(2, '0')}:00`;
        }
      } catch { /* fall through */ }
    }
    return `${String(10 + Math.floor(Math.random() * 8)).padStart(2, '0')}:00`;
  }

  async getProductRecommendations(customerProfile: CustomerProfile, count: number = 5): Promise<string[]> {
    const intelligence = await this.getCustomerIntelligence(customerProfile);
    const recommendations = [...intelligence.productRecommendations];
    if (customerProfile.preferredCategories.length > 0) {
      recommendations.push(...customerProfile.preferredCategories.map(c => `Top picks in ${c}`));
    }
    return recommendations.slice(0, count);
  }

  getFeatureImportance(): Record<string, number> {
    if (this.modelReady && this.model) {
      try { return this.model.getFeatureImportance(); } catch { /* fall through */ }
    }
    return {
      purchaseHistory: 0.30, engagementMetrics: 0.20, categoryAffinity: 0.15,
      brandAffinity: 0.10, demographics: 0.10, recencyFrequencyMonetary: 0.15,
    };
  }

  getModelMetadata() {
    if (this.modelReady && this.model) {
      try { return this.model.getMetadata(); } catch { /* fall through */ }
    }
    return null;
  }

  // ── Fallback Local Computation ──

  private computeLocalIntelligence(profile: CustomerProfile): CustomerIntelligence {
    const ltv = profile.lifetimeValue || 0;
    const daysSincePurchase = profile.lastPurchaseDate
      ? this.daysSince(profile.lastPurchaseDate) : 999;
    const daysSinceInteraction = profile.lastInteractionDate
      ? this.daysSince(profile.lastInteractionDate) : 999;

    const churnProb = Math.min(
      (daysSincePurchase > 90 ? 0.5 : daysSincePurchase > 30 ? 0.2 : 0.05) +
      (profile.totalOrders === 0 ? 0.3 : 0), 0.95
    );
    const churnRisk = churnProb > 0.4 ? 'HIGH' : churnProb > 0.2 ? 'MEDIUM' : 'LOW';

    let nextBestAction = 'Send welcome email';
    if (daysSincePurchase > 30 && profile.totalOrders === 0) nextBestAction = 'Send re-engagement offer';
    else if (daysSincePurchase > 14) nextBestAction = 'Recommend popular products';
    else if (profile.totalOrders === 1) nextBestAction = 'Encourage second purchase';
    else if (ltv > 10000) nextBestAction = 'VIP exclusive offer';

    return {
      lifetimeValue: ltv,
      churnProbability: roundTo(churnProb, 2),
      churnRisk,
      nextBestAction,
      recommendedSegment: ltv > 10000 ? 'HIGH_VALUE' : profile.totalOrders > 5 ? 'REGULAR' : 'GROWTH',
      recommendedOffer: churnRisk === 'HIGH' ? '20% discount' : ltv > 10000 ? 'Free delivery' : '100 bonus points',
      preferredChannel: this.determinePreferredChannel(profile),
      optimalSendTime: '10:00',
      productRecommendations: profile.preferredCategories.length > 0
        ? profile.preferredCategories.slice(0, 3) : ['Popular Products'],
      engagementScore: this.calculateEngagementScore(profile),
    };
  }

  // ── Helpers ──

  private determinePreferredChannel(profile: CustomerProfile): ChannelType {
    return profile.emailOptIn ? 'EMAIL' :
      profile.whatsappOptIn ? 'WHATSAPP' :
      profile.smsOptIn ? 'SMS' : 'PUSH_NOTIFICATION';
  }

  private calculateEngagementScore(profile: CustomerProfile): number {
    return roundTo(Math.min(
      (profile.totalOrders * 0.1) +
      (profile.lifetimeValue > 0 ? Math.min(profile.lifetimeValue / 10000, 0.5) : 0), 1
    ), 2);
  }

  private generateRecommendedOffer(aiProfile: Record<string, unknown>): string {
    const churnProb = (aiProfile.churnProbability as number) || 0;
    const ltv = (aiProfile.lifetimeValue as number) || 0;
    if (churnProb > 0.3) return '20% discount';
    if (ltv > 10000) return 'Free delivery';
    return '100 bonus points';
  }

  private daysSince(date: string): number {
    return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  }

  // ── Prediction Tracking ──

  private recordPrediction(prediction: {
    modelName: string; predictionType: string;
    input: Record<string, unknown>; output: Record<string, unknown>;
    confidence: number;
  }): void {
    this.predictions.set(generateId('AIP'), {
      modelName: prediction.modelName,
      predictionType: prediction.predictionType,
      input: prediction.input,
      output: prediction.output,
      confidence: prediction.confidence,
      timestamp: new Date().toISOString(),
    });
  }

  getPredictionHistory(modelName?: string): AIModelPrediction[] {
    let list = Array.from(this.predictions.values());
    if (modelName) list = list.filter(p => p.modelName === modelName);
    return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 100);
  }

  isModelReady(): boolean {
    return this.modelReady;
  }

  reset(): void {
    if (this.modelReady && this.model) {
      try {
        this.model.dispose();
      } catch { /* cleanup */ }
    }
    this.model = null;
    this.modelReady = false;
    this.predictions.clear();
    this.intelligenceCache.clear();
  }
}

export default AIIntegrationEngine.getInstance();
