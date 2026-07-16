import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '../utils/logger';

const logger = createLogger('BaseModel');

export enum ModelStatus {
  CREATED = 'CREATED',
  TRAINING = 'TRAINING',
  TRAINED = 'TRAINED',
  DEPLOYED = 'DEPLOYED',
  FAILED = 'FAILED',
  ARCHIVED = 'ARCHIVED',
  ROLLED_BACK = 'ROLLED_BACK',
}

export enum ModelType {
  RECOMMENDATION = 'RECOMMENDATION',
  SEARCH = 'SEARCH',
  FORECASTING = 'FORECASTING',
  PRICING = 'PRICING',
  FRAUD_DETECTION = 'FRAUD_DETECTION',
  COMPUTER_VISION = 'COMPUTER_VISION',
  NLP = 'NLP',
  VOICE = 'VOICE',
  CUSTOMER_INTELLIGENCE = 'CUSTOMER_INTELLIGENCE',
  MERCHANT_INTELLIGENCE = 'MERCHANT_INTELLIGENCE',
  DELIVERY_INTELLIGENCE = 'DELIVERY_INTELLIGENCE',
  ANALYTICS = 'ANALYTICS',
}

export interface ModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  mae?: number;
  rmse?: number;
  mape?: number;
  latencyMs?: number;
  [key: string]: number | undefined;
}

export interface ModelVersion {
  version: string;
  status: ModelStatus;
  createdAt: Date;
  metrics: ModelMetrics;
  modelPath?: string;
  description?: string;
}

export interface TrainingConfig {
  epochs: number;
  learningRate: number;
  batchSize: number;
  validationSplit: number;
  earlyStoppingPatience: number;
  features?: string[];
  hyperparameters?: Record<string, number | string | boolean>;
}

export interface PredictionResult<T = unknown> {
  prediction: T;
  confidence: number;
  modelVersion: string;
  latencyMs: number;
  features?: Record<string, number>;
  explanations?: Record<string, number>;
}

export interface ModelMetadata {
  id: string;
  name: string;
  type: ModelType;
  description: string;
  status: ModelStatus;
  currentVersion: string;
  versions: ModelVersion[];
  createdAt: Date;
  updatedAt: Date;
  inputSchema?: Record<string, string>;
  outputSchema?: Record<string, string>;
}

export abstract class BaseModel<TInput, TOutput> {
  readonly metadata: ModelMetadata;

  protected constructor(
    name: string,
    type: ModelType,
    description: string,
    inputSchema?: Record<string, string>,
    outputSchema?: Record<string, string>
  ) {
    this.metadata = {
      id: uuidv4(),
      name,
      type,
      description,
      status: ModelStatus.CREATED,
      currentVersion: '0.0.1',
      versions: [{
        version: '0.0.1',
        status: ModelStatus.CREATED,
        createdAt: new Date(),
        metrics: {},
        description: 'Initial version',
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
      inputSchema,
      outputSchema,
    };
    logger.info(`Created model: ${name} (${type})`);
  }

  abstract predict(input: TInput, options?: Record<string, unknown>): PredictionResult<TOutput>;

  abstract train(data: TInput[], config: TrainingConfig): Promise<ModelMetrics>;

  abstract validate(data: TInput[]): Promise<ModelMetrics>;

  abstract getFeatureImportance(): Record<string, number>;

  getMetadata(): ModelMetadata {
    return { ...this.metadata };
  }

  getStatus(): ModelStatus {
    return this.metadata.status;
  }

  setStatus(status: ModelStatus): void {
    this.metadata.status = status;
    this.metadata.updatedAt = new Date();
    logger.info(`Model ${this.metadata.name} status -> ${status}`);
  }

  addVersion(version: string, metrics: ModelMetrics, description?: string): void {
    this.metadata.versions.push({
      version,
      status: ModelStatus.TRAINED,
      createdAt: new Date(),
      metrics,
      description,
    });
    this.metadata.currentVersion = version;
    this.metadata.updatedAt = new Date();
  }

  rollbackToVersion(version: string): boolean {
    const idx = this.metadata.versions.findIndex(v => v.version === version);
    if (idx === -1) {
      logger.warn(`Version ${version} not found for model ${this.metadata.name}`);
      return false;
    }
    this.metadata.currentVersion = version;
    this.metadata.status = ModelStatus.ROLLED_BACK;
    this.metadata.updatedAt = new Date();
    logger.info(`Model ${this.metadata.name} rolled back to version ${version}`);
    return true;
  }

  protected validateInput(input: TInput): boolean {
    if (input === null || input === undefined) {
      throw new Error(`Invalid input: input is null or undefined for model ${this.metadata.name}`);
    }
    return true;
  }

  protected validateTrainingData(data: TInput[]): boolean {
    if (!data || data.length === 0) {
      throw new Error(`Training data is empty for model ${this.metadata.name}`);
    }
    return true;
  }

  dispose(): void {
    logger.info(`Disposing model: ${this.metadata.name}`);
    this.metadata.status = ModelStatus.ARCHIVED;
    this.metadata.updatedAt = new Date();
  }
}
