/**
 * Kartezy Enterprise ERP & Finance Platform — Purchase Order Engine
 *
 * Complete PO lifecycle: creation, approval workflow, fulfillment tracking,
 * receipt management, and integration with vendor management.
 */

import { createLogger } from '../utils/logger';
import { generateId, generateNumber, roundTo, sum } from '../utils/helpers';
import type {
  PurchaseOrder, PurchaseOrderItem, POStatus, POItemStatus,
  PODeliveryTerms, Address, CurrencyCode,
} from '../types';

const logger = createLogger('PurchaseOrderEngine');

export class PurchaseOrderEngine {
  private static instance: PurchaseOrderEngine;
  private orders: Map<string, PurchaseOrder> = new Map();
  private poCounter: number = 0;

  static getInstance(): PurchaseOrderEngine {
    if (!PurchaseOrderEngine.instance) {
      PurchaseOrderEngine.instance = new PurchaseOrderEngine();
    }
    return PurchaseOrderEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Purchase Order Engine');
  }

  // ── Purchase Order CRUD ──

  createPurchaseOrder(data: {
    vendorId: string;
    vendorName: string;
    items: Array<{
      productId: string;
      productName: string;
      sku: string;
      category: string;
      quantity: number;
      unitPrice: number;
      taxRate: number;
      expectedDate?: string;
    }>;
    discount?: number;
    shippingCost?: number;
    currency?: CurrencyCode;
    deliveryTerms?: PODeliveryTerms;
    expectedDeliveryDate: string;
    deliveryAddress: Address;
    billingAddress: Address;
    notes?: string;
    termsAndConditions?: string;
  }): PurchaseOrder {
    this.poCounter++;
    const now = new Date().toISOString();

    const items: PurchaseOrderItem[] = data.items.map((item, idx) => {
      const totalPrice = roundTo(item.quantity * item.unitPrice);
      const taxAmount = roundTo(totalPrice * item.taxRate);
      return {
        id: generateId('POI'),
        poId: '',
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice,
        taxRate: item.taxRate,
        taxAmount,
        status: 'PENDING',
        receivedQuantity: 0,
        rejectedQuantity: 0,
        expectedDate: item.expectedDate,
      };
    });

    const subtotal = roundTo(sum(items.map(i => i.totalPrice)));
    const discount = data.discount || 0;
    const taxAmount = roundTo(sum(items.map(i => i.taxAmount)));
    const shippingCost = data.shippingCost || 0;
    const totalAmount = roundTo(subtotal - discount + taxAmount + shippingCost);

    const po: PurchaseOrder = {
      id: generateId('PO'),
      poNumber: generateNumber('PO', this.poCounter),
      vendorId: data.vendorId,
      vendorName: data.vendorName,
      status: 'DRAFT',
      items: items.map(i => ({ ...i, poId: '' })),
      subtotal,
      discount,
      taxAmount,
      shippingCost,
      totalAmount,
      currency: data.currency || 'INR',
      deliveryTerms: data.deliveryTerms || 'EXW',
      expectedDeliveryDate: data.expectedDeliveryDate,
      deliveryAddress: data.deliveryAddress,
      billingAddress: data.billingAddress,
      notes: data.notes,
      termsAndConditions: data.termsAndConditions,
      createdAt: now,
      updatedAt: now,
    };

    // Set poId on items
    po.items = po.items.map(i => ({ ...i, poId: po.id }));
    this.orders.set(po.id, po);
    logger.info(`Created purchase order ${po.poNumber} for ${data.vendorName}`);
    return po;
  }

  getPurchaseOrder(id: string): PurchaseOrder | undefined {
    return this.orders.get(id);
  }

  getPurchaseOrderByNumber(poNumber: string): PurchaseOrder | undefined {
    return Array.from(this.orders.values()).find(po => po.poNumber === poNumber);
  }

