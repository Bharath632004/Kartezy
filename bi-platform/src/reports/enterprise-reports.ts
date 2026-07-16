/**
 * Kartezy Enterprise BI Platform - Enterprise Reports
 *
 * Central report generation engine that orchestrates data collection,
 * formatting, and export to multiple formats (CSV, Excel, PDF).
 */

import { createBILogger } from '../utils/logger';
import { CSVExporter, CSVColumn } from './csv-exporter';
import { ExcelExporter, ExcelColumn } from './excel-exporter';
import { PDFExporter, PDFReportConfig, PDFSection } from './pdf-exporter';
import { generateBIId } from '../utils/helpers';

const logger = createBILogger('EnterpriseReports');

export type ReportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export interface ReportRequest {
  type: string;
  title: string;
  period: string;
  format: ReportFormat;
  filters?: Record<string, unknown>;
  sections?: string[];
  recipients?: string[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
  };
}

export interface ReportResult {
  id: string;
  title: string;
  type: string;
  format: ReportFormat;
  generatedAt: string;
  rowCount: number;
  fileSizeBytes: number;
  filePath: string;
  status: 'completed' | 'failed';
  error?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  formats: ReportFormat[];
  defaultPeriod: string;
  sections: string[];
}

export class EnterpriseReports {
  private static instance: EnterpriseReports;

  static getInstance(): EnterpriseReports {
    if (!EnterpriseReports.instance) {
      EnterpriseReports.instance = new EnterpriseReports();
    }
    return EnterpriseReports.instance;
  }

  private reportTemplates: ReportTemplate[] = [
    { id: 'daily_sales', name: 'Daily Sales Summary', description: 'Daily sales performance with top products and categories', category: 'Sales', formats: ['csv', 'excel', 'pdf'], defaultPeriod: 'today', sections: ['overview', 'top_products', 'category_breakdown'] },
    { id: 'weekly_performance', name: 'Weekly Business Performance', description: 'Weekly KPI review across all business domains', category: 'Executive', formats: ['pdf', 'excel'], defaultPeriod: 'last_7_days', sections: ['kpi_summary', 'revenue_trend', 'customer_growth', 'merchant_performance'] },
    { id: 'monthly_financial', name: 'Monthly Financial Report', description: 'Comprehensive financial report with P&L, revenue breakdown, and forecasts', category: 'Finance', formats: ['pdf', 'excel'], defaultPeriod: 'last_month', sections: ['financial_overview', 'revenue_breakdown', 'commission_summary', 'payout_summary', 'gst_report'] },
    { id: 'monthly_customer', name: 'Monthly Customer Analytics', description: 'Customer acquisition, retention, segmentation, and CLV analysis', category: 'Customer', formats: ['pdf', 'excel', 'csv'], defaultPeriod: 'last_30_days', sections: ['customer_overview', 'acquisition_trend', 'retention_cohorts', 'segmentation', 'clv_analysis'] },
    { id: 'delivery_performance', name: 'Delivery Operations Report', description: 'Delivery metrics, driver performance, and zone analytics', category: 'Operations', formats: ['pdf', 'excel', 'csv'], defaultPeriod: 'last_7_days', sections: ['delivery_overview', 'driver_performance', 'zone_analytics', 'delivery_trend'] },
    { id: 'inventory_summary', name: 'Inventory Health Report', description: 'Stock levels, turnover, stockout alerts, and replenishment recommendations', category: 'Inventory', formats: ['csv', 'excel'], defaultPeriod: 'last_30_days', sections: ['inventory_overview', 'stock_analysis', 'replenishment_suggestions'] },
    { id: 'marketing_roi', name: 'Marketing ROI Report', description: 'Campaign performance, channel analysis, and ROAS', category: 'Marketing', formats: ['pdf', 'excel'], defaultPeriod: 'last_30_days', sections: ['marketing_overview', 'campaign_performance', 'channel_performance'] },
    { id: 'quarterly_board', name: 'Quarterly Board Report', description: 'Complete board-level report with strategic insights and recommendations', category: 'Executive', formats: ['pdf'], defaultPeriod: 'this_quarter', sections: ['executive_summary', 'financial_performance', 'customer_growth', 'operations', 'market_expansion', 'strategic_initiatives'] },
    { id: 'merchant_performance', name: 'Merchant Performance Report', description: 'Merchant-wise sales, commission, growth, and benchmarking', category: 'Merchant', formats: ['csv', 'excel', 'pdf'], defaultPeriod: 'last_30_days', sections: ['merchant_overview', 'merchant_performance', 'benchmarks'] },
    { id: 'city_expansion', name: 'City Expansion Report', description: 'City-wise performance, market penetration, and expansion opportunities', category: 'Strategic', formats: ['pdf', 'excel'], defaultPeriod: 'last_month', sections: ['city_comparison', 'city_heatmap', 'expansion_opportunities'] },
  ];

