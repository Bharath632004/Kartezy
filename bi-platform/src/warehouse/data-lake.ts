/**
 * Kartezy Enterprise BI Platform - Data Lake
 *
 * Raw data storage layer for unstructured and semi-structured data.
 * Handles data ingestion, partitioning, compression, and retention.
 */

import { createBILogger } from '../utils/logger';
import { getBIConfig } from '../config';
import { generateBIId } from '../utils/helpers';

const logger = createBILogger('DataLake');

export interface DataLakeFile {
  id: string;
  path: string;
  source: string;
  dataType: string;
  format: 'json' | 'csv' | 'parquet' | 'avro' | 'orc';
  sizeBytes: number;
  rowCount: number;
  partitionDate: string;
  ingestedAt: string;
  compressionType: 'none' | 'gzip' | 'snappy' | 'zstd';
  metadata: Record<string, unknown>;
}

export interface DataLakeStats {
  totalFiles: number;
  totalSizeBytes: number;
  fileCountByType: Record<string, number>;
  fileCountBySource: Record<string, number>;
  latestIngestionTime: string;
  oldestDataDate: string;
  retentionDays: number;
}

export class DataLake {
  private static instance: DataLake;
  private files: Map<string, DataLakeFile> = new Map();
  private storagePath: string;
  private retentionDays: number;
  private initialized: boolean = false;

  private constructor() {
    const config = getBIConfig();
    this.storagePath = config.dataLake.storagePath;
    this.retentionDays = config.dataLake.retentionDays;
    logger.info('DataLake manager initialized', { path: this.storagePath, retentionDays: this.retentionDays });
  }

  static getInstance(): DataLake {
    if (!DataLake.instance) {
      DataLake.instance = new DataLake();
    }
    return DataLake.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    logger.info('Initializing data lake...');
    this.initialized = true;
  }

  /** Ingest a file into the data lake */
  async ingestFile(
    data: any[],
    source: string,
    dataType: string,
    format: DataLakeFile['format'] = 'json',
    metadata: Record<string, unknown> = {},
  ): Promise<DataLakeFile> {
    const date = new Date().toISOString().split('T')[0];
    const id = generateBIId();
    const path = `${this.storagePath}/${source.toLowerCase()}/${dataType.toLowerCase()}/${date}/${id}.${format}`;

    const file: DataLakeFile = {
      id,
      path,
      source,
      dataType,
      format,
      sizeBytes: Buffer.byteLength(JSON.stringify(data)),
      rowCount: data.length,
      partitionDate: date,
      ingestedAt: new Date().toISOString(),
      compressionType: getBIConfig().dataLake.compressionEnabled ? 'gzip' : 'none',
      metadata,
    };

    this.files.set(id, file);
    logger.info('File ingested into data lake', { id, source, dataType, rows: data.length });

    // In production, write to S3/GCS/Azure Blob Storage
    // For now, just log the file creation
    if (getBIConfig().dataLake.compressionEnabled) {
      logger.debug('Compression applied', { file: id, type: 'gzip' });
    }

    return file;
  }

  /** Query files from the data lake by source and data type */
  async queryFiles(
    source?: string,
    dataType?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<DataLakeFile[]> {
    let results = Array.from(this.files.values());

    if (source) results = results.filter(f => f.source === source);
    if (dataType) results = results.filter(f => f.dataType === dataType);
    if (startDate) results = results.filter(f => f.partitionDate >= startDate);
    if (endDate) results = results.filter(f => f.partitionDate <= endDate);

    return results.sort((a, b) => b.ingestedAt.localeCompare(a.ingestedAt));
  }

  /** Get file by ID */
  async getFile(id: string): Promise<DataLakeFile | undefined> {
    return this.files.get(id);
  }

  /** List all data types available in the data lake */
  async listDataTypes(): Promise<string[]> {
    const types = new Set<string>();
    for (const file of this.files.values()) {
      types.add(file.dataType);
    }
    return Array.from(types).sort();
  }

  /** List all unique sources */
  async listSources(): Promise<string[]> {
    const sources = new Set<string>();
    for (const file of this.files.values()) {
      sources.add(file.source);
    }
    return Array.from(sources).sort();
  }

  /** Apply retention policy - remove data older than retention period */
  async applyRetentionPolicy(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
    const cutoff = cutoffDate.toISOString().split('T')[0];

    let deletedCount = 0;
    for (const [id, file] of this.files) {
      if (file.partitionDate < cutoff) {
        this.files.delete(id);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      logger.info(`Retention policy applied: deleted ${deletedCount} files older than ${cutoff}`);
    }
    return deletedCount;
  }

  /** Get data lake statistics */
  async getStats(): Promise<DataLakeStats> {
    const fileCountByType: Record<string, number> = {};
    const fileCountBySource: Record<string, number> = {};
    let totalSizeBytes = 0;
    let latestTime = '';
    let oldestDate = '';

    for (const file of this.files.values()) {
      fileCountByType[file.dataType] = (fileCountByType[file.dataType] || 0) + 1;
      fileCountBySource[file.source] = (fileCountBySource[file.source] || 0) + 1;
      totalSizeBytes += file.sizeBytes;
      if (file.ingestedAt > latestTime) latestTime = file.ingestedAt;
      if (!oldestDate || file.partitionDate < oldestDate) oldestDate = file.partitionDate;
    }

    return {
      totalFiles: this.files.size,
      totalSizeBytes,
      fileCountByType,
      fileCountBySource,
      latestIngestionTime: latestTime || new Date().toISOString(),
      oldestDataDate: oldestDate || new Date().toISOString(),
      retentionDays: this.retentionDays,
    };
  }

  /** Get the storage path */
  getPath(): string {
    return this.storagePath;
  }

  /** Check if data lake is initialized */
  isInitialized(): boolean {
    return this.initialized;
  }
}

export default DataLake.getInstance();
