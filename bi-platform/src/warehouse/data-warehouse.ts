/**
 * Kartezy Enterprise BI Platform - Data Warehouse Manager
 *
 * Manages the data warehouse schema, connections, and query execution.
 * Supports PostgreSQL as the primary warehouse engine.
 */

import { createBILogger } from '../utils/logger';
import { getBIConfig } from '../config';
import {
  allDWTables, getFactTables, getDimensionTables,
  generateWarehouseDDL, DWTable,
} from './schemas';
import { generateBIId } from '../utils/helpers';
import { Pool, QueryResult as PGQueryResult } from 'pg';

const logger = createBILogger('DataWarehouse');

export interface WarehouseConnection {
  host: string;
  port: number;
  database: string;
  user: string;
  schema: string;
}

export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
  fields: string[];
  executionTimeMs: number;
  queryId: string;
}

export interface DWStats {
  totalTables: number;
  factTables: number;
  dimensionTables: number;
  factRows: number;
  dimensionRows: number;
  lastUpdated: string;
  dataSizeBytes: number;
  tableStats: Array<{ name: string; type: string; rows: number; sizeBytes: number }>;
}

export class DataWarehouse {
  private static instance: DataWarehouse;
  private connection: WarehouseConnection;
  private initialized: boolean = false;
  private pool: Pool | null = null;

  private constructor() {
    const config = getBIConfig();
    this.connection = {
      host: config.warehouse.host,
      port: config.warehouse.port,
      database: config.warehouse.database,
      user: config.warehouse.user,
      schema: config.warehouse.schema,
    };
    logger.info('DataWarehouse manager initialized', { host: this.connection.host, schema: this.connection.schema });
  }

  static getInstance(): DataWarehouse {
    if (!DataWarehouse.instance) {
      DataWarehouse.instance = new DataWarehouse();
    }
    return DataWarehouse.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    logger.info('Initializing data warehouse schema...');
    try {
      // Create connection pool to PostgreSQL
      this.pool = new Pool({
        host: this.connection.host,
        port: this.connection.port,
        database: this.connection.database,
        user: this.connection.user,
        password: getBIConfig().warehouse.password,
        max: getBIConfig().warehouse.poolSize,
        connectionTimeoutMillis: getBIConfig().warehouse.connectionTimeoutMs,
      });

      // Test connection
      const client = await this.pool.connect();
      try {
        const ddl = generateWarehouseDDL();
        await client.query(ddl);
        logger.info('Data warehouse schema created/verified successfully');
      } finally {
        client.release();
      }

      this.initialized = true;
      logger.info('Data warehouse initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize data warehouse', { error: (error as Error).message });
      throw error;
    }
  }

  async executeQuery<T = Record<string, unknown>>(
    query: string,
    params?: Record<string, unknown>,
  ): Promise<QueryResult<T>> {
    const queryId = generateBIId();
    const startTime = Date.now();

    logger.debug('Executing query', { queryId, query: query.substring(0, 100) });

    if (!this.pool) {
      throw new Error('Data warehouse not initialized. Call initialize() first.');
    }

    try {
      const result: PGQueryResult<any> = await this.pool.query(query, params ? Object.values(params) : []);
      const executionTimeMs = Date.now() - startTime;

      return {
        rows: result.rows as T[],
        rowCount: result.rowCount || 0,
        fields: result.fields.map(f => f.name),
        executionTimeMs,
        queryId,
      };
    } catch (error) {
      logger.error('Query execution failed', { queryId, error: (error as Error).message });
      throw error;
    }
  }

  async getTableSchema(tableName: string): Promise<DWTable | undefined> {
    return allDWTables.find(t => t.name === tableName);
  }

