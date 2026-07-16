import { createLogger } from '../utils/logger';

const logger = createLogger('DataService');

export interface DataPoint {
  id: string;
  features: Record<string, number | string | boolean>;
  label?: number | string;
  timestamp?: Date;
  weight?: number;
}

export interface Dataset {
  name: string;
  data: DataPoint[];
  featureNames: string[];
  labelName?: string;
  size: number;
  createdAt: Date;
}

export interface FeatureTransformation {
  name: string;
  type: 'normalize' | 'standardize' | 'one-hot' | 'label-encode' | 'log-transform' | 'binning';
  params?: Record<string, number | string>;
}

export enum DataSourceType {
  DATABASE = 'DATABASE',
  REDIS = 'REDIS',
  ELASTICSEARCH = 'ELASTICSEARCH',
  KAFKA = 'KAFKA',
  S3 = 'S3',
  API = 'API',
}

export class DataService {
  private static instance: DataService;
  private datasets: Map<string, Dataset> = new Map();
  private transformations: Map<string, FeatureTransformation[]> = new Map();

  private constructor() {
    logger.info('DataService initialized');
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  registerDataset(dataset: Dataset): void {
    this.datasets.set(dataset.name, dataset);
    logger.info(`Registered dataset: ${dataset.name} (${dataset.size} points)`);
  }

  getDataset(name: string): Dataset | undefined {
    return this.datasets.get(name);
  }

  listDatasets(): string[] {
    return Array.from(this.datasets.keys());
  }

  removeDataset(name: string): boolean {
    return this.datasets.delete(name);
  }

  addTransformation(datasetName: string, transformation: FeatureTransformation): void {
    const existing = this.transformations.get(datasetName) || [];
    existing.push(transformation);
    this.transformations.set(datasetName, existing);
  }

  getTransformations(datasetName: string): FeatureTransformation[] {
    return this.transformations.get(datasetName) || [];
  }

  async preprocess(data: DataPoint[], transformations: FeatureTransformation[]): Promise<DataPoint[]> {
    logger.info(`Preprocessing ${data.length} data points with ${transformations.length} transformations`);
    let processed = [...data];

    for (const tf of transformations) {
      processed = await this.applyTransformation(processed, tf);
    }

    return processed;
  }

  private async applyTransformation(data: DataPoint[], tf: FeatureTransformation): Promise<DataPoint[]> {
    switch (tf.type) {
      case 'normalize':
        return this.normalize(data, tf.name);
      case 'standardize':
        return this.standardize(data, tf.name);
      case 'one-hot':
        return this.oneHotEncode(data, tf.name);
      case 'label-encode':
        return this.labelEncode(data, tf.name);
      case 'log-transform':
        return this.logTransform(data, tf.name);
      default:
        logger.warn(`Unknown transformation type: ${tf.type}`);
        return data;
    }
  }

  private normalize(data: DataPoint[], feature: string): DataPoint[] {
    const values = data.map(d => d.features[feature] as number).filter(v => v !== undefined && v !== null);
    if (values.length === 0) return data;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    if (range === 0) return data;

    return data.map(d => ({
      ...d,
      features: {
        ...d.features,
        [feature]: ((d.features[feature] as number) - min) / range,
      },
    }));
  }

  private standardize(data: DataPoint[], feature: string): DataPoint[] {
    const values = data.map(d => d.features[feature] as number).filter(v => v !== undefined && v !== null);
    if (values.length === 0) return data;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev === 0) return data;

    return data.map(d => ({
      ...d,
      features: {
        ...d.features,
        [feature]: ((d.features[feature] as number) - mean) / stdDev,
      },
    }));
  }

  private oneHotEncode(data: DataPoint[], feature: string): DataPoint[] {
    const uniqueValues = [...new Set(data.map(d => d.features[feature]))].filter(v => v !== undefined);
    return data.map(d => {
      const newFeatures = { ...d.features };
      delete newFeatures[feature];
      for (const val of uniqueValues) {
        newFeatures[`${feature}_${val}`] = d.features[feature] === val ? 1 : 0;
      }
      return { ...d, features: newFeatures };
    });
  }

  private labelEncode(data: DataPoint[], feature: string): DataPoint[] {
    const uniqueValues = [...new Set(data.map(d => d.features[feature]))].filter(v => v !== undefined);
    const mapping = new Map(uniqueValues.map((v, i) => [v, i]));
    return data.map(d => ({
      ...d,
      features: {
        ...d.features,
        [feature]: mapping.get(d.features[feature]) ?? 0,
      },
    }));
  }

  private logTransform(data: DataPoint[], feature: string): DataPoint[] {
    return data.map(d => ({
      ...d,
      features: {
        ...d.features,
        [feature]: Math.log((d.features[feature] as number) + 1),
      },
    }));
  }

  async splitTrainTest(
    data: DataPoint[],
    testRatio: number = 0.2,
    shuffle: boolean = true
  ): Promise<{ train: DataPoint[]; test: DataPoint[] }> {
    const shuffled = shuffle ? [...data].sort(() => Math.random() - 0.5) : [...data];
    const splitIndex = Math.floor(shuffled.length * (1 - testRatio));
    return {
      train: shuffled.slice(0, splitIndex),
      test: shuffled.slice(splitIndex),
    };
  }

  async createBatch(dataset: Dataset, batchSize: number): Promise<DataPoint[][]> {
    const batches: DataPoint[][] = [];
    for (let i = 0; i < dataset.data.length; i += batchSize) {
      batches.push(dataset.data.slice(i, i + batchSize));
    }
    return batches;
  }

  clear(): void {
    this.datasets.clear();
    this.transformations.clear();
    logger.info('DataService cache cleared');
  }
}

export default DataService.getInstance();
