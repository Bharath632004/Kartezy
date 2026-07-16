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
  private mockData: Map<string, any[]> = new Map();

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
      // In production, connect to actual PostgreSQL and run schema DDL
      // For now, pre-populate mock data structures
      this.seedMockData();
      this.initialized = true;
      logger.info('Data warehouse initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize data warehouse', { error: (error as Error).message });
      throw error;
    }
  }

  private seedMockData(): void {
    for (const table of allDWTables) {
      this.mockData.set(table.name, []);
    }
  }

  async executeQuery<T = Record<string, unknown>>(
    query: string,
    params?: Record<string, unknown>,
  ): Promise<QueryResult<T>> {
    const queryId = generateBIId();
    const startTime = Date.now();

    logger.debug('Executing query', { queryId, query: query.substring(0, 100) });

    // In production, this would execute against PostgreSQL
    // For now, simulate query execution with mock data
    await new Promise(resolve => setTimeout(resolve, 10));

    const executionTimeMs = Date.now() - startTime;

    // Try to parse table name from query for mock data
    const tableNameMatch = query.match(/FROM\s+(\w+)/i);
    const mockRows = tableNameMatch ? (this.mockData.get(tableNameMatch[1]) || []) : [];

    // Apply basic filters based on params
    let filteredRows = mockRows;
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'string' || typeof value === 'number') {
          filteredRows = filteredRows.filter((row: any) =>
            row[key] === value || String(row[key]).includes(String(value))
          );
        }
      }
    }

    return {
      rows: filteredRows as T[],
      rowCount: filteredRows.length,
      fields: Object.keys(mockRows[0] || {}),
      executionTimeMs,
      queryId,
    };
  }

  async getTableSchema(tableName: string): Promise<DWTable | undefined> {
    return allDWTables.find(t => t.name === tableName);
  }

  async getWarehouseStats(): Promise<DWStats> {
    const factTables = getFactTables();
    const dimTables = getDimensionTables();

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

    // Simulate data aggregation
    const mockData: any[] = [];
    const numRows = 10 + Math.floor(Math.random() * 20);

    for (let i = 0; i < numRows; i++) {
      const row: any = {};
      for (const dim of dimensions) {
        row[dim] = `Value_${i}_${dim.substring(0, 3)}`;
      }
      for (const measure of measures) {
        row[measure] = Math.round(Math.random() * 100000 * 100) / 100;
      }
      mockData.push(row);
    }

    return mockData;
  }
}

export default DataWarehouse.getInstance();
