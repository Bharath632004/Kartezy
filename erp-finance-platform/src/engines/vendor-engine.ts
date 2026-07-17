/**
 * Kartezy Enterprise ERP & Finance Platform — Vendor & Supplier Management Engine
 *
 * Complete vendor lifecycle: registration, KYC, contracts, performance tracking,
 * risk scoring, and category management.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, calculateGrowthRate, avg } from '../utils/helpers';
import type {
  Vendor, VendorContract, VendorPerformance, VendorType, VendorStatus,
  VendorRiskLevel, ContractType, Address, BankAccount, EntityStatus,
} from '../types';

const logger = createLogger('VendorEngine');

export class VendorManagementEngine {
  private static instance: VendorManagementEngine;
  private vendors: Map<string, Vendor> = new Map();
  private contracts: Map<string, VendorContract> = new Map();
  private performanceRecords: Map<string, VendorPerformance[]> = new Map();

  static getInstance(): VendorManagementEngine {
    if (!VendorManagementEngine.instance) {
      VendorManagementEngine.instance = new VendorManagementEngine();
    }
    return VendorManagementEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Vendor Management Engine');
  }

  // ── Vendor CRUD ──

  createVendor(data: {
    vendorType: VendorType;
    name: string;
    legalName: string;
    gstin?: string;
    pan?: string;
    email: string;
    phone: string;
    address: Address;
    bankAccount?: BankAccount;
    categories?: string[];
    tags?: string[];
    notes?: string;
  }): Vendor {
    const now = new Date().toISOString();
    const vendor: Vendor = {
      id: generateId('VEN'),
      vendorType: data.vendorType,
      name: data.name,
      legalName: data.legalName,
      gstin: data.gstin,
      pan: data.pan,
      email: data.email,
      phone: data.phone,
      address: data.address,
      bankAccount: data.bankAccount,
      status: 'ACTIVE',
      riskLevel: 'LOW',
      rating: 0,
      totalOrders: 0,
      totalSpend: 0,
      onTimeDeliveryRate: 1,
      qualityScore: 1,
      categories: data.categories || [],
      tags: data.tags || [],
      contracts: [],
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };
    this.vendors.set(vendor.id, vendor);
    logger.info(`Created vendor: ${vendor.name} (${vendor.id})`);
    return vendor;
  }

  getVendor(id: string): Vendor | undefined {
    return this.vendors.get(id);
  }

  getAllVendors(filters?: {
    type?: VendorType; status?: VendorStatus; riskLevel?: VendorRiskLevel;
    category?: string; search?: string;
  }): Vendor[] {
    let list = Array.from(this.vendors.values());
    if (filters?.type) list = list.filter(v => v.vendorType === filters.type);
    if (filters?.status) list = list.filter(v => v.status === filters.status);
    if (filters?.riskLevel) list = list.filter(v => v.riskLevel === filters.riskLevel);
    if (filters?.category) list = list.filter(v => v.categories.includes(filters.category!));
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(v =>
        v.name.toLowerCase().includes(s) ||
        v.legalName.toLowerCase().includes(s) ||
        v.email.toLowerCase().includes(s) ||
        v.gstin?.toLowerCase().includes(s) ||
        v.pan?.toLowerCase().includes(s)
      );
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateVendor(id: string, updates: Partial<Vendor>): Vendor {
    const vendor = this.vendors.get(id);
    if (!vendor) throw new Error(`Vendor ${id} not found`);
    Object.assign(vendor, updates, { updatedAt: new Date().toISOString() });
    this.vendors.set(id, vendor);
    return vendor;
  }

  updateVendorStatus(id: string, status: VendorStatus): Vendor {
    return this.updateVendor(id, { status });
  }

  updateVendorRiskLevel(id: string, riskLevel: VendorRiskLevel): Vendor {
    return this.updateVendor(id, { riskLevel });
  }

  // ── Contracts ──

  createContract(data: {
    vendorId: string;
    contractType: ContractType;
    startDate: string;
    endDate?: string;
    terms: string;
    rateAmount: number;
    rateUnit?: string;
    minimumCommitment?: number;
    noticePeriodDays: number;
    autoRenew: boolean;
  }): VendorContract {
    const vendor = this.vendors.get(data.vendorId);
    if (!vendor) throw new Error(`Vendor ${data.vendorId} not found`);

    const now = new Date().toISOString();
    const contract: VendorContract = {
      id: generateId('CON'),
      vendorId: data.vendorId,
      contractType: data.contractType,
      startDate: data.startDate,
      endDate: data.endDate,
      terms: data.terms,
      rateAmount: data.rateAmount,
      rateUnit: data.rateUnit,
      minimumCommitment: data.minimumCommitment,
      noticePeriodDays: data.noticePeriodDays,
      autoRenew: data.autoRenew,
      status: 'ACTIVE',
      createdAt: now,
    };
    this.contracts.set(contract.id, contract);
    vendor.contracts.push(contract);
    vendor.updatedAt = now;
    this.vendors.set(data.vendorId, vendor);
    logger.info(`Created contract for vendor ${vendor.name}`);
    return contract;
  }

  getContract(id: string): VendorContract | undefined {
    return this.contracts.get(id);
  }

  getVendorContracts(vendorId: string): VendorContract[] {
    return Array.from(this.contracts.values())
      .filter(c => c.vendorId === vendorId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateContractStatus(contractId: string, status: EntityStatus): VendorContract {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error(`Contract ${contractId} not found`);
    contract.status = status;
    this.contracts.set(contractId, contract);
    return contract;
  }

  // ── Performance Tracking ──

  recordPerformance(data: {
    vendorId: string;
    period: string;
    totalOrders: number;
    onTimeDeliveries: number;
    qualityScore: number;
    responseTimeHours: number;
    returnRate: number;
    spend: number;
  }): VendorPerformance {
    const record: VendorPerformance = {
      vendorId: data.vendorId,
      period: data.period,
      totalOrders: data.totalOrders,
      onTimeDeliveries: data.onTimeDeliveries,
      qualityScore: data.qualityScore,
      responseTimeHours: data.responseTimeHours,
      returnRate: data.returnRate,
      rating: roundTo((data.qualityScore * 0.4 + (data.onTimeDeliveries / Math.max(data.totalOrders, 1)) * 0.3 + (1 - data.returnRate) * 0.3) * 5),
      spend: data.spend,
    };

    const existing = this.performanceRecords.get(data.vendorId) || [];
    const existingIdx = existing.findIndex(r => r.period === data.period);
    if (existingIdx >= 0) {
      existing[existingIdx] = record;
    } else {
      existing.push(record);
    }
    this.performanceRecords.set(data.vendorId, existing);

    // Update vendor aggregated metrics
    const vendor = this.vendors.get(data.vendorId);
    if (vendor) {
      const allRecords = existing;
      vendor.totalOrders = allRecords.reduce((s, r) => s + r.totalOrders, 0);
      vendor.totalSpend = allRecords.reduce((s, r) => s + r.spend, 0);
      vendor.onTimeDeliveryRate = allRecords.length > 0
        ? roundTo(allRecords.reduce((s, r) => s + (r.onTimeDeliveries / Math.max(r.totalOrders, 1)), 0) / allRecords.length)
        : 1;
      vendor.qualityScore = allRecords.length > 0
        ? roundTo(avg(allRecords.map(r => r.qualityScore)))
        : 1;
      vendor.rating = allRecords.length > 0
        ? roundTo(avg(allRecords.map(r => r.rating)), 1)
        : 0;
      this.vendors.set(data.vendorId, vendor);
    }

    return record;
  }

  getVendorPerformance(vendorId: string, periods?: number): VendorPerformance[] {
    const records = this.performanceRecords.get(vendorId) || [];
    const sorted = records.sort((a, b) => b.period.localeCompare(a.period));
    return periods ? sorted.slice(0, periods) : sorted;
  }

  getVendorPerformanceSummary(vendorId: string): {
    averageRating: number;
    averageQualityScore: number;
    onTimeDeliveryRate: number;
    averageResponseTime: number;
    averageReturnRate: number;
    totalSpend: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  } | undefined {
    const records = this.performanceRecords.get(vendorId);
    if (!records || records.length === 0) return undefined;

    const recent = records.sort((a, b) => b.period.localeCompare(a.period));
    const current = recent[0];
    const previous = recent.length > 1 ? recent[1] : undefined;

    const trend = !previous ? 'STABLE' :
      current.rating > previous.rating ? 'IMPROVING' :
      current.rating < previous.rating ? 'DECLINING' : 'STABLE';

    return {
      averageRating: roundTo(avg(recent.map(r => r.rating)), 1),
      averageQualityScore: roundTo(avg(recent.map(r => r.qualityScore)), 2),
      onTimeDeliveryRate: roundTo(avg(recent.map(r => r.onTimeDeliveries / Math.max(r.totalOrders, 1))), 2),
      averageResponseTime: roundTo(avg(recent.map(r => r.responseTimeHours)), 1),
      averageReturnRate: roundTo(avg(recent.map(r => r.returnRate)), 3),
      totalSpend: recent.reduce((s, r) => s + r.spend, 0),
      trend,
    };
  }

  // ── Risk Assessment ──

  assessVendorRisk(vendorId: string): VendorRiskLevel {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error(`Vendor ${vendorId} not found`);

    const perf = this.getVendorPerformanceSummary(vendorId);
    if (!perf) return vendor.riskLevel;

    let score = 0;
    if (perf.averageRating >= 4) score += 10;
    else if (perf.averageRating >= 3) score += 5;
    else score -= 5;

    if (perf.onTimeDeliveryRate >= 0.95) score += 10;
    else if (perf.onTimeDeliveryRate >= 0.85) score += 5;
    else score -= 5;

    if (perf.averageReturnRate <= 0.02) score += 10;
    else if (perf.averageReturnRate <= 0.05) score += 5;
    else score -= 5;

    if (vendor.totalSpend > 1000000) score += 5; // High value vendor
    if (vendor.contracts.length > 0) score += 5;

    const risk: VendorRiskLevel = score >= 25 ? 'LOW' : score >= 15 ? 'MEDIUM' : score >= 5 ? 'HIGH' : 'CRITICAL';
    vendor.riskLevel = risk;
    this.vendors.set(vendorId, vendor);
    return risk;
  }

  // ── Analytics ──

  getVendorAnalytics(): {
    totalVendors: number;
    activeVendors: number;
    byType: Record<VendorType, number>;
    byRiskLevel: Record<VendorRiskLevel, number>;
    totalSpend: number;
    averageRating: number;
    averageDeliveryRate: number;
  } {
    const all = Array.from(this.vendors.values());
    const active = all.filter(v => v.status === 'ACTIVE');

    return {
      totalVendors: all.length,
      activeVendors: active.length,
      byType: {
        SUPPLIER: all.filter(v => v.vendorType === 'SUPPLIER').length,
        MANUFACTURER: all.filter(v => v.vendorType === 'MANUFACTURER').length,
        DISTRIBUTOR: all.filter(v => v.vendorType === 'DISTRIBUTOR').length,
        SERVICE_PROVIDER: all.filter(v => v.vendorType === 'SERVICE_PROVIDER').length,
        CONTRACTOR: all.filter(v => v.vendorType === 'CONTRACTOR').length,
      },
      byRiskLevel: {
        LOW: all.filter(v => v.riskLevel === 'LOW').length,
        MEDIUM: all.filter(v => v.riskLevel === 'MEDIUM').length,
        HIGH: all.filter(v => v.riskLevel === 'HIGH').length,
        CRITICAL: all.filter(v => v.riskLevel === 'CRITICAL').length,
      },
      totalSpend: all.reduce((s, v) => s + v.totalSpend, 0),
      averageRating: active.length > 0 ? roundTo(avg(active.map(v => v.rating)), 1) : 0,
      averageDeliveryRate: active.length > 0 ? roundTo(avg(active.map(v => v.onTimeDeliveryRate)), 2) : 0,
    };
  }

  reset(): void {
    this.vendors.clear();
    this.contracts.clear();
    this.performanceRecords.clear();
  }
}

export default VendorManagementEngine.getInstance();
