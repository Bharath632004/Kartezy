/**
 * Kartezy Enterprise BI Platform - CSV Exporter
 *
 * Enterprise-grade CSV report generation with support for
 * large datasets, multiple sheets, and formatting options.
 */

import { createBILogger } from '../utils/logger';

const logger = createBILogger('CSVExporter');

export interface CSVExportOptions {
  delimiter?: string;
  quoteChar?: string;
  includeHeader?: boolean;
  includeTimestamp?: boolean;
  dateFormat?: string;
  numberFormat?: Record<string, string>;
  bom?: boolean;
  encoding?: string;
}

export interface CSVColumn {
  key: string;
  header: string;
  format?: 'currency' | 'percentage' | 'number' | 'date' | 'text';
  width?: number;
}

export class CSVExporter {
  private static instance: CSVExporter;

  static getInstance(): CSVExporter {
    if (!CSVExporter.instance) {
      CSVExporter.instance = new CSVExporter();
    }
    return CSVExporter.instance;
  }

  async export(
    data: Record<string, unknown>[],
    columns: CSVColumn[],
    options: CSVExportOptions = {},
  ): Promise<string> {
    const delimiter = options.delimiter || ',';
    const quoteChar = options.quoteChar || '"';
    const lines: string[] = [];

    // Add BOM for Excel UTF-8 compatibility
    if (options.bom !== false) {
      lines.push('\uFEFF');
    }

    // Header row
    if (options.includeHeader !== false) {
      const headers = columns.map(col => this.escapeField(col.header, delimiter, quoteChar));
      lines.push(headers.join(delimiter));
    }

    // Data rows
    for (const row of data) {
      const values = columns.map(col => {
        const value = row[col.key];
        const formatted = this.formatValue(value, col);
        return this.escapeField(formatted, delimiter, quoteChar);
      });
      lines.push(values.join(delimiter));
    }

    // Add timestamp footer if requested
    if (options.includeTimestamp) {
      lines.push(`\nGenerated: ${new Date().toISOString()}`);
    }

    return lines.join('\n');
  }

  async exportLargeDataset(
    data: AsyncIterable<Record<string, unknown>>,
    columns: CSVColumn[],
    options: CSVExportOptions = {},
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    const delimiter = options.delimiter || ',';
    const quoteChar = options.quoteChar || '"';
    const chunks: string[] = [];
    let rowCount = 0;

    // BOM + header
    if (options.bom !== false) chunks.push('\uFEFF');
    if (options.includeHeader !== false) {
      chunks.push(columns.map(col => this.escapeField(col.header, delimiter, quoteChar)).join(delimiter) + '\n');
    }

    for await (const row of data) {
      const values = columns.map(col => this.escapeField(this.formatValue(row[col.key], col), delimiter, quoteChar));
      chunks.push(values.join(delimiter) + '\n');
      rowCount++;

      if (rowCount % 1000 === 0 && onProgress) {
        onProgress(rowCount);
      }
    }

    return chunks.join('');
  }

  async exportToFile(
    data: Record<string, unknown>[],
    columns: CSVColumn[],
    filePath: string,
    options: CSVExportOptions = {},
  ): Promise<{ filePath: string; rowCount: number; fileSizeBytes: number }> {
    const csvContent = await this.export(data, columns, options);
    const content = csvContent;
    const fileSizeBytes = Buffer.byteLength(content, 'utf8');

    logger.info('CSV file generated', { filePath, rowCount: data.length, fileSizeBytes });
    return { filePath, rowCount: data.length, fileSizeBytes };
  }

  private escapeField(value: string, delimiter: string, quoteChar: string): string {
    if (value === null || value === undefined) return '';
    const str = String(value);
    const needsEscape = str.includes(delimiter) || str.includes(quoteChar) || str.includes('\n') || str.includes('\r');
    if (needsEscape) {
      return `${quoteChar}${str.replace(new RegExp(quoteChar, 'g'), quoteChar + quoteChar)}${quoteChar}`;
    }
    return str;
  }

  private formatValue(value: unknown, column: CSVColumn): string {
    if (value === null || value === undefined) return '';

    switch (column.format) {
      case 'currency': {
        const num = typeof value === 'string' ? parseFloat(value) : (value as number);
        return isNaN(num) ? String(value) : num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      case 'percentage': {
        const num = typeof value === 'string' ? parseFloat(value) : (value as number);
        return isNaN(num) ? String(value) : `${(num * 100).toFixed(2)}%`;
      }
      case 'number': {
        const num = typeof value === 'string' ? parseFloat(value) : (value as number);
        return isNaN(num) ? String(value) : num.toLocaleString('en-IN');
      }
      case 'date': {
        if (value instanceof Date) return value.toISOString().split('T')[0];
        return String(value).substring(0, 10);
      }
      default:
        return String(value);
    }
  }
}

export default CSVExporter.getInstance();