  async getWarehouseStats(): Promise<DWStats> {
    const factTables = getFactTables();
    const dimTables = getDimensionTables();

    try {
      // Query actual row counts from PostgreSQL
      const tableStats: Array<{ name: string; type: string; rows: number; sizeBytes: number }> = [];
      let totalFactRows = 0;
      let totalDimRows = 0;

      for (const table of allDWTables) {
        try {
          const countResult = await this.executeQuery<{ count: string }>(
            `SELECT COUNT(*) as count FROM "${this.connection.schema}"."${table.name}"`
          );
          const rowCount = parseInt(countResult.rows[0]?.count || '0', 10);
          if (table.type === 'fact') {
            totalFactRows += rowCount;
          } else {
            totalDimRows += rowCount;
          }
          tableStats.push({
            name: table.name,
            type: table.type,
            rows: rowCount,
            sizeBytes: rowCount * 512,
          });
        } catch {
          tableStats.push({ name: table.name, type: table.type, rows: 0, sizeBytes: 0 });
        }
      }

      let dataSizeBytes = 0;
      try {
        const sizeResult = await this.executeQuery<{ size: string }>(
          `SELECT pg_database_size('${this.connection.database}') as size`
        );
        dataSizeBytes = parseInt(sizeResult.rows[0]?.size || '0', 10);
      } catch {
        dataSizeBytes = 0;
      }

      return {
        totalTables: allDWTables.length,
        factTables: factTables.length,
        dimensionTables: dimTables.length,
        factRows: totalFactRows,
        dimensionRows: totalDimRows,
        lastUpdated: new Date().toISOString(),
        dataSizeBytes,
        tableStats,
      };
    } catch {
      // Fallback to estimated stats if queries fail
      return {
        totalTables: allDWTables.length,
        factTables: factTables.length,
        dimensionTables: dimTables.length,
        factRows: 0,
        dimensionRows: 0,
        lastUpdated: new Date().toISOString(),
        dataSizeBytes: 0,
        tableStats: allDWTables.map(t => ({
          name: t.name,
          type: t.type,
          rows: t.rowEstimate || 0,
          sizeBytes: (t.rowEstimate || 0) * 512,
        })),
      };
    }
  }

  async getDDL(): Promise<string> {
    return generateWarehouseDDL();
  }

  async validateSchema(): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const table of allDWTables) {
      // Check for at least one primary key
      const hasPK = table.columns.some(c => c.primaryKey);
      if (!hasPK) {
        warnings.push(`Table ${table.name} has no primary key`);
      }

      // Check for foreign key references exist
      for (const col of table.columns) {
        if (col.foreignKey) {
          const refTable = allDWTables.find(t => t.name === col.foreignKey!.table);
          if (!refTable) {
            errors.push(`Table ${table.name}.${col.name} references non-existent table ${col.foreignKey.table}`);
          } else {
            const refCol = refTable.columns.find(c => c.name === col.foreignKey!.column);
            if (!refCol) {
              errors.push(`Table ${table.name}.${col.name} references non-existent column ${col.foreignKey.table}.${col.foreignKey.column}`);
            }
          }
        }
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  async generateReportData(tableName: string, dimensions: string[], measures: string[], filters?: Record<string, unknown>): Promise<any[]> {
    const table = allDWTables.find(t => t.name === tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found in warehouse`);
    }

    // Validate columns exist
    const allCols = [...dimensions, ...measures];
    for (const col of allCols) {
      if (!table.columns.find(c => c.name === col)) {
        throw new Error(`Column ${col} not found in table ${tableName}`);
      }
    }

    // Build SELECT clause
    const selectCols = [...dimensions, ...measures.map(m => `SUM(${m}) as ${m}`)].join(', ');
    const groupBy = dimensions.join(', ');

    let whereClause = '';
    if (filters) {
      const conditions = Object.entries(filters)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => typeof v === 'string' ? `${k} = '${v}'` : `${k} = ${v}`);
      if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
      }
    }

    const query = `
      SELECT ${selectCols}
      FROM "${this.connection.schema}"."${tableName}"
      ${whereClause}
      ${groupBy ? `GROUP BY ${groupBy}` : ''}
      ORDER BY ${dimensions.join(', ')}
      LIMIT 1000
    `;

    try {
      const result = await this.executeQuery(query);
      return result.rows;
    } catch (error) {
      logger.error('Failed to generate report data', { tableName, error: (error as Error).message });
      throw error;
    }
  }
}

export default DataWarehouse.getInstance();
