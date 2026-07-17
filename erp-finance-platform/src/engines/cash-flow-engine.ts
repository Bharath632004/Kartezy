/**
 * Kartezy Enterprise ERP & Finance Platform — Cash Flow Engine
 *
 * Cash flow statement generation, forecasting, and working capital
 * analysis across operating, investing, and financing activities.
 */

import { createLogger } from '../utils/logger';
import { roundTo, sum } from '../utils/helpers';
import type {
  CashFlowStatement, CashFlowActivity, CashFlowCategory, CashFlowForecast,
} from '../types';

const logger = createLogger('CashFlowEngine');

export class CashFlowEngine {
  private static instance: CashFlowEngine;

  static getInstance(): CashFlowEngine {
    if (!CashFlowEngine.instance) {
      CashFlowEngine.instance = new CashFlowEngine();
    }
    return CashFlowEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Cash Flow Engine');
  }

  generateCashFlowStatement(
    period: string,
    fromDate: string,
    toDate: string,
    openingBalance: number,
    activities: CashFlowActivity[],
  ): CashFlowStatement {
    const operating = activities.filter(a => a.category === 'OPERATING');
    const investing = activities.filter(a => a.category === 'INVESTING');
    const financing = activities.filter(a => a.category === 'FINANCING');

    const netOperating = roundTo(sum(operating.map(a => a.amount)));
    const netInvesting = roundTo(sum(investing.map(a => a.amount)));
    const netFinancing = roundTo(sum(financing.map(a => a.amount)));
    const netCashFlow = roundTo(netOperating + netInvesting + netFinancing);
    const closingBalance = roundTo(openingBalance + netCashFlow);

    return {
      period,
      fromDate,
      toDate,
      openingBalance,
      operatingActivities: operating,
      investingActivities: investing,
      financingActivities: financing,
      netOperatingCashFlow: netOperating,
      netInvestingCashFlow: netInvesting,
      netFinancingCashFlow: netFinancing,
      netCashFlow,
      closingBalance,
    };
  }

  // ── Typical Cash Flow Activities ──

  createOperatingActivity(name: string, amount: number, description?: string): CashFlowActivity {
    return { name, amount, category: 'OPERATING', description };
  }

  createInvestingActivity(name: string, amount: number, description?: string): CashFlowActivity {
    return { name, amount, category: 'INVESTING', description };
  }

  createFinancingActivity(name: string, amount: number, description?: string): CashFlowActivity {
    return { name, amount, category: 'FINANCING', description };
  }

  // ── Forecast ──

  generateCashFlowForecast(
    period: string,
    currentBalance: number,
    historicalActivities: CashFlowActivity[],
    growthRate: number = 0.1,
  ): CashFlowForecast {
    const totalInflows = roundTo(
      sum(historicalActivities.filter(a => a.amount > 0).map(a => a.amount)) * (1 + growthRate)
    );
    const totalOutflows = roundTo(
      Math.abs(sum(historicalActivities.filter(a => a.amount < 0).map(a => a.amount))) * (1 + growthRate)
    );
    const projectedClosing = roundTo(currentBalance + totalInflows - totalOutflows);

    return {
      period,
      projectedOpening: currentBalance,
      projectedInflows: totalInflows,
      projectedOutflows: totalOutflows,
      projectedClosing,
      confidenceInterval: {
        lower: roundTo(projectedClosing * 0.8),
        upper: roundTo(projectedClosing * 1.2),
      },
      riskFactors: [
        'Market volatility',
        'Payment delays',
        'Seasonal variations',
        'Regulatory changes',
      ],
    };
  }

  // ── Working Capital Analysis ──

  analyzeWorkingCapital(
    currentAssets: number,
    currentLiabilities: number,
    inventory: number,
    receivables: number,
    payables: number,
  ): {
    workingCapital: number;
    currentRatio: number;
    quickRatio: number;
    inventoryTurnover: number;
    receivablesDays: number;
    payablesDays: number;
    cashConversionCycle: number;
  } {
    const workingCapital = roundTo(currentAssets - currentLiabilities);
    return {
      workingCapital,
      currentRatio: currentLiabilities > 0 ? roundTo(currentAssets / currentLiabilities, 2) : 0,
      quickRatio: currentLiabilities > 0
        ? roundTo((currentAssets - inventory) / currentLiabilities, 2)
        : 0,
      inventoryTurnover: inventory > 0 ? roundTo(365 / (inventory / 1000), 1) : 0,
      receivablesDays: receivables > 0 ? roundTo((receivables / 1000) * 365, 1) : 0,
      payablesDays: payables > 0 ? roundTo((payables / 1000) * 365, 1) : 0,
      cashConversionCycle: 0, // Simplified
    };
  }

  reset(): void {
    // No state to reset
  }
}

export default CashFlowEngine.getInstance();
