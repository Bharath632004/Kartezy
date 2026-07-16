export interface AIConfig {
  model: {
    path: string;
    cacheSize: number;
    defaultVersion: string;
  };
  inference: {
    maxBatchSize: number;
    timeoutMs: number;
    retryAttempts: number;
    cacheTTLSec: number;
  };
  training: {
    maxEpochs: number;
    learningRate: number;
    validationSplit: number;
    earlyStoppingPatience: number;
  };
  featureStore: {
    redisUrl: string;
    cacheEnabled: boolean;
    batchSize: number;
  };
  monitoring: {
    enabled: boolean;
    metricsIntervalMs: number;
    driftThreshold: number;
    accuracyThreshold: number;
  };
  security: {
    maxRequestSize: number;
    rateLimitPerMin: number;
    encryptionKey: string;
  };
}

const defaultConfig: AIConfig = {
  model: {
    path: process.env.AI_MODEL_PATH || '/models',
    cacheSize: 1000,
    defaultVersion: '1.0.0',
  },
  inference: {
    maxBatchSize: 100,
    timeoutMs: 5000,
    retryAttempts: 3,
    cacheTTLSec: 300,
  },
  training: {
    maxEpochs: 100,
    learningRate: 0.001,
    validationSplit: 0.2,
    earlyStoppingPatience: 10,
  },
  featureStore: {
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    cacheEnabled: true,
    batchSize: 1000,
  },
  monitoring: {
    enabled: true,
    metricsIntervalMs: 60000,
    driftThreshold: 0.1,
    accuracyThreshold: 0.8,
  },
  security: {
    maxRequestSize: 10 * 1024 * 1024,
    rateLimitPerMin: 1000,
    encryptionKey: process.env.ENCRYPTION_KEY || '',
  },
};

let config: AIConfig = { ...defaultConfig };

export function loadConfig(overrides?: Partial<AIConfig>): AIConfig {
  if (overrides) {
    config = {
      ...config,
      ...overrides,
      model: { ...config.model, ...overrides.model },
      inference: { ...config.inference, ...overrides.inference },
      training: { ...config.training, ...overrides.training },
      featureStore: { ...config.featureStore, ...overrides.featureStore },
      monitoring: { ...config.monitoring, ...overrides.monitoring },
      security: { ...config.security, ...overrides.security },
    };
  }
  return config;
}

export function getConfig(): AIConfig {
  if (!config.security.encryptionKey && process.env.NODE_ENV === 'production') {
    console.warn(
      'WARNING: ENCRYPTION_KEY environment variable is not set. ' +
      'Set ENCRYPTION_KEY in your environment or .env file to a strong 256-bit key.'
    );
  }
  return config;
}

export default config;