  getTemplates(): ReportTemplate[] {
    return this.reportTemplates;
  }

  getTemplate(id: string): ReportTemplate | undefined {
    return this.reportTemplates.find(t => t.id === id);
  }

  async generateReport(request: ReportRequest): Promise<ReportResult> {
    const reportId = generateBIId();
    logger.info('Generating report', { type: request.type, format: request.format, title: request.title });

    try {
      const startTime = Date.now();

      // Generate mock report data based on type
      const reportData = await this.getReportData(request);
      let buffer: Buffer | string;
      let rowCount = 0;

      switch (request.format) {
        case 'csv': {
          const columns: CSVColumn[] = reportData.columns.map((c: any) => ({ key: c.key, header: c.header, format: c.format }));
          buffer = await CSVExporter.getInstance().export(reportData.data, columns);
          rowCount = reportData.data.length;
          break;
        }
        case 'excel': {
          const columns: ExcelColumn[] = reportData.columns.map((c: any) => ({ key: c.key, header: c.header, type: c.format as any }));
          buffer = await ExcelExporter.getInstance().exportToBuffer(reportData.data, columns, request.title);
          rowCount = reportData.data.length;
          break;
        }
        case 'pdf': {
          const sections: PDFSection[] = reportData.sections || [];
          buffer = await PDFExporter.getInstance().generateReport(sections, {
            title: request.title,
            period: request.period,
            generatedAt: new Date().toISOString(),
          });
          rowCount = reportData.data?.length || 0;
          break;
        }
        case 'json':
          buffer = JSON.stringify(reportData, null, 2);
          rowCount = reportData.data?.length || 0;
          break;
        default:
          throw new Error(`Unsupported format: ${request.format}`);
      }

      const fileSizeBytes = typeof buffer === 'string' ? Buffer.byteLength(buffer) : buffer.length;

      return {
        id: reportId,
        title: request.title,
        type: request.type,
        format: request.format,
        generatedAt: new Date().toISOString(),
        rowCount,
        fileSizeBytes,
        filePath: `/reports/${reportId}.${request.format}`,
        status: 'completed',
      };
    } catch (error) {
      logger.error('Report generation failed', { error: (error as Error).message, type: request.type });
      return {
        id: reportId, title: request.title, type: request.type, format: request.format,
        generatedAt: new Date().toISOString(), rowCount: 0, fileSizeBytes: 0,
        filePath: '', status: 'failed', error: (error as Error).message,
      };
    }
  }

  async generateScheduledReport(templateId: string): Promise<ReportResult> {
    const template = this.getTemplate(templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);

    return this.generateReport({
      type: template.id,
      title: `${template.name} - ${new Date().toISOString().split('T')[0]}`,
      period: template.defaultPeriod,
      format: template.formats[0],
    });
  }

  private async getReportData(request: ReportRequest): Promise<any> {
    // In production, fetch actual data from the data warehouse
    // For now, return mock data structure
    const mockData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      metric: `Metric ${i + 1}`,
      value: Math.round(Math.random() * 100000 * 100) / 100,
      previousValue: Math.round(Math.random() * 100000 * 100) / 100,
      change: Math.round((Math.random() * 0.4 - 0.1) * 10000) / 100,
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      category: ['Revenue', 'Orders', 'Customers', 'Delivery', 'Inventory'][Math.floor(Math.random() * 5)],
      status: ['on_track', 'at_risk', 'exceeded', 'critical'][Math.floor(Math.random() * 4)],
    }));

    return {
      columns: [
        { key: 'date', header: 'Date', format: 'date' },
        { key: 'metric', header: 'Metric', format: 'text' },
        { key: 'value', header: 'Value', format: 'currency' },
        { key: 'change', header: 'Change %', format: 'percentage' },
        { key: 'category', header: 'Category', format: 'text' },
        { key: 'status', header: 'Status', format: 'text' },
      ],
      data: mockData,
      sections: [{
        title: 'Report Data', type: 'table' as const,
        content: { columns: [], data: mockData },
        columns: [{ header: 'Date', key: 'date' }, { header: 'Value', key: 'value' }],
        data: mockData,
      }],
    };
  }
}

export default EnterpriseReports.getInstance();
