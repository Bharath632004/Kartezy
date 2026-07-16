import { ModelManager } from '../models/model-manager';
import { BaseModel, PredictionResult, ModelStatus } from '../models/base-model';
import { createLogger } from '../utils/logger';
import { getConfig } from '../config';

const logger = createLogger('InferenceService');

interface CacheEntry {
  result: PredictionResult<unknown>;
  timestamp: number;
  ttl: number;
}

export class InferenceService {
  private static instance: InferenceService;
  private modelManager: ModelManager;
  private cache: Map<string, CacheEntry> = new Map();
  private predictionHistory: Map<string, number[]> = new Map();

  private constructor() {
    this.modelManager = ModelManager.getInstance();
    logger.info('InferenceService initialized');
  }

  static getInstance(): InferenceService {
    if (!InferenceService.instance) {
      InferenceService.instance = new InferenceService();
    }
    return InferenceService.instance;
  }

  async predict<TInput, TOutput>(
    modelId: string,
    input: TInput,
    options?: Record<string, unknown>
  ): Promise<PredictionResult<TOutput>> {
    const startTime = Date.now();
    const model = this.modelManager.getModel<TInput, TOutput>(modelId);

    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    if (model.metadata.status !== ModelStatus.DEPLOYED) {
      throw new Error(`Model ${modelId} is not deployed (status: ${model.metadata.status})`);
    }

    const cacheKey = this.buildCacheKey(modelId, input);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for model ${modelId}`);
      return cached as PredictionResult<TOutput>;
    }

    const result = model.predict(input, options);
    const latencyMs = Date.now() - startTime;
    result.latencyMs = latencyMs;

    this.addToCache(cacheKey, result);
    this.trackLatency(modelId, latencyMs);

    logger.debug(`Prediction from model ${modelId} took ${latencyMs}ms`);
    return result;
  }

  async predictBatch<TInput, TOutput>(
    modelId: string,
    inputs: TInput[],
    options?: Record<string, unknown>
  ): Promise<PredictionResult<TOutput>[]> {
    const config = getConfig();
    const batches: TInput[][] = [];
    for (let i = 0; i < inputs.length; i += config.inference.maxBatchSize) {
      batches.push(inputs.slice(i, i + config.inference.maxBatchSize));
    }

    const results: PredictionResult<TOutput>[] = [];
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(input => this.predict(modelId, input, options))
      );
      results.push(...batchResults);
    }

    return results;
  }

  async predictWithRetry<TInput, TOutput>(
    modelId: string,
    input: TInput,
    options?: Record<string, unknown>
  ): Promise<PredictionResult<TOutput>> {
    const config = getConfig();
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.inference.retryAttempts; attempt++) {
      try {
        return await this.predict(modelId, input, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.warn(`Prediction attempt ${attempt} failed for model ${modelId}: ${lastError.message}`);
        if (attempt < config.inference.retryAttempts) {
          await this.sleep(Math.pow(2, attempt) * 100);
        }
      }
    }

    throw lastError || new Error(`Prediction failed for model ${modelId} after ${config.inference.retryAttempts} attempts`);
  }

  getLatencyMetrics(modelId: string): { avg: number; p50: number; p95: number; p99: number; count: number } {
    const latencies = this.predictionHistory.get(modelId) || [];
    if (latencies.length === 0) {
      return { avg: 0, p50: 0, p95: 0, p99: 0, count: 0 };
    }

    const sorted = [...latencies].sort((a, b) => a - b);
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return { avg, p50, p95, p99, count: latencies.length };
  }

  clearCache(): void {
    this.cache.clear();
    logger.info('Inference cache cleared');
  }

  clearModelCache(modelId: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(modelId)) {
        this.cache.delete(key);
      }
    }
    logger.info(`Cache cleared for model ${modelId}`);
  }

  private buildCacheKey(modelId: string, input: unknown): string {
    return `${modelId}:${JSON.stringify(input)}`;
  }

  private getFromCache(key: string): PredictionResult<unknown> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return entry.result;
  }

  private addToCache(key: string, result: PredictionResult<unknown>): void {
    const config = getConfig();
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
      ttl: config.inference.cacheTTLSec,
    });
  }

  private trackLatency(modelId: string, latencyMs: number): void {
    if (!this.predictionHistory.has(modelId)) {
      this.predictionHistory.set(modelId, []);
    }
    const history = this.predictionHistory.get(modelId)!;
    history.push(latencyMs);
    if (history.length > 10000) {
      history.shift();
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default InferenceService.getInstance();
