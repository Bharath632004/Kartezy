/**
 * Kartezy Enterprise Business Intelligence Platform
 *
 * Complete enterprise BI solution with:
 * - Data Warehouse (PostgreSQL star-schema)
 * - Data Lake for raw data storage
 * - ETL & ELT Pipeline definitions
 * - Analytics engines (Customer, Merchant, Delivery, Finance, Marketing, Product, Inventory)
 * - Heat Maps, City Analytics, Cohort Analysis, Funnel Analysis
 * - CLV Prediction, Churn Prediction
 * - KPI Dashboards, Executive Dashboard, Board Reports
 * - BI Tool Integrations (Power BI, Looker, Metabase, Apache Superset)
 * - Enterprise Reports (CSV, Excel, PDF)
 * - Data Source Integrations (PostgreSQL, MongoDB, Redis, Kafka, Elasticsearch, AI)
 * - Admin Dashboard Synchronization
 */

export { getBIConfig, defaultBIConfig } from './config';
export type { BIConfig } from './config';

// Warehouse
export { DataWarehouse } from './warehouse/data-warehouse';
export { DataLake } from './warehouse/data-lake';
export { ETLPipelineManager } from './warehouse/etl-pipeline';
export type { ETLPipeline, ETLRun, PipelineStatus, LoadStrategy } from './warehouse/etl-pipeline';
export { ELTPipelineManager } from './warehouse/elt-pipeline';
export type { ELTTransformation } from './warehouse/elt-pipeline';
export {
  allDWTables, dimDate, dimCustomer, dimMerchant, dimProduct,
  dimDeliveryPartner, dimLocation, dimPromotion,
  factOrders, factOrderItems, factPayments, factDeliveries,
  factInventory, factCustomerActivity, factMarketing,
  generateWarehouseDDL, getFactTables, getDimensionTables,
} from './warehouse/schemas';
export type { DWTable, DWColumn } from './warehouse/schemas';

// Analytics
export { CustomerAnalytics } from './analytics/customer-analytics';
export type { CustomerOverview, CustomerSegment, CustomerAcquisition, CustomerRetention, CustomerBehavior } from './analytics/customer-analytics';

export { MerchantAnalytics } from './analytics/merchant-analytics';
export type { MerchantOverview, MerchantPerformance, MerchantBenchmark } from './analytics/merchant-analytics';

export { DeliveryAnalytics } from './analytics/delivery-analytics';
export type { DeliveryOverview, DriverPerformance, ZoneAnalytics } from './analytics/delivery-analytics';

export { FinanceAnalytics } from './analytics/finance-analytics';
export type { FinanceOverview, RevenueBreakdown, PayoutSummary, CommissionSummary, GSTReport } from './analytics/finance-analytics';

export { MarketingAnalytics } from './analytics/marketing-analytics';
export type { MarketingOverview, CampaignPerformance, ChannelPerformance } from './analytics/marketing-analytics';

export { ProductAnalytics } from './analytics/product-analytics';
export type { ProductOverview, ProductPerformance, CategoryAnalytics } from './analytics/product-analytics';

export { InventoryAnalytics } from './analytics/inventory-analytics';
export type { InventoryOverview, ProductInventory, ReplenishmentSuggestion } from './analytics/inventory-analytics';

export { HeatMapAnalytics } from './analytics/heat-maps';
export type { HeatMapPoint, HeatMapRegion, CityCluster } from './analytics/heat-maps';

export { CityAnalytics } from './analytics/city-analytics';
export type { CityPerformance, CityComparison, CityHeatMap } from './analytics/city-analytics';

export { CohortAnalysis } from './analytics/cohort-analysis';
export type { CohortMatrix, CohortRow, CohortSummary } from './analytics/cohort-analysis';

export { FunnelAnalysis } from './analytics/funnel-analysis';
export type { FunnelStage, FunnelComparison, FunnelInsight } from './analytics/funnel-analysis';

export { CLVAnalysis } from './analytics/clv-analysis';
export type { CLVAnalysisResult, CLVDistribution, CLVForecast } from './analytics/clv-analysis';

export { ChurnPrediction } from './analytics/churn-prediction';
export type { ChurnPredictionResult, ChurnAnalysisOverview, ChurnSegment } from './analytics/churn-prediction';

// Dashboards
export { KPIDashboard } from './dashboards/kpi-dashboard';
export type { KPIOverview, KPIMetric, Scorecard, KPIAlert, KPIHistoricalTrend } from './dashboards/kpi-dashboard';

export { ExecutiveDashboard } from './dashboards/executive-dashboard';
export type { ExecutiveSummary, RevenuePerformance, BusinessHealth } from './dashboards/executive-dashboard';

export { BoardReports } from './dashboards/board-reports';
export type { BoardReport, BoardReportSection, QuarterlyBoardReport } from './dashboards/board-reports';
export type { DashboardConfig, WidgetConfig, MetricCard, ChartData, ExportOptions, PeriodFilter, FilterOption } from './dashboards/dashboard-types';

// BI Tools
export { BIAdapter, createBIAdapter } from './bi-tools/bi-adapter';
export type { BIConnectionConfig, BIDashboardDefinition, BIDatasource, BIQueryResult } from './bi-tools/bi-adapter';
export { POWER_BI_DATASETS, POWER_BI_DASHBOARDS, getPowerBIDataModelDocumentation } from './bi-tools/power-bi';
export { getLookerModelYAML, getLookerViewYAML, LOOKER_EXPLORES, LOOKER_DASHBOARDS } from './bi-tools/looker';
export { getMetabaseSetupGuide, METABASE_DASHBOARDS, METABASE_COLLECTIONS } from './bi-tools/metabase';
export { SUPERSET_DATABASES, SUPERSET_PREBUILT_CHARTS, SUPERSET_DASHBOARDS, getSupersetImportGuide } from './bi-tools/superset';

// Reports
export { EnterpriseReports } from './reports/enterprise-reports';
export type { ReportRequest, ReportResult, ReportTemplate, ReportFormat } from './reports/enterprise-reports';
export { CSVExporter } from './reports/csv-exporter';
export type { CSVExportOptions, CSVColumn } from './reports/csv-exporter';
export { ExcelExporter } from './reports/excel-exporter';
export type { ExcelWorkbook, ExcelSheet, ExcelColumn, ExcelChart, ExcelStyle } from './reports/excel-exporter';
export { PDFExporter } from './reports/pdf-exporter';
export type { PDFReportConfig, PDFSection } from './reports/pdf-exporter';

// Integrations
export { IntegrationManager, PostgresIntegration, MongoDBIntegration, RedisIntegration, KafkaIntegration, ElasticsearchIntegration, AIPlatformIntegration } from './integrations';
export type { IntegrationStatus, DataSourceQuery, DataSourceResult } from './integrations';

// Services
export { DataSyncService } from './services/data-sync';
export type { SyncState, SyncDataPacket } from './services/data-sync';

// Utilities
export { createBILogger, BILogger, LogLevel } from './utils/logger';
export { generateBIId, formatINR, formatPercent, growthRate, cagr, movingAverage, linearRegression, getDateRange, paginate, aggregateBy, generateTimeSeries } from './utils/helpers';
export type { DateRange } from './utils/helpers';
