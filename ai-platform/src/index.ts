import { loadConfig, getConfig, AIConfig } from './config';
import { ModelManager } from './models/model-manager';
import { ModelType, BaseModel, PredictionResult, ModelStatus, ModelMetrics, TrainingConfig } from './models/base-model';
import { InferenceService } from './services/inference-service';
import { DataService, DataPoint, Dataset, FeatureTransformation } from './services/data-service';
import { APIHandler, APIResponse } from './api/handler';
import { getRoutes, RouteDefinition } from './api/routes';
import { createLogger } from './utils/logger';

const logger = createLogger('AI-Platform');

export class AIPlatform {
  private static instance: AIPlatform;
  private initialized = false;

  private constructor() {}

  static getInstance(): AIPlatform {
    if (!AIPlatform.instance) {
      AIPlatform.instance = new AIPlatform();
    }
    return AIPlatform.instance;
  }

  async initialize(config?: Partial<AIConfig>): Promise<void> {
    if (this.initialized) {
      logger.warn('AI Platform already initialized');
      return;
    }

    loadConfig(config);
    logger.info('Initializing AI Platform...');
    logger.info(`Config: ${JSON.stringify(getConfig(), null, 2)}`);

    // Initialize core services
    ModelManager.getInstance();
    InferenceService.getInstance();
    DataService.getInstance();
    APIHandler.getInstance();

    this.initialized = true;
    logger.info('AI Platform initialized successfully');
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getModelManager(): ModelManager {
    return ModelManager.getInstance();
  }

  getInferenceService(): InferenceService {
    return InferenceService.getInstance();
  }

  getDataService(): DataService {
    return DataService.getInstance();
  }

  getAPIHandler(): APIHandler {
    return APIHandler.getInstance();
  }

  getAPIRoutes(): RouteDefinition[] {
    return getRoutes();
  }

  getConfig(): AIConfig {
    return getConfig();
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down AI Platform...');
    await this.getModelManager().clear();
    this.getInferenceService().clearCache();
    this.getDataService().clear();
    this.initialized = false;
    logger.info('AI Platform shutdown complete');
  }

  async healthCheck(): Promise<{
    status: string;
    initialized: boolean;
    uptime: number;
    models: { total: number; deployed: number };
  }> {
    const modelManager = this.getModelManager();
    const status = modelManager.getStatus();

    return {
      status: this.initialized ? 'healthy' : 'not_initialized',
      initialized: this.initialized,
      uptime: process.uptime(),
      models: {
        total: status.modelCount,
        deployed: status.deployedCount,
      },
    };
  }
}

// Export all types and classes for external use
export {
  // Config
  loadConfig,
  getConfig,
  AIConfig,

  // Models
  ModelManager,
  ModelType,
  ModelStatus,
  BaseModel,
  PredictionResult,
  ModelMetrics,
  TrainingConfig,

  // Services
  InferenceService,
  DataService,
  DataPoint,
  Dataset,
  FeatureTransformation,

  // API
  APIHandler,
  APIResponse,
  getRoutes,
  RouteDefinition,

  // Utils
  createLogger,
};

// Export default singleton
export default AIPlatform.getInstance();