  getAllPurchaseOrders(filters?: {
    status?: POStatus; vendorId?: string; fromDate?: string; toDate?: string;
  }): PurchaseOrder[] {
    let list = Array.from(this.orders.values());
    if (filters?.status) list = list.filter(po => po.status === filters.status);
    if (filters?.vendorId) list = list.filter(po => po.vendorId === filters.vendorId);
    if (filters?.fromDate) list = list.filter(po => po.createdAt >= filters.fromDate!);
    if (filters?.toDate) list = list.filter(po => po.createdAt <= filters.toDate!);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // ── Workflow ──

  submitForApproval(poId: string): PurchaseOrder {
    const po = this.orders.get(poId);
    if (!po) throw new Error(`PO ${poId} not found`);
    if (po.status !== 'DRAFT') throw new Error(`Cannot submit PO with status ${po.status}`);
    po.status = 'PENDING_APPROVAL';
    po.updatedAt = new Date().toISOString();
    this.orders.set(poId, po);
    logger.info(`PO ${po.poNumber} submitted for approval`);
    return po;
  }

  approvePO(poId: string, approvedBy: string): PurchaseOrder {
    const po = this.orders.get(poId);
    if (!po) throw new Error(`PO ${poId} not found`);
    if (po.status !== 'PENDING_APPROVAL') throw new Error(`Cannot approve PO with status ${po.status}`);
    po.status = 'APPROVED';
    po.approvedBy = approvedBy;
    po.approvedAt = new Date().toISOString();
    po.updatedAt = new Date().toISOString();
    this.orders.set(poId, po);
    logger.info(`PO ${po.poNumber} approved by ${approvedBy}`);
    return po;
  }

  rejectPO(poId: string, reason: string): PurchaseOrder {
    const po = this.orders.get(poId);
    if (!po) throw new Error(`PO ${poId} not found`);
    if (po.status !== 'PENDING_APPROVAL') throw new Error(`Cannot reject PO with status ${po.status}`);
    po.status = 'CANCELLED';
    po.notes = po.notes ? `${po.notes}\nRejected: ${reason}` : `Rejected: ${reason}`;
    po.updatedAt = new Date().toISOString();
    this.orders.set(poId, po);
    logger.info(`PO ${po.poNumber} rejected: ${reason}`);
    return po;
  }

  sendPO(poId: string): PurchaseOrder {
    const po = this.orders.get(poId);
    if (!po) throw new Error(`PO ${poId} not found`);
    if (po.status !== 'APPROVED') throw new Error(`Cannot send PO with status ${po.status}`);
    po.status = 'SENT';
    po.sentAt = new Date().toISOString();
    po.updatedAt = new Date().toISOString();
    this.orders.set(poId, po);
    logger.info(`PO ${po.poNumber} sent to vendor`);
    return po;
  }

  acknowledgePO(poId: string): PurchaseOrder {
    const po = this.orders.get(poId);
    if (!po) throw new Error(`PO ${poId} not found`);
    if (po.status !== 'SENT') throw new Error(`Cannot acknowledge PO with status ${po.status}`);
    po.status = 'ACKNOWLEDGED';
    po.updatedAt = new Date().toISOString();
    this.orders.set(poId, po);
    logger.info(`PO ${po.poNumber} acknowledged by vendor`);
    return po;
  }

  // ── Fulfillment ──

  receiveItems(poId: string, receivedItems: Array<{
    itemId: string; quantity: number; rejectedQuantity?: number;
  }>): PurchaseOrder {
    const po = this.orders.get(poId);
    if (!po) throw new Error(`PO ${poId} not found`);

    for (const received of receivedItems) {
      const item = po.items.find(i => i.id === received.itemId);
      if (!item) throw new Error(`Item ${received.itemId} not found in PO ${po.poNumber}`);

      item.receivedQuantity += received.quantity;
      item.rejectedQuantity += received.rejectedQuantity || 0;
      item.status = item.receivedQuantity >= item.quantity ? 'RECEIVED' : 'PARTIALLY_RECEIVED';
    }

    // Update overall PO status
    const allReceived = po.items.every(i => i.status === 'RECEIVED');
    const anyReceived = po.items.some(i => i.status === 'RECEIVED' || i.status === 'PARTIALLY_RECEIVED');
    po.status = allReceived ? 'FULFILLED' : anyReceived ? 'PARTIALLY_FULFILLED' : po.status;
    if (po.status === 'FULFILLED') po.fulfilledAt = new Date().toISOString();
    po.updatedAt = new Date().toISOString();
    this.orders.set(poId, po);
    logger.info(`Received items for PO ${po.poNumber}: ${receivedItems.length} items`);
    return po;
  }

  closePO(poId: string): PurchaseOrder {
    const po = this.orders.get(poId);
    if (!po) throw new Error(`PO ${poId} not found`);
    if (!['FULFILLED', 'PARTIALLY_FULFILLED'].includes(po.status)) {
      throw new Error(`Cannot close PO with status ${po.status}`);
    }
    po.status = 'CLOSED';
    po.updatedAt = new Date().toISOString();
    this.orders.set(poId, po);
    logger.info(`PO ${po.poNumber} closed`);
    return po;
  }

  cancelPO(poId: string, reason: string): PurchaseOrder {
    const po = this.orders.get(poId);
    if (!po) throw new Error(`PO ${poId} not found`);
    if (['FULFILLED', 'CLOSED', 'CANCELLED'].includes(po.status)) {
      throw new Error(`Cannot cancel PO with status ${po.status}`);
    }
    po.status = 'CANCELLED';
    po.notes = po.notes ? `${po.notes}\nCancelled: ${reason}` : `Cancelled: ${reason}`;
    po.updatedAt = new Date().toISOString();
    this.orders.set(poId, po);
    logger.info(`PO ${po.poNumber} cancelled: ${reason}`);
    return po;
  }

  // ── Analytics ──

  getPOSummary(filters?: { fromDate?: string; toDate?: string }): {
    totalPOs: number; totalAmount: number; averageValue: number;
    byStatus: Record<POStatus, number>;
    pendingApprovals: number; overdueCount: number;
  } {
    let list = Array.from(this.orders.values());
    if (filters?.fromDate) list = list.filter(po => po.createdAt >= filters.fromDate!);
    if (filters?.toDate) list = list.filter(po => po.createdAt <= filters.toDate!);

    const byStatus: Record<string, number> = {};
    for (const po of list) {
      byStatus[po.status] = (byStatus[po.status] || 0) + 1;
    }

    const now = new Date().toISOString().split('T')[0];
    return {
      totalPOs: list.length,
      totalAmount: roundTo(sum(list.map(po => po.totalAmount))),
      averageValue: list.length > 0 ? roundTo(sum(list.map(po => po.totalAmount)) / list.length) : 0,
      byStatus: byStatus as Record<POStatus, number>,
      pendingApprovals: list.filter(po => po.status === 'PENDING_APPROVAL').length,
      overdueCount: list.filter(po =>
        ['APPROVED', 'SENT', 'ACKNOWLEDGED', 'PARTIALLY_FULFILLED'].includes(po.status) &&
        po.expectedDeliveryDate < now
      ).length,
    };
  }

  reset(): void {
    this.orders.clear();
    this.poCounter = 0;
  }
}

export default PurchaseOrderEngine.getInstance();
