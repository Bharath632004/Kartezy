import { InferenceService } from '../services/inference-service';
import { ModelManager } from '../models/model-manager';
import { ModelType } from '../models/base-model';
import { ChatAssistant, AssistantRole, createAssistant } from '../services/chat-assistant';
import { createLogger } from '../utils/logger';

const logger = createLogger('APIHandler');
const inferenceService = InferenceService.getInstance();
const modelManager = ModelManager.getInstance();
const assistants = new Map<AssistantRole, ChatAssistant>();

// Initialize all chat assistants
['customer', 'merchant', 'delivery', 'admin', 'support', 'operations'].forEach(role => {
  assistants.set(role as AssistantRole, createAssistant(role as AssistantRole));
});

export interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string;
  timestamp: string;
  requestId: string;
}

export interface SearchRequest {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  size: number;
  sort?: string;
  userId?: string;
  filters?: Record<string, unknown>;
}

export interface RecommendationRequest {
  userId: string;
  limit: number;
  context?: string;
  excludeIds?: string[];
}

export interface ForecastingRequest {
  productId: string;
  storeId?: string;
  daysAhead: number;
  includeConfidence?: boolean;
}

export interface FraudDetectionRequest {
  transactionId: string;
  amount: number;
  userId: string;
  paymentMethod: string;
  ipAddress?: string;
  deviceFingerprint?: string;
  location?: { lat: number; lng: number };
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface OCRRequest {
  imageBase64: string;
  documentType: 'invoice' | 'receipt' | 'bill' | 'gst' | 'pan' | 'aadhaar' | 'business' | 'kyc' | 'product';
  options?: Record<string, unknown>;
}

export interface NLPRequest {
  text: string;
  language?: string;
  options?: Record<string, unknown>;
}

export interface VoiceRequest {
  audioBase64: string;
  text?: string;
  language?: string;
  voiceId?: string;
  options?: Record<string, unknown>;
}

export interface ChatRequest {
  userId: string;
  message: string;
  role: AssistantRole;
  language?: string;
  orderId?: string;
  storeId?: string;
  deliveryId?: string;
}

export interface CustomerIntelligenceRequest {
  customerId: string;
  mode?: string;
  options?: Record<string, unknown>;
}

export interface MerchantIntelligenceRequest {
  merchantId: string;
  mode?: string;
  options?: Record<string, unknown>;
}

export interface DeliveryIntelligenceRequest {
  referenceId: string;
  mode?: string;
  options?: Record<string, unknown>;
}

export interface PricingRequest {
  productId: string;
  storeId: string;
  userId: string;
  basePrice?: number;
  mode?: string;
}

export interface AnalyticsRequest {
  metric: string;
  timeRange: string;
  mode?: string;
  options?: Record<string, unknown>;
}

export interface CVRequest {
  imageBase64: string;
  imageType: 'product' | 'barcode' | 'shelf' | 'document' | 'general' | 'similarity' | 'duplicate';
  image2Base64?: string;
  options?: Record<string, unknown>;
}

export class APIHandler {
  private static instance: APIHandler;

  private constructor() {
    logger.info('APIHandler initialized with all AI endpoints');
  }

  static getInstance(): APIHandler {
    if (!APIHandler.instance) {
      APIHandler.instance = new APIHandler();
    }
    return APIHandler.instance;
  }

  createResponse<T>(success: boolean, message: string, data: T | null, error?: string): APIResponse<T> {
    return {
      success,
      message,
      data,
      error,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(7),
    };
  }

  // === RECOMMENDATION ENGINE ===
  async handleRecommendation(request: RecommendationRequest): Promise<APIResponse<string[]>> {
    try {
      const models = modelManager.getModelsByType(ModelType.RECOMMENDATION);
      if (models.length === 0) return this.createResponse(false, 'No recommendation models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict<string, string[]>(model.metadata.id, request.userId, {
        limit: request.limit, context: request.context, excludeIds: request.excludeIds,
      });
      return this.createResponse(true, 'Recommendations generated', result.prediction);
    } catch (error) {
      logger.error('Recommendation failed', error);
      return this.createResponse(false, 'Recommendation failed', null, (error as Error).message);
    }
  }

