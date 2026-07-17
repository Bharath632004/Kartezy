/**
 * Kartezy Enterprise ERP & Finance Platform — GST & Tax Engine
 *
 * Complete GST compliance: registration management, return filing (GSTR1, GSTR3B),
 * tax rate management, tax calculation, input tax credit, and TDS handling.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum } from '../utils/helpers';
import type {
  GSTRegistration, GSTReturn, GSTSupplySummary, GSTType, GSTFilingStatus,
  TaxRate, TaxCalculation, TaxBreakdown, EntityStatus,
} from '../types';

const logger = createLogger('GSTTaxEngine');

export class GSTTaxEngine {
  private static instance: GSTTaxEngine;
  private registrations: Map<string, GSTRegistration> = new Map();
  private returns: Map<string, GSTReturn> = new Map();
  private taxRates: Map<string, TaxRate> = new Map();
  private returnCounter: number = 0;

  static getInstance(): GSTTaxEngine {
    if (!GSTTaxEngine.instance) {
      GSTTaxEngine.instance = new GSTTaxEngine();
    }
    return GSTTaxEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing GST & Tax Engine');
    this.seedTaxRates();
  }

  private seedTaxRates(): void {
    const rates: TaxRate[] = [
      { id: generateId('TAX'), name: 'GST 0%', rate: 0, gstType: 'IGST', category: 'exempt', isActive: true, effectiveFrom: '2017-07-01' },
      { id: generateId('TAX'), name: 'GST 5%', rate: 0.05, gstType: 'IGST', category: 'standard', isActive: true, effectiveFrom: '2017-07-01' },
      { id: generateId('TAX'), name: 'GST 12%', rate: 0.12, gstType: 'IGST', category: 'standard', isActive: true, effectiveFrom: '2017-07-01' },
      { id: generateId('TAX'), name: 'GST 18%', rate: 0.18, gstType: 'IGST', category: 'standard', isActive: true, effectiveFrom: '2017-07-01' },
      { id: generateId('TAX'), name: 'GST 28%', rate: 0.28, gstType: 'IGST', category: 'luxury', isActive: true, effectiveFrom: '2017-07-01' },
      { id: generateId('TAX'), name: 'CGST 9% + SGST 9%', rate: 0.18, gstType: 'CGST', hsnSacCode: '9985', category: 'standard', isActive: true, effectiveFrom: '2017-07-01' },
      { id: generateId('TAX'), name: 'TDS 1%', rate: 0.01, gstType: 'IGST', category: 'tds', isActive: true, effectiveFrom: '2020-10-01' },
      { id: generateId('TAX'), name: 'TDS 2%', rate: 0.02, gstType: 'IGST', category: 'tds', isActive: true, effectiveFrom: '2020-10-01' },
      { id: generateId('TAX'), name: 'TCS 1%', rate: 0.01, gstType: 'IGST', category: 'tcs', isActive: true, effectiveFrom: '2020-10-01' },
    ];
    for (const rate of rates) {
      this.taxRates.set(rate.id, rate);
    }
    logger.info(`Seeded ${rates.length} tax rates`);
  }

  // ── Tax Rates ──

  getTaxRate(id: string): TaxRate | undefined {
    return this.taxRates.get(id);
  }

  getTaxRates(category?: string): TaxRate[] {
    let rates = Array.from(this.taxRates.values()).filter(r => r.isActive);
    if (category) rates = rates.filter(r => r.category === category);
    return rates.sort((a, b) => a.rate - b.rate);
  }

  getApplicableTaxRate(amount: number, category: string, isInterState: boolean): TaxCalculation {
    const rates = this.getTaxRates(category);
    const rate = rates.length > 0 ? rates[0] : undefined;
    const taxRate = rate?.rate || 0;
    const totalTax = roundTo(amount * taxRate);

    if (isInterState) {
      return { taxableValue: amount, taxRate, taxType: 'IGST', taxAmount: totalTax, cessAmount: 0, totalTax };
    } else {
      const halfTax = roundTo(totalTax / 2);
      return { taxableValue: amount, taxRate, taxType: 'CGST', taxAmount: halfTax, cessAmount: 0, totalTax };
    }
  }

  calculateTaxBreakdown(taxableValue: number, rate: number, isInterState: boolean): TaxBreakdown {
    const totalTax = roundTo(taxableValue * rate);
    if (isInterState) {
      return { cgst: 0, sgst: 0, igst: totalTax, cess: 0, totalTax };
    } else {
      const half = roundTo(totalTax / 2);
      return { cgst: half, sgst: half, igst: 0, cess: 0, totalTax };
    }
  }

  // ── GST Registration ──

  registerGST(data: {
    gstin: string; legalName: string; tradeName: string;
    constitutionType: string; stateCode: string; stateName: string;
    isComposite?: boolean; businessType?: string[];
  }): GSTRegistration {
    const existing = Array.from(this.registrations.values()).find(r => r.gstin === data.gstin);
    if (existing) throw new Error(`GSTIN ${data.gstin} already registered`);

    const registration: GSTRegistration = {
      id: generateId('GST'),
      gstin: data.gstin,
      legalName: data.legalName,
      tradeName: data.tradeName,
      constitutionType: data.constitutionType,
      registrationDate: new Date().toISOString().split('T')[0],
      stateCode: data.stateCode,
      stateName: data.stateName,
      status: 'ACTIVE',
      isComposite: data.isComposite || false,
      businessType: data.businessType || ['retail'],
    };
    this.registrations.set(registration.id, registration);
    logger.info(`Registered GSTIN: ${data.gstin}`);
    return registration;
  }

  getGSTRegistration(id: string): GSTRegistration | undefined {
    return this.registrations.get(id);
  }

  getGSTRegistrationByGSTIN(gstin: string): GSTRegistration | undefined {
    return Array.from(this.registrations.values()).find(r => r.gstin === gstin);
  }

  cancelGSTRegistration(id: string): GSTRegistration {
    const reg = this.registrations.get(id);
    if (!reg) throw new Error(`GST registration ${id} not found`);
    reg.status = 'INACTIVE';
    reg.cancellationDate = new Date().toISOString().split('T')[0];
    logger.info(`Cancelled GST registration: ${reg.gstin}`);
    return reg;
  }

  // ── GST Returns ──

  createGSTR1(period: string, financialYear: string): GSTReturn {
    const existing = Array.from(this.returns.values())
      .find(r => r.returnType === 'GSTR1' && r.period === period);
    if (existing) throw new Error(`GSTR1 for ${period} already exists`);

    this.returnCounter++;
    const now = new Date().toISOString();
    const dueDate = this.calculateDueDate(period);

    const gstReturn: GSTReturn = {
      id: generateId('GSTR'),
      returnType: 'GSTR1',
      period,
      financialYear,
      filingStatus: 'NOT_FILED',
      dueDate,
      totalSales: 0, taxableSales: 0, exemptSales: 0,
      outwardSupply: this.emptySupplySummary(),
      inwardSupply: this.emptySupplySummary(),
      taxLiability: { cgst: 0, sgst: 0, igst: 0, cess: 0, totalTax: 0 },
      inputTaxCredit: { cgst: 0, sgst: 0, igst: 0, cess: 0, totalTax: 0 },
      netPayable: { cgst: 0, sgst: 0, igst: 0, cess: 0, totalTax: 0 },
      totalPaid: 0,
      createdAt: now,
    };
    this.returns.set(gstReturn.id, gstReturn);
    logger.info(`Created GSTR1 for period ${period}`);
    return gstReturn;
  }

  createGSTR3B(period: string, financialYear: string): GSTReturn {
    const existing = Array.from(this.returns.values())
      .find(r => r.returnType === 'GSTR3B' && r.period === period);
    if (existing) throw new Error(`GSTR3B for ${period} already exists`);

    this.returnCounter++;
    const now = new Date().toISOString();
    const dueDate = this.calculateDueDate(period, 20);

    const gstReturn: GSTReturn = {
      id: generateId('GSTR'),
      returnType: 'GSTR3B',
      period,
      financialYear,
      filingStatus: 'NOT_FILED',
      dueDate,
      totalSales: 0, taxableSales: 0, exemptSales: 0,
      outwardSupply: this.emptySupplySummary(),
      inwardSupply: this.emptySupplySummary(),
      taxLiability: { cgst: 0, sgst: 0, igst: 0, cess: 0, totalTax: 0 },
      inputTaxCredit: { cgst: 0, sgst: 0, igst: 0, cess: 0, totalTax: 0 },
      netPayable: { cgst: 0, sgst: 0, igst: 0, cess: 0, totalTax: 0 },
      totalPaid: 0,
      createdAt: now,
    };
    this.returns.set(gstReturn.id, gstReturn);
    logger.info(`Created GSTR3B for period ${period}`);
    return gstReturn;
  }

  addOutwardSupply(gstReturnId: string, supply: Partial<GSTSupplySummary>): GSTReturn {
    const ret = this.returns.get(gstReturnId);
    if (!ret) throw new Error(`GST return ${gstReturnId} not found`);

    ret.outwardSupply = {
      b2b: ret.outwardSupply.b2b + (supply.b2b || 0),
      b2c: ret.outwardSupply.b2c + (supply.b2c || 0),
      exports: ret.outwardSupply.exports + (supply.exports || 0),
      sez: ret.outwardSupply.sez + (supply.sez || 0),
      deemedExports: ret.outwardSupply.deemedExports + (supply.deemedExports || 0),
      advances: ret.outwardSupply.advances + (supply.advances || 0),
      creditNotes: ret.outwardSupply.creditNotes + (supply.creditNotes || 0),
      debitNotes: ret.outwardSupply.debitNotes + (supply.debitNotes || 0),
    };

    ret.totalSales = sum(Object.values(ret.outwardSupply));
    ret.taxableSales = ret.totalSales - ret.outwardSupply.exports - ret.outwardSupply.sez;
    this.returns.set(gstReturnId, ret);
    return ret;
  }

  computeTaxLiability(gstReturnId: string, supplies: Array<{
    value: number; rate: number; type: 'B2B' | 'B2C' | 'EXPORT' | 'SEZ';
  }>): GSTReturn {
    const ret = this.returns.get(gstReturnId);
    if (!ret) throw new Error(`GST return ${gstReturnId} not found`);

    let cgst = 0; let sgst = 0; let igst = 0; let cess = 0;
    for (const supply of supplies) {
      const tax = roundTo(supply.value * supply.rate);
      if (supply.type === 'EXPORT' || supply.type === 'SEZ') {
        igst = roundTo(igst + tax);
      } else {
        cgst = roundTo(cgst + tax / 2);
        sgst = roundTo(sgst + tax / 2);
      }
    }

    ret.taxLiability = { cgst, sgst, igst, cess, totalTax: roundTo(cgst + sgst + igst + cess) };
    ret.netPayable = {
      cgst: roundTo(Math.max(0, cgst)),
      sgst: roundTo(Math.max(0, sgst)),
      igst: roundTo(Math.max(0, igst)),
      cess: roundTo(Math.max(0, cess)),
      totalTax: roundTo(Math.max(0, cgst + sgst + igst + cess)),
    };
    this.returns.set(gstReturnId, ret);
    return ret;
  }

  fileReturn(gstReturnId: string, referenceNumber: string): GSTReturn {
    const ret = this.returns.get(gstReturnId);
    if (!ret) throw new Error(`GST return ${gstReturnId} not found`);
    if (ret.filingStatus !== 'NOT_FILED' && ret.filingStatus !== 'DRAFT') {
      throw new Error(`GST return already filed with status ${ret.filingStatus}`);
    }
    ret.filingStatus = 'FILED';
    ret.filedDate = new Date().toISOString().split('T')[0];
    ret.referenceNumber = referenceNumber;
    logger.info(`Filed ${ret.returnType} for ${ret.period} (ref: ${referenceNumber})`);
    return ret;
  }

  getGSTReturn(id: string): GSTReturn | undefined {
    return this.returns.get(id);
  }

  getGSTReturnsByPeriod(period: string): GSTReturn[] {
    return Array.from(this.returns.values()).filter(r => r.period === period);
  }

  // ── Helpers ──

  private emptySupplySummary(): GSTSupplySummary {
    return { b2b: 0, b2c: 0, exports: 0, sez: 0, deemedExports: 0, advances: 0, creditNotes: 0, debitNotes: 0 };
  }

  private calculateDueDate(period: string, day = 11): string {
    const [year, month] = period.split('-').map(Number);
    const dueMonth = month + 1 > 12 ? 1 : month + 1;
    const dueYear = month + 1 > 12 ? year + 1 : year;
    return `${dueYear}-${String(dueMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  // ── TDS ──

  calculateTDS(amount: number, tdsRate: number): number {
    return roundTo(amount * tdsRate);
  }

  generateTDSChallan(tdsAmount: number, period: string, deducteePan: string): {
    challanNumber: string; amount: number; period: string;
    depositDate: string; status: string;
  } {
    return {
      challanNumber: `TDS-${generateId().substring(0, 8)}`,
      amount: tdsAmount,
      period,
      depositDate: new Date().toISOString().split('T')[0],
      status: 'DEPOSITED',
    };
  }

  getTaxSummary(period: string): {
    totalTaxLiability: number; totalInputCredit: number; netPayable: number;
    tdsCollected: number; tcsCollected: number;
  } {
    const returns = Array.from(this.returns.values()).filter(r => r.period === period);
    return {
      totalTaxLiability: returns.reduce((s, r) => s + r.taxLiability.totalTax, 0),
      totalInputCredit: returns.reduce((s, r) => s + r.inputTaxCredit.totalTax, 0),
      netPayable: returns.reduce((s, r) => s + r.netPayable.totalTax, 0),
      tdsCollected: 0,
      tcsCollected: 0,
    };
  }

  reset(): void {
    this.registrations.clear();
    this.returns.clear();
    this.taxRates.clear();
    this.returnCounter = 0;
  }
}

export default GSTTaxEngine.getInstance();
