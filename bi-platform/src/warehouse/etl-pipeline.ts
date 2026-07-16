/**
 * Kartezy Enterprise BI Platform - ETL Pipelines
 *
 * Extract, Transform, Load pipelines for moving data from source systems
 * into the data warehouse. Supports batch and incremental loads.
 */

import { createBILogger } from '../utils/logger';
import { generateBIId } from '../utils/helpers';

const logger = createBILogger('ETLPipeline');

export type PipelineStatus = 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
export type LoadStrategy = 'full_refresh' | 'incremental' | 'snapshot' | 'cdc';

export interface ETLPipeline {
  id: string;
  name: string;
  description: string;
  source: string;
  sourceType: 'postgresql' | 'mongodb' | 'kafka' | 'api' | 'file' | 'elasticsearch';
  targetTable: string;
  loadStrategy: LoadStrategy;
  schedule: string;
  dependencies: string[];
  transformations: string[];
  status: PipelineStatus;
  lastRunAt: string | null;
  lastRunDurationMs: number;
  rowsProcessed: number;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ETLRun {
  id: string;
  pipelineId: string;
  status: PipelineStatus;
  startedAt: string;
  completedAt: string | null;
  rowsExtracted: number;
  rowsTransformed: number;
  rowsLoaded: number;
  errorCount: number;
  durationMs: number;
  log: string[];
  batchId: string;
}

export class ETLPipelineManager {
  private static instance: ETLPipelineManager;
  private pipelines: Map<string, ETLPipeline> = new Map();
  private runs: Map<string, ETLRun> = new Map();

  private constructor() {
    logger.info('ETL Pipeline Manager initialized');
    this.registerDefaultPipelines();
  }

  static getInstance(): ETLPipelineManager {
    if (!ETLPipelineManager.instance) {
      ETLPipelineManager.instance = new ETLPipelineManager();
    }
    return ETLPipelineManager.instance;
  }