  async handleHomeFeed(request: RecommendationRequest): Promise<APIResponse<Record<string, string[]>>> {
    try {
      const models = modelManager.getModelsByType(ModelType.RECOMMENDATION);
      if (models.length === 0) return this.createResponse(false, 'No recommendation models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict<string, Record<string, string[]>>(model.metadata.id, request.userId, {
        limit: request.limit, context: 'home_feed',
      });
      return this.createResponse(true, 'Home feed generated', result.prediction);
    } catch (error) {
      logger.error('Home feed failed', error);
      return this.createResponse(false, 'Home feed failed', null, (error as Error).message);
    }
  }

  // === SEARCH ===
  async handleSearch(request: SearchRequest): Promise<APIResponse<{ results: unknown[]; total: number }>> {
    try {
      const models = modelManager.getModelsByType(ModelType.SEARCH);
      if (models.length === 0) return this.createResponse(false, 'No search models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, request);
      return this.createResponse(true, 'Search completed', {
        results: result.prediction as unknown[],
        total: (result.prediction as unknown[]).length,
      });
    } catch (error) {
      logger.error('Search failed', error);
      return this.createResponse(false, 'Search failed', null, (error as Error).message);
    }
  }

  async handleAutocomplete(query: string): Promise<APIResponse<string[]>> {
    try {
      const models = modelManager.getModelsByType(ModelType.SEARCH);
      if (models.length === 0) return this.createResponse(false, 'No search models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, { query, page: 0, size: 5 }, { mode: 'autocomplete' });
      return this.createResponse(true, 'Autocomplete generated', (result.prediction as unknown[]) as string[]);
    } catch (error) {
      logger.error('Autocomplete failed', error);
      return this.createResponse(false, 'Autocomplete failed', null, (error as Error).message);
    }
  }

  async handleSpellCheck(query: string): Promise<APIResponse<{ original: string; corrected: string }>> {
    try {
      const models = modelManager.getModelsByType(ModelType.SEARCH);
      if (models.length === 0) return this.createResponse(false, 'No search models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, { query, page: 0, size: 1 }, { mode: 'spellcheck' });
      return this.createResponse(true, 'Spell check completed', result.prediction as { original: string; corrected: string });
    } catch (error) {
      logger.error('Spell check failed', error);
      return this.createResponse(false, 'Spell check failed', null, (error as Error).message);
    }
  }

  // === FORECASTING ===
  async handleForecasting(request: ForecastingRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.FORECASTING);
      if (models.length === 0) return this.createResponse(false, 'No forecasting models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, request.productId, {
        storeId: request.storeId, daysAhead: request.daysAhead, includeConfidence: request.includeConfidence,
      });
      return this.createResponse(true, 'Forecast generated', result.prediction);
    } catch (error) {
      logger.error('Forecasting failed', error);
      return this.createResponse(false, 'Forecasting failed', null, (error as Error).message);
    }
  }

  async handleInventoryForecast(request: ForecastingRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.FORECASTING);
      if (models.length === 0) return this.createResponse(false, 'No forecasting models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, request.productId, {
        forecastType: 'inventory', storeId: request.storeId, daysAhead: request.daysAhead,
      });
      return this.createResponse(true, 'Inventory forecast generated', result.prediction);
    } catch (error) {
      logger.error('Inventory forecast failed', error);
      return this.createResponse(false, 'Inventory forecast failed', null, (error as Error).message);
    }
  }

  // === FRAUD DETECTION ===
  async handleFraudDetection(request: FraudDetectionRequest): Promise<APIResponse<{
    isFraudulent: boolean; fraudScore: number; reasons: string[]; recommendedAction: string;
  }>> {
    try {
      const models = modelManager.getModelsByType(ModelType.FRAUD_DETECTION);
      if (models.length === 0) return this.createResponse(false, 'No fraud detection models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, request, { checkType: 'order' });
      return this.createResponse(true, 'Fraud check completed', result.prediction as {
        isFraudulent: boolean; fraudScore: number; reasons: string[]; recommendedAction: string;
      });
    } catch (error) {
      logger.error('Fraud detection failed', error);
      return this.createResponse(false, 'Fraud detection failed', null, (error as Error).message);
    }
  }

  // === OCR ===
  async handleOCR(request: OCRRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.COMPUTER_VISION);
      if (models.length === 0) return this.createResponse(false, 'No CV/OCR models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, {
        imageBase64: request.imageBase64, imageType: 'document',
      }, { documentType: request.documentType, options: request.options });
      return this.createResponse(true, 'OCR completed', result.prediction);
    } catch (error) {
      logger.error('OCR failed', error);
      return this.createResponse(false, 'OCR failed', null, (error as Error).message);
    }
  }

  // === NLP ===
  async handleNLP(request: NLPRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.NLP);
      if (models.length === 0) return this.createResponse(false, 'No NLP models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, request.text, {
        mode: (request.options?.mode as string) || 'sentiment', language: request.language,
      });
      return this.createResponse(true, 'NLP processing completed', result.prediction);
    } catch (error) {
      logger.error('NLP failed', error);
      return this.createResponse(false, 'NLP processing failed', null, (error as Error).message);
    }
  }

  // === VOICE ===
  async handleVoice(request: VoiceRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.VOICE);
      if (models.length === 0) return this.createResponse(false, 'No voice AI models deployed', null, 'NO_MODELS');
      const model = models[0];
      const mode = request.text ? 'command' : 'stt';
      const result = await inferenceService.predict(model.metadata.id, request.audioBase64, {
        mode, language: request.language, voiceId: request.voiceId, text: request.text, userId: (request.options?.userId as string) || '',
      });
      return this.createResponse(true, 'Voice processing completed', result.prediction);
    } catch (error) {
      logger.error('Voice processing failed', error);
      return this.createResponse(false, 'Voice processing failed', null, (error as Error).message);
    }
  }

  // === PRICING ===
  async handlePricing(request: PricingRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.PRICING);
      if (models.length === 0) return this.createResponse(false, 'No pricing models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, request, { mode: request.mode || 'price' });
      return this.createResponse(true, 'Price calculated', result.prediction);
    } catch (error) {
      logger.error('Pricing failed', error);
      return this.createResponse(false, 'Pricing failed', null, (error as Error).message);
    }
  }

  // === CUSTOMER INTELLIGENCE ===
  async handleCustomerIntelligence(request: CustomerIntelligenceRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.CUSTOMER_INTELLIGENCE);
      if (models.length === 0) return this.createResponse(false, 'No customer intelligence models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, request.customerId, {
        mode: request.mode || 'profile', options: request.options,
      });
      return this.createResponse(true, 'Customer intelligence retrieved', result.prediction);
    } catch (error) {
      logger.error('Customer intelligence failed', error);
      return this.createResponse(false, 'Customer intelligence failed', null, (error as Error).message);
    }
  }

  // === MERCHANT INTELLIGENCE ===
  async handleMerchantIntelligence(request: MerchantIntelligenceRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.MERCHANT_INTELLIGENCE);
      if (models.length === 0) return this.createResponse(false, 'No merchant intelligence models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, request.merchantId, {
        mode: request.mode || 'dashboard', options: request.options,
      });
      return this.createResponse(true, 'Merchant intelligence retrieved', result.prediction);
    } catch (error) {
      logger.error('Merchant intelligence failed', error);
      return this.createResponse(false, 'Merchant intelligence failed', null, (error as Error).message);
    }
  }

  // === DELIVERY INTELLIGENCE ===
  async handleDeliveryIntelligence(request: DeliveryIntelligenceRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.DELIVERY_INTELLIGENCE);
      if (models.length === 0) return this.createResponse(false, 'No delivery intelligence models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, request.referenceId, {
        mode: request.mode || 'eta', options: request.options,
      });
      return this.createResponse(true, 'Delivery intelligence retrieved', result.prediction);
    } catch (error) {
      logger.error('Delivery intelligence failed', error);
      return this.createResponse(false, 'Delivery intelligence failed', null, (error as Error).message);
    }
  }

  // === ANALYTICS / BI ===
  async handleAnalytics(request: AnalyticsRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.ANALYTICS);
      if (models.length === 0) return this.createResponse(false, 'No analytics models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, { metric: request.metric, timeRange: request.timeRange }, {
        mode: request.mode || 'business', options: request.options,
      });
      return this.createResponse(true, 'Analytics generated', result.prediction);
    } catch (error) {
      logger.error('Analytics failed', error);
      return this.createResponse(false, 'Analytics failed', null, (error as Error).message);
    }
  }

  // === COMPUTER VISION ===
  async handleComputerVision(request: CVRequest): Promise<APIResponse<unknown>> {
    try {
      const models = modelManager.getModelsByType(ModelType.COMPUTER_VISION);
      if (models.length === 0) return this.createResponse(false, 'No CV models deployed', null, 'NO_MODELS');
      const model = models[0];
      const result = await inferenceService.predict(model.metadata.id, request, {
        imageType: request.imageType, image2Base64: request.image2Base64,
      });
      return this.createResponse(true, 'Computer vision processing completed', result.prediction);
    } catch (error) {
      logger.error('Computer vision failed', error);
      return this.createResponse(false, 'Computer vision failed', null, (error as Error).message);
    }
  }

  // === CHAT ASSISTANTS ===
  async handleChat(request: ChatRequest): Promise<APIResponse<unknown>> {
    try {
      const assistant = assistants.get(request.role) || assistants.get('customer')!;
      const context = {
        userId: request.userId,
        role: request.role,
        language: request.language,
        orderId: request.orderId,
        storeId: request.storeId,
        deliveryId: request.deliveryId,
      };
      const response = await assistant.getResponse(context, request.message);
      return this.createResponse(true, 'Chat response generated', response);
    } catch (error) {
      logger.error('Chat failed', error);
      return this.createResponse(false, 'Chat failed', null, (error as Error).message);
    }
  }

  async handleChatHistory(userId: string, role: AssistantRole): Promise<APIResponse<unknown>> {
    try {
      const assistant = assistants.get(role) || assistants.get('customer')!;
      const history = assistant.getConversationHistory(userId);
      return this.createResponse(true, 'History retrieved', history);
    } catch (error) {
      logger.error('Chat history failed', error);
      return this.createResponse(false, 'Chat history failed', null, (error as Error).message);
    }
  }

  // === STATUS ===
  async handleModelStatus(): Promise<APIResponse<{
    totalModels: number; deployedModels: number; modelsByType: Record<string, number>;
  }>> {
    const models = modelManager.listModels();
    const modelsByType: Record<string, number> = {};
    for (const model of models) {
      modelsByType[model.type] = (modelsByType[model.type] || 0) + 1;
    }
    const status = modelManager.getStatus();
    return this.createResponse(true, 'Model status retrieved', {
      totalModels: status.modelCount,
      deployedModels: status.deployedCount,
      modelsByType,
    });
  }

  async healthCheck(): Promise<APIResponse<{ status: string; uptime: number; modelCount: number }>> {
    const status = modelManager.getStatus();
    return this.createResponse(true, 'AI Platform is healthy', {
      status: 'healthy',
      uptime: process.uptime(),
      modelCount: status.modelCount,
    });
  }
}

export default APIHandler.getInstance();
