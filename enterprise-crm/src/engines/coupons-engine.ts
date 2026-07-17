/**
 * Kartezy Enterprise CRM — Coupons Engine
 *
 * Complete coupon management: creation, distribution, redemption tracking,
 * validation, expiry management, and analytics.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum, getCurrentDate } from '../utils/helpers';
import type { Coupon, CouponRedemption, CouponType, CouponStatus, CouponApplicability } from '../types';

const logger = createLogger('CouponsEngine');

export class CouponsEngine {
  private static instance: CouponsEngine;
  private coupons: Map<string, Coupon> = new Map();
  private redemptions: Map<string, CouponRedemption> = new Map();

  static getInstance(): CouponsEngine {
    if (!CouponsEngine.instance) {
      CouponsEngine.instance = new CouponsEngine();
    }
    return CouponsEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Coupons Engine');
  }

  createCoupon(data: {
    code: string; type: CouponType; value: number; maxDiscount?: number;
    minOrderValue?: number; applicability?: CouponApplicability;
    applicableIds?: string[]; usageLimit?: number;
    usageLimitPerCustomer?: number; startsAt?: string; expiresAt: string;
    isStackable?: boolean; customerSegments?: string[];
    description?: string; createdBy: string;
  }): Coupon {
    const now = new Date().toISOString();
    const existing = Array.from(this.coupons.values()).find(c => c.code === data.code);
    if (existing) throw new Error(`Coupon code ${data.code} already exists`);

    const coupon: Coupon = {
      id: generateId('CPN'),
      code: data.code.toUpperCase(),
      type: data.type,
      status: 'ACTIVE',
      value: data.value,
      maxDiscount: data.maxDiscount,
      minOrderValue: data.minOrderValue,
      applicability: data.applicability || 'ALL',
      applicableIds: data.applicableIds || [],
      usageLimit: data.usageLimit || 100,
      usageLimitPerCustomer: data.usageLimitPerCustomer || 1,
      totalUsed: 0,
      startsAt: data.startsAt || now,
      expiresAt: data.expiresAt,
      isStackable: data.isStackable || false,
      customerSegments: data.customerSegments || [],
      description: data.description,
      createdBy: data.createdBy,
      createdAt: now,
      updatedAt: now,
    };

    this.coupons.set(coupon.id, coupon);
    logger.info(`Created coupon: ${coupon.code} (${coupon.type} = ${coupon.value})`);
    return coupon;
  }

  getCoupon(id: string): Coupon | undefined {
    return this.coupons.get(id);
  }

  getCouponByCode(code: string): Coupon | undefined {
    return Array.from(this.coupons.values()).find(c => c.code === code.toUpperCase());
  }

  getAllCoupons(filters?: { status?: CouponStatus; type?: CouponType }): Coupon[] {
    let list = Array.from(this.coupons.values());
    if (filters?.status) list = list.filter(c => c.status === filters.status);
    if (filters?.type) list = list.filter(c => c.type === filters.type);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateCouponStatus(id: string, status: CouponStatus): Coupon {
    const coupon = this.coupons.get(id);
    if (!coupon) throw new Error(`Coupon ${id} not found`);
    coupon.status = status;
    coupon.updatedAt = new Date().toISOString();
    this.coupons.set(id, coupon);
    return coupon;
  }

  // ── Validation & Redemption ──

  validateCoupon(code: string, customerId: string, orderValue: number): {
    valid: boolean; coupon?: Coupon; error?: string;
    discountAmount?: number; finalAmount?: number;
  } {
    const coupon = this.getCouponByCode(code);
    if (!coupon) return { valid: false, error: 'Invalid coupon code' };

    const now = getCurrentDate();

    if (coupon.status !== 'ACTIVE') return { valid: false, error: `Coupon is ${coupon.status}` };
    if (coupon.startsAt > now) return { valid: false, error: 'Coupon not yet active' };
    if (coupon.expiresAt < now) return { valid: false, error: 'Coupon has expired' };
    if (coupon.totalUsed >= coupon.usageLimit) return { valid: false, error: 'Coupon usage limit reached' };

    // Check per-customer limit
    const customerRedemptions = Array.from(this.redemptions.values())
      .filter(r => r.couponId === coupon.id && r.customerId === customerId);
    if (customerRedemptions.length >= coupon.usageLimitPerCustomer) {
      return { valid: false, error: 'Coupon already used by this customer' };
    }

    if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
      return { valid: false, error: `Minimum order value of ${coupon.minOrderValue} required` };
    }

    // Calculate discount
    let discountAmount = 0;
    switch (coupon.type) {
      case 'PERCENTAGE':
        discountAmount = roundTo(orderValue * coupon.value / 100);
        if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        break;
      case 'FIXED_AMOUNT':
        discountAmount = Math.min(coupon.value, orderValue);
        break;
      case 'FREE_SHIPPING':
        discountAmount = 0;
        break;
      case 'BUY_X_GET_Y':
      case 'BOGO':
        discountAmount = roundTo(orderValue * 0.5);
        break;
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      finalAmount: roundTo(orderValue - discountAmount),
    };
  }

  redeemCoupon(code: string, customerId: string, orderId: string, orderValue: number): CouponRedemption {
    const validation = this.validateCoupon(code, customerId, orderValue);
    if (!validation.valid) throw new Error(validation.error);
    if (!validation.coupon || validation.discountAmount === undefined) throw new Error('Invalid coupon');

    const coupon = validation.coupon;
    const redemption: CouponRedemption = {
      id: generateId('CRD'),
      couponId: coupon.id,
      couponCode: coupon.code,
      customerId,
      orderId,
      discountAmount: validation.discountAmount,
      originalAmount: orderValue,
      finalAmount: validation.finalAmount || orderValue,
      redeemedAt: new Date().toISOString(),
    };

    this.redemptions.set(redemption.id, redemption);
    coupon.totalUsed++;
    this.coupons.set(coupon.id, coupon);
    logger.info(`Coupon ${coupon.code} redeemed: discount ${validation.discountAmount}`);
    return redemption;
  }

  getCouponRedemptions(couponId: string): CouponRedemption[] {
    return Array.from(this.redemptions.values())
      .filter(r => r.couponId === couponId)
      .sort((a, b) => b.redeemedAt.localeCompare(a.redeemedAt));
  }

  getCustomerRedemptions(customerId: string): CouponRedemption[] {
    return Array.from(this.redemptions.values())
      .filter(r => r.customerId === customerId)
      .sort((a, b) => b.redeemedAt.localeCompare(a.redeemedAt));
  }

  // ── Analytics ──

  getCouponAnalytics(): {
    totalCoupons: number; activeCoupons: number; totalRedemptions: number;
    totalDiscountGiven: number; averageDiscount: number;
    topCoupons: Array<{ code: string; redemptions: number; totalDiscount: number }>;
  } {
    const allCoupons = Array.from(this.coupons.values());
    const allRedemptions = Array.from(this.redemptions.values());

    const topCoupons = allCoupons.map(c => ({
      code: c.code,
      redemptions: allRedemptions.filter(r => r.couponId === c.id).length,
      totalDiscount: roundTo(sum(allRedemptions.filter(r => r.couponId === c.id).map(r => r.discountAmount))),
    })).sort((a, b) => b.redemptions - a.redemptions).slice(0, 10);

    return {
      totalCoupons: allCoupons.length,
      activeCoupons: allCoupons.filter(c => c.status === 'ACTIVE').length,
      totalRedemptions: allRedemptions.length,
      totalDiscountGiven: roundTo(sum(allRedemptions.map(r => r.discountAmount))),
      averageDiscount: allRedemptions.length > 0
        ? roundTo(sum(allRedemptions.map(r => r.discountAmount)) / allRedemptions.length) : 0,
      topCoupons,
    };
  }

  reset(): void {
    this.coupons.clear();
    this.redemptions.clear();
  }
}

export default CouponsEngine.getInstance();
