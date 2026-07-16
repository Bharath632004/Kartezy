import { BaseModel, ModelMetadata, ModelStatus, ModelType, ModelMetrics } from './base-model';
import { createLogger } from '../utils/logger';
import { getConfig } from '../config';

const logger = createLogger('ModelManager');

export class ModelManager {
  private static instance: ModelManager;
  private models: Map<string, BaseModel<unknown, unknown>> = new Map();
  private modelRegistry: Map<string, ModelMetadata> = new Map();

  private constructor() {
    logger.info('ModelManager initialized');
  }

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  register<TInput, TOutput>(model: BaseModel<TInput, TOutput>): void {
    const id = model.metadata.id;
    if (this.models.has(id)) {
      logger.warn(`Model ${model.metadata.name} already registered, overwriting`);
    }
    this.models.set(id, model as BaseModel<unknown, unknown>);
    this.modelRegistry.set(id, model.metadata);
    logger.info(`Registered model: ${model.metadata.name} (${model.metadata.type})`);
  }

  unregister(modelId: string): boolean {
    const model = this.models.get(modelId);
    if (model) {
      model.dispose();
      this.models.delete(modelId);
      this.modelRegistry.delete(modelId);
      logger.info(`Unregistered model: ${modelId}`);
      return true;
    }
    return false;
  }

  getModel<TInput, TOutput>(modelId: string): BaseModel<TInput, TOutput> | undefined {
    return this.models.get(modelId) as BaseModel<TInput, TOutput> | undefined;
  }

  getModelByName<TInput, TOutput>(name: string): BaseModel<TInput, TOutput> | undefined {
    for (const model of this.models.values()) {
      if (model.metadata.name === name) {
        return model as BaseModel<TInput, TOutput>;
      }
    }
    return undefined;
  }

  getModelsByType<TInput, TOutput>(type: ModelType): BaseModel<TInput, TOutput>[] {
    const result: BaseModel<TInput, TOutput>[] = [];
    for (const model of this.models.values()) {
      if (model.metadata.type === type) {
        result.push(model as BaseModel<TInput, TOutput>);
      }
    }
    return result;
  }

  listModels(): ModelMetadata[] {
    return Array.from(this.modelRegistry.values());
  }

  listModelsByType(type: ModelType): ModelMetadata[] {
    return this.listModels().filter(m => m.type === type);
  }

  getModelMetadata(modelId: string): ModelMetadata | undefined {
    return this.modelRegistry.get(modelId);
  }

  deployModel(modelId: string): boolean {
    const model = this.models.get(modelId);
    if (!model) {
      logger.error(`Model ${modelId} not found for deployment`);
      return false;
    }
    if (model.metadata.status !== ModelStatus.TRAINED) {
      logger.error(`Model ${modelId} status is ${model.metadata.status}, cannot deploy`);
      return false;
    }
    model.setStatus(ModelStatus.DEPLOYED);
    return true;
  }

  rollbackModel(modelId: string, version: string): boolean {
    const model = this.models.get(modelId);
    if (!model) {
      logger.error(`Model ${modelId} not found for rollback`);
      return false;
    }
    return model.rollbackToVersion(version);
  }

  async evaluateModel(modelId: string, testData: unknown[]): Promise<ModelMetrics> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }
    return model.validate(testData as never[]);
  }

  async getFeatureImportance(modelId: string): Promise<Record<string, number>> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }
    return model.getFeatureImportance();
  }

  getStatus(): { modelCount: number; deployedCount: number; trainingCount: number; failedCount: number } {
    let deployedCount = 0;
    let trainingCount = 0;
    let failedCount = 0;

    for (const model of this.models.values()) {
      switch (model.metadata.status) {
        case ModelStatus.DEPLOYED:
          deployedCount++;
          break;
        case ModelStatus.TRAINING:
          trainingCount++;
          break;
        case ModelStatus.FAILED:
          failedCount++;
          break;
      }
    }

    return {
      modelCount: this.models.size,
      deployedCount,
      trainingCount,
      failedCount,
    };
  }

  async clear(): Promise<void> {
    for (const [id] of this.models) {
      this.unregister(id);
    }
    logger.info('ModelManager cleared');
  }
}

export default ModelManager.getInstance();
