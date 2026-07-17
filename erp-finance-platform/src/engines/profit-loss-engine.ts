/**
 * Kartezy Enterprise ERP & Finance Platform — Profit & Loss Engine
 *
 * Generates comprehensive P&L statements with revenue breakdown,
 * cost analysis, margin calculations, and period-over-period comparisons.
 */

import { createLogger } from '../utils/logger';
import { roundTo, sum, calculateGrowthRate } from '../utils/helpers';
import type {
  ProfitLossStatement, PLSection, AccountType, ChartOfAccount,
} from '../types';

const logger = createLogger('ProfitLossEngine');

export class ProfitLossEngine {
  private static instance: ProfitLossEngine;

  static getInstance(): ProfitLossEngine {
    if (!ProfitLossEngine.instance) {
      ProfitLossEngine.instance = new ProfitLossEngine();
    }
    return ProfitLossEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Profit & Loss Engine');
  }

  generatePL(
    accounts: ChartOfAccount[],
    fromDate: string,
    toDate: string,
    period: string,
    previousPeriodAccounts?: ChartOfAccount[],
  ): ProfitLossStatement {
    const revenueAccounts = accounts.filter(a => a.accountType === 'REVENUE');
    const expenseAccounts = accounts.filter(a =>
      ['EXPENSE', 'CONTRA_REVENUE'].includes(a.accountType)
    );

    const totalRevenue = roundTo(sum(revenueAccounts.map(a => a.balance)));
    const cogsAccounts = expenseAccounts.filter(a => a.accountSubType === 'DIRECT');
    const operatingExpenseAccounts = expenseAccounts.filter(a =>
      a.accountSubType === 'INDIRECT' || a.accountSubType === 'OPERATING'
    );
    const otherExpenseAccounts = expenseAccounts.filter(a => a.accountSubType === 'NON_OPERATING');

    const totalCOGS = roundTo(sum(cogsAccounts.map(a => a.balance)));
    const grossProfit = roundTo(totalRevenue - totalCOGS);
    const grossMargin = totalRevenue > 0 ? roundTo(grossProfit / totalRevenue, 4) : 0;

    const buildSection = (title: string, accts: ChartOfAccount[]): PLSection => {
      const items = accts.map(a => ({
        name: a.accountName,
        amount: a.balance,
        percentageOfRevenue: totalRevenue > 0 ? roundTo(a.balance / totalRevenue, 4) : 0,
      }));
      const total = roundTo(sum(items.map(i => i.amount)));
      return { title, total, items };
    };

    const revenue = buildSection('Revenue', revenueAccounts);
    const costOfGoodsSold = buildSection('Cost of Goods Sold', cogsAccounts);
    const operatingExpenses = buildSection('Operating Expenses', operatingExpenseAccounts);

    const totalOperatingExpenses = operatingExpenses.total;
    const operatingIncome = roundTo(grossProfit - totalOperatingExpenses);
    const operatingMargin = totalRevenue > 0 ? roundTo(operatingIncome / totalRevenue, 4) : 0;

    const otherIncomeItems = revenueAccounts.filter(a => a.accountSubType === 'NON_OPERATING');
    const otherIncome: PLSection = {
      title: 'Other Income',
      total: roundTo(sum(otherIncomeItems.map(a => a.balance))),
      items: otherIncomeItems.map(a => ({
        name: a.accountName, amount: a.balance,
        percentageOfRevenue: totalRevenue > 0 ? roundTo(a.balance / totalRevenue, 4) : 0,
      })),
    };

    const otherExpenses: PLSection = {
      title: 'Other Expenses',
      total: roundTo(sum(otherExpenseAccounts.map(a => a.balance))),
      items: otherExpenseAccounts.map(a => ({
        name: a.accountName, amount: a.balance,
        percentageOfRevenue: totalRevenue > 0 ? roundTo(a.balance / totalRevenue, 4) : 0,
      })),
    };

    const netProfitBeforeTax = roundTo(operatingIncome + otherIncome.total - otherExpenses.total);
    const taxExpenseAccounts = expenseAccounts.filter(a => a.accountName.toLowerCase().includes('tax'));
    const taxExpense = roundTo(sum(taxExpenseAccounts.map(a => a.balance)));
    const effectiveTaxRate = netProfitBeforeTax > 0 ? roundTo(taxExpense / netProfitBeforeTax, 4) : 0;
    const netProfit = roundTo(netProfitBeforeTax - taxExpense);
    const netMargin = totalRevenue > 0 ? roundTo(netProfit / totalRevenue, 4) : 0;

    // Previous period comparison
    const prevRevenue = previousPeriodAccounts
      ? roundTo(sum(previousPeriodAccounts.filter(a => a.accountType === 'REVENUE').map(a => a.balance)))
      : 0;
    const prevNetProfit = previousPeriodAccounts
      ? roundTo(
          sum(previousPeriodAccounts.filter(a => a.accountType === 'REVENUE').map(a => a.balance)) -
          sum(previousPeriodAccounts.filter(a => ['EXPENSE', 'CONTRA_REVENUE'].includes(a.accountType)).map(a => a.balance))
        )
      : 0;

    return {
      period,
      fromDate,
      toDate,
      revenue,
      costOfGoodsSold,
      grossProfit,
      grossMargin,
      operatingExpenses,
      operatingIncome,
      operatingMargin,
      otherIncome,
      otherExpenses,
      netProfitBeforeTax,
      taxExpense,
      effectiveTaxRate,
      netProfit,
      netMargin,
      previousPeriod: { netProfit: prevNetProfit, revenue: prevRevenue },
      yoyGrowth: calculateGrowthRate(totalRevenue, prevRevenue),
    };
  }

  reset(): void {
    // No state to reset
  }
}

export default ProfitLossEngine.getInstance();