  private registerDefaultPipelines(): void {
    const now = new Date().toISOString();

    const defaultPipelines: ETLPipeline[] = [
      {
        id: 'etl_orders_daily',
        name: 'Orders Daily Load',
        description: 'Daily incremental load of orders from PostgreSQL to fact_orders',
        source: 'postgresql',
        sourceType: 'postgresql',
        targetTable: 'fact_orders',
        loadStrategy: 'incremental',
        schedule: '0 2 * * *',
        dependencies: ['dim_customer', 'dim_merchant', 'dim_product'],
        transformations: ['currency_conversion', 'status_mapping', 'date_dim_lookup'],
        status: 'idle',
        lastRunAt: null,
        lastRunDurationMs: 0,
        rowsProcessed: 0,
        errorCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'etl_order_items',
        name: 'Order Items Load',
        description: 'Incremental load of order line items from PostgreSQL to fact_order_items',
        source: 'postgresql',
        sourceType: 'postgresql',
        targetTable: 'fact_order_items',
        loadStrategy: 'incremental',
        schedule: '0 2 * * *',
        dependencies: ['etl_orders_daily'],
        transformations: ['price_calculation', 'margin_calculation'],
        status: 'idle',
        lastRunAt: null,
        lastRunDurationMs: 0,
        rowsProcessed: 0,
        errorCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'etl_payments',
        name: 'Payments Load',
        description: 'Incremental load of payment transactions',
        source: 'postgresql',
        sourceType: 'postgresql',
        targetTable: 'fact_payments',
        loadStrategy: 'incremental',
        schedule: '0 3 * * *',
        dependencies: ['etl_orders_daily'],
        transformations: ['fee_calculation', 'gateway_mapping'],
        status: 'idle',
        lastRunAt: null,
        lastRunDurationMs: 0,
        rowsProcessed: 0,
        errorCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'etl_deliveries',
        name: 'Deliveries Load',
        description: 'Incremental load of delivery data from delivery service',
        source: 'postgresql',
        sourceType: 'postgresql',
        targetTable: 'fact_deliveries',
        loadStrategy: 'incremental',
        schedule: '0 3 * * *',
        dependencies: ['etl_orders_daily', 'dim_delivery_partner'],
        transformations: ['time_calculation', 'distance_calculation'],
        status: 'idle',
        lastRunAt: null,
        lastRunDurationMs: 0,
        rowsProcessed: 0,
        errorCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'etl_inventory_snapshot',
        name: 'Inventory Daily Snapshot',
        description: 'End-of-day inventory snapshot from MongoDB',
        source: 'mongo',
        sourceType: 'mongodb',
        targetTable: 'fact_inventory',
        loadStrategy: 'snapshot',
        schedule: '0 23 * * *',
        dependencies: ['dim_product', 'dim_merchant'],
        transformations: ['stock_calculation', 'value_calculation'],
        status: 'idle',
        lastRunAt: null,
        lastRunDurationMs: 0,
        rowsProcessed: 0,
        errorCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'etl_customer_dimension',
        name: 'Customer Dimension SCD2',
        description: 'Slowly changing dimension Type 2 updates for customer attributes',
        source: 'postgresql',
        sourceType: 'postgresql',
        targetTable: 'dim_customer',
        loadStrategy: 'incremental',
        schedule: '0 1 * * *',
        dependencies: [],
        transformations: ['scd2_management', 'segment_calculation', 'tier_calculation'],
        status: 'idle',
        lastRunAt: null,
        lastRunDurationMs: 0,
        rowsProcessed: 0,
        errorCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'etl_merchant_dimension',
        name: 'Merchant Dimension SCD2',
        description: 'Slowly changing dimension Type 2 updates for merchant attributes',
        source: 'postgresql',
        sourceType: 'postgresql',
        targetTable: 'dim_merchant',
        loadStrategy: 'incremental',
        schedule: '0 1 * * *',
        dependencies: [],
        transformations: ['scd2_management', 'tier_calculation'],
        status: 'idle',
        lastRunAt: null,
        lastRunDurationMs: 0,
        rowsProcessed: 0,
        errorCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'etl_customer_activity',
        name: 'Customer Activity Events',
        description: 'Stream processing of customer activity events from Kafka',
        source: 'kafka',
        sourceType: 'kafka',
        targetTable: 'fact_customer_activity',
        loadStrategy: 'incremental',
        schedule: 'realtime',
        dependencies: ['dim_customer', 'dim_product'],
        transformations: ['event_parsing', 'session_mapping'],
        status: 'idle',
        lastRunAt: null,
        lastRunDurationMs: 0,
        rowsProcessed: 0,
        errorCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'etl_marketing',
        name: 'Marketing Campaign Performance',
        description: 'Marketing campaign metrics from various channels',
        source: 'postgresql',
        sourceType: 'postgresql',
        targetTable: 'fact_marketing',
        loadStrategy: 'incremental',
        schedule: '0 4 * * *',
        dependencies: ['dim_promotion'],
        transformations: ['kpi_calculation', 'channel_mapping'],
        status: 'idle',
        lastRunAt: null,
        lastRunDurationMs: 0,
        rowsProcessed: 0,
        errorCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'etl_daily_aggregates',
        name: 'Daily Aggregate Tables',
        description: 'Build daily aggregate tables for faster query performance',
        source: 'postgresql',
        sourceType: 'postgresql',
        targetTable: 'aggregate_daily',
        loadStrategy: 'full_refresh',
        schedule: '0 5 * * *',
        dependencies: ['etl_orders_daily', 'etl_order_items', 'etl_deliveries'],
        transformations: ['aggregation', 'metric_calculation'],
        status: 'idle',
        lastRunAt: null,
        lastRunDurationMs: 0,
        rowsProcessed: 0,
        errorCount: 0,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const pipeline of defaultPipelines) {
      this.pipelines.set(pipeline.id, pipeline);
    }

    logger.info(`Registered ${defaultPipelines.length} default ETL pipelines`);
  }

  /** Get all registered pipelines */
  async listPipelines(): Promise<ETLPipeline[]> {
    return Array.from(this.pipelines.values());
  }

  /** Get a specific pipeline */
  async getPipeline(id: string): Promise<ETLPipeline | undefined> {
    return this.pipelines.get(id);
  }

  /** Register a new pipeline */
  async registerPipeline(pipeline: ETLPipeline): Promise<ETLPipeline> {
    this.pipelines.set(pipeline.id, pipeline);
    logger.info('Registered new ETL pipeline', { id: pipeline.id, name: pipeline.name });
    return pipeline;
  }

  /** Execute a pipeline */
  async runPipeline(id: string): Promise<ETLRun> {
    const pipeline = this.pipelines.get(id);
    if (!pipeline) throw new Error(`Pipeline ${id} not found`);
    if (pipeline.status === 'running') throw new Error(`Pipeline ${id} is already running`);

    const runId = generateBIId();
    const batchId = generateBIId();
    const startTime = Date.now();

    pipeline.status = 'running';
    pipeline.lastRunAt = new Date().toISOString();

    const run: ETLRun = {
      id: runId,
      pipelineId: id,
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
      rowsExtracted: 0,
      rowsTransformed: 0,
      rowsLoaded: 0,
      errorCount: 0,
      durationMs: 0,
      log: [`[${new Date().toISOString()}] Starting pipeline: ${pipeline.name}`],
      batchId,
    };

    this.runs.set(runId, run);
    logger.info('Starting ETL pipeline execution', { pipelineId: id, runId, batchId });

    try {
      // Simulate ETL pipeline execution phases
      const log = run.log;

      // Phase 1: Extract
      log.push(`[${new Date().toISOString()}] Phase 1: Extracting data from ${pipeline.source}...`);
      await this.simulateWork(500);
      const extractedRows = 1000 + Math.floor(Math.random() * 9000);
      run.rowsExtracted = extractedRows;
      log.push(`[${new Date().toISOString()}] Extracted ${extractedRows} rows`);

      // Phase 2: Transform
      log.push(`[${new Date().toISOString()}] Phase 2: Applying transformations...`);
      await this.simulateWork(800);
      if (pipeline.transformations.length > 0) {
        for (const transform of pipeline.transformations) {
          log.push(`[${new Date().toISOString()}] Applied transformation: ${transform}`);
          await this.simulateWork(200);
        }
      }
      run.rowsTransformed = extractedRows;
      log.push(`[${new Date().toISOString()}] Transformations completed`);

      // Phase 3: Load
      log.push(`[${new Date().toISOString()}] Phase 3: Loading into ${pipeline.targetTable}...`);
      await this.simulateWork(600);
      run.rowsLoaded = extractedRows;
      log.push(`[${new Date().toISOString()}] Loaded ${extractedRows} rows into ${pipeline.targetTable}`);

      // Complete
      const duration = Date.now() - startTime;
      run.status = 'completed';
      run.completedAt = new Date().toISOString();
      run.durationMs = duration;
      log.push(`[${new Date().toISOString()}] Pipeline completed in ${duration}ms`);

      pipeline.status = 'completed';
      pipeline.lastRunDurationMs = duration;
      pipeline.rowsProcessed += extractedRows;

      logger.info('ETL pipeline completed successfully', { pipelineId: id, runId, duration, rows: extractedRows });
    } catch (error) {
      run.status = 'failed';
      run.completedAt = new Date().toISOString();
      run.durationMs = Date.now() - startTime;
      run.errorCount++;
      run.log.push(`[${new Date().toISOString()}] ERROR: ${(error as Error).message}`);

      pipeline.status = 'failed';
      pipeline.errorCount++;

      logger.error('ETL pipeline failed', { pipelineId: id, runId, error: (error as Error).message });
    }

    this.runs.set(runId, run);
    return run;
  }

  /** Get run history */
  async getRunHistory(pipelineId?: string): Promise<ETLRun[]> {
    let results = Array.from(this.runs.values());
    if (pipelineId) {
      results = results.filter(r => r.pipelineId === pipelineId);
    }
    return results.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }

  /** Get pipeline stats */
  async getPipelineStats(): Promise<{
    totalPipelines: number;
    activePipelines: number;
    completedRuns: number;
    failedRuns: number;
    totalRowsProcessed: number;
  }> {
    const allPipelines = await this.listPipelines();
    const allRuns = Array.from(this.runs.values());
    return {
      totalPipelines: allPipelines.length,
      activePipelines: allPipelines.filter(p => p.status === 'running').length,
      completedRuns: allRuns.filter(r => r.status === 'completed').length,
      failedRuns: allRuns.filter(r => r.status === 'failed').length,
      totalRowsProcessed: allPipelines.reduce((sum, p) => sum + p.rowsProcessed, 0),
    };
  }

  private async simulateWork(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ETLPipelineManager.getInstance();
