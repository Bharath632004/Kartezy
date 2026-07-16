/**
 * Kartezy Enterprise BI Platform - Configuration
 */

export interface BIConfig {
  platform: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  warehouse: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    schema: string;
    poolSize: number;
    connectionTimeoutMs: number;
  };
  dataLake: {
    storagePath: string;
    retentionDays: number;
    compressionEnabled: boolean;
    partitionByDate: boolean;
  };
  cache: {
    host: string;
    port: number;
    ttlSeconds: number;
    enabled: boolean;
  };
  kafka: {
    brokers: string[];
    consumerGroup: string;
    topics: {
      orderEvents: string;
      paymentEvents: string;
      deliveryEvents: string;
      userEvents: string;
      inventoryEvents: string;
      marketingEvents: string;
    };
  };
  elasticsearch: {
    node: string;
    indexPrefix: string;
    maxResultWindow: number;
  };
  ai: {
    baseUrl: string;
    apiKey: string;
    timeoutMs: number;
  };
  bi: {
    powerBi: {
      workspaceId: string;
      tenantId: string;
      clientId: string;
      clientSecret: string;
    };
    looker: {
      baseUrl: string;
      clientId: string;
      clientSecret: string;
    };
    metabase: {
      baseUrl: string;
      apiKey: string;
    };
    superset: {
      baseUrl: string;
      username: string;
      password: string;
    };
  };
  reports: {
    outputPath: string;
    maxRowsPerExport: number;
    pdf: {
      pageSize: 'A4' | 'Letter' | 'A3';
      orientation: 'portrait' | 'landscape';
      fontFamily: string;
    };
    excel: {
      sheetSize: number;
      useCharts: boolean;
    };
  };
  sync: {
    intervalMs: number;
    batchSize: number;
    retryAttempts: number;
  };
}

export const defaultBIConfig: BIConfig = {
  platform: {
    name: 'Kartezy Enterprise BI Platform',
    version: '1.0.0',
    environment: (process.env.ENVIRONMENT as any) || 'development',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
  },
  warehouse: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'kartezy_bi',
    user: process.env.POSTGRES_USER || 'kartezy',
    password: process.env.POSTGRES_PASSWORD || '',
    schema: 'kartezy_bi',
    poolSize: 20,
    connectionTimeoutMs: 10000,
  },
  dataLake: {
    storagePath: process.env.DATA_LAKE_PATH || '/data/datalake',
    retentionDays: parseInt(process.env.DATA_LAKE_RETENTION || '365'),
    compressionEnabled: true,
    partitionByDate: true,
  },
  cache: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    ttlSeconds: parseInt(process.env.CACHE_TTL || '300'),
    enabled: process.env.CACHE_ENABLED !== 'false',
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    consumerGroup: 'kartezy-bi-platform',
    topics: {
      orderEvents: 'kartezy.orders.events',
      paymentEvents: 'kartezy.payments.events',
      deliveryEvents: 'kartezy.delivery.events',
      userEvents: 'kartezy.users.events',
      inventoryEvents: 'kartezy.inventory.events',
      marketingEvents: 'kartezy.marketing.events',
    },
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    indexPrefix: 'kartezy_bi_',
    maxResultWindow: 10000,
  },
  ai: {
    baseUrl: process.env.AI_PLATFORM_URL || 'http://localhost:8094',
    apiKey: process.env.AI_API_KEY || '',
    timeoutMs: 30000,
  },
  bi: {
    powerBi: {
      workspaceId: process.env.POWERBI_WORKSPACE_ID || '',
      tenantId: process.env.POWERBI_TENANT_ID || '',
      clientId: process.env.POWERBI_CLIENT_ID || '',
      clientSecret: process.env.POWERBI_CLIENT_SECRET || '',
    },
    looker: {
      baseUrl: process.env.LOOKER_BASE_URL || '',
      clientId: process.env.LOOKER_CLIENT_ID || '',
      clientSecret: process.env.LOOKER_CLIENT_SECRET || '',
    },
    metabase: {
      baseUrl: process.env.METABASE_BASE_URL || '',
      apiKey: process.env.METABASE_API_KEY || '',
    },
    superset: {
      baseUrl: process.env.SUPERSET_BASE_URL || '',
      username: process.env.SUPERSET_USERNAME || '',
      password: process.env.SUPERSET_PASSWORD || '',
    },
  },
  reports: {
    outputPath: process.env.REPORT_OUTPUT_PATH || '/data/reports',
    maxRowsPerExport: parseInt(process.env.MAX_EXPORT_ROWS || '100000'),
    pdf: {
      pageSize: 'A4',
      orientation: 'landscape',
      fontFamily: 'Helvetica',
    },
    excel: {
      sheetSize: 1000000,
      useCharts: true,
    },
  },
  sync: {
    intervalMs: parseInt(process.env.SYNC_INTERVAL || '60000'),
    batchSize: parseInt(process.env.SYNC_BATCH_SIZE || '1000'),
    retryAttempts: parseInt(process.env.SYNC_RETRY_ATTEMPTS || '3'),
  },
};

export function getBIConfig(): BIConfig {
  return defaultBIConfig;
}
