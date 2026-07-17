/**
 * Kartezy Enterprise ERP & Finance Platform — Invoice Engine
 *
 * Complete invoice lifecycle: creation (sales, purchase, credit/debit notes),
 * payment tracking, overdue management, and GST-compliant invoicing.
 */

import { createLogger } from '../utils/logger';
import { generateId, generateNumber, roundTo, sum } from '../utils/helpers';
import type {
  Invoice, InvoiceLineItem, InvoiceType, InvoiceStatus, PaymentTerms,
  TaxBreakdown, Address, CurrencyCode,
} from '../types';

const logger = createLogger('InvoiceEngine');

export class InvoiceEngine {
  private static instance: InvoiceEngine;
  private invoices: Map<string, Invoice> = new Map();
  private invoiceCounter: number = 0;

  static getInstance(): InvoiceEngine {
    if (!InvoiceEngine.instance) {
      InvoiceEngine.instance = new InvoiceEngine();
    }
    return InvoiceEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Invoice Engine');
  }

  // ── Invoice CRUD ──

  createInvoice(data: {
    invoiceType: InvoiceType;
    referenceId: string;
    referenceType: 'ORDER' | 'PO' | 'SUBSCRIPTION' | 'SETTLEMENT';
    vendorId?: string;
    customerId?: string;
    merchantId?: string;
    billTo: { name: string; gstin?: string; address: Address };
    shipTo?: Address;
    items: Array<{
      description: string;
      hsnSacCode: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      discountPercent?: number;
      taxRate: number;
    }>;
    discount?: number;
    currency?: CurrencyCode;
    paymentTerms: PaymentTerms;
    dueDate: string;
    notes?: string;
  }): Invoice {
    this.invoiceCounter++;
    const now = new Date().toISOString();
    const invoiceDate = now.split('T')[0];

    const items: InvoiceLineItem[] = data.items.map((item) => {
      const totalPrice = roundTo(item.quantity * item.unitPrice);
      const discountPercent = item.discountPercent || 0;
      const discountAmount = roundTo(totalPrice * discountPercent / 100);
      const taxableValue = roundTo(totalPrice - discountAmount);
      const taxAmount = roundTo(taxableValue * item.taxRate);
      const lineTotal = roundTo(taxableValue + taxAmount);
      return {
        id: generateId('INVL'),
        invoiceId: '',
        description: item.description,
        hsnSacCode: item.hsnSacCode,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        discountPercent,
        taxableValue,
        taxRate: item.taxRate,
        taxAmount,
        totalAmount: lineTotal,
      };
    });

    const subtotal = roundTo(sum(items.map(i => i.taxableValue)));
    const discount = data.discount || 0;
    const taxableAmount = roundTo(subtotal - discount);

    const totalCgst = roundTo(sum(items.filter(i => i.taxRate > 0).map(i => i.taxAmount / 2)));
    const totalSgst = roundTo(sum(items.filter(i => i.taxRate > 0).map(i => i.taxAmount / 2)));
    const totalIgst = 0;
    const totalCess = 0;
    const totalTax = roundTo(sum(items.map(i => i.taxAmount)));

    const taxDetails: TaxBreakdown = { cgst: totalCgst, sgst: totalSgst, igst: totalIgst, cess: totalCess, totalTax };
    const totalAmount = roundTo(taxableAmount + totalTax);

    const invoice: Invoice = {
      id: generateId('INV'),
      invoiceNumber: generateNumber('INV', this.invoiceCounter),
      invoiceType: data.invoiceType,
      status: 'DRAFT',
      referenceId: data.referenceId,
      referenceType: data.referenceType,
      vendorId: data.vendorId,
      customerId: data.customerId,
      merchantId: data.merchantId,
      billTo: data.billTo,
      shipTo: data.shipTo,
      items: items.map(i => ({ ...i, invoiceId: '' })),
      subtotal,
      discount,
      taxableAmount,
      taxDetails,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      currency: data.currency || 'INR',
      paymentTerms: data.paymentTerms,
      dueDate: data.dueDate,
      invoiceDate,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };

    // Set invoiceId on items
    invoice.items = invoice.items.map(i => ({ ...i, invoiceId: invoice.id }));
    this.invoices.set(invoice.id, invoice);
    logger.info(`Created invoice ${invoice.invoiceNumber} for ${data.billTo.name}`);
    return invoice;
  }

  getInvoice(id: string): Invoice | undefined {
    return this.invoices.get(id);
  }

  getInvoiceByNumber(invoiceNumber: string): Invoice | undefined {
    return Array.from(this.invoices.values()).find(inv => inv.invoiceNumber === invoiceNumber);
  }

  getAllInvoices(filters?: {
    type?: InvoiceType; status?: InvoiceStatus; vendorId?: string;
    customerId?: string; merchantId?: string; fromDate?: string; toDate?: string;
  }): Invoice[] {
    let list = Array.from(this.invoices.values());
    if (filters?.type) list = list.filter(inv => inv.invoiceType === filters.type);
    if (filters?.status) list = list.filter(inv => inv.status === filters.status);
    if (filters?.vendorId) list = list.filter(inv => inv.vendorId === filters.vendorId);
    if (filters?.customerId) list = list.filter(inv => inv.customerId === filters.customerId);
    if (filters?.merchantId) list = list.filter(inv => inv.merchantId === filters.merchantId);
    if (filters?.fromDate) list = list.filter(inv => inv.invoiceDate >= filters.fromDate!);
    if (filters?.toDate) list = list.filter(inv => inv.invoiceDate <= filters.toDate!);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // ── Workflow ──

  sendInvoice(invoiceId: string): Invoice {
    const inv = this.invoices.get(invoiceId);
    if (!inv) throw new Error(`Invoice ${invoiceId} not found`);
    if (inv.status !== 'DRAFT') throw new Error(`Cannot send invoice with status ${inv.status}`);
    inv.status = 'SENT';
    inv.updatedAt = new Date().toISOString();
    this.invoices.set(invoiceId, inv);
    logger.info(`Invoice ${inv.invoiceNumber} sent`);
    return inv;
  }

  recordPayment(invoiceId: string, amount: number, paymentReference: string): Invoice {
    const inv = this.invoices.get(invoiceId);
    if (!inv) throw new Error(`Invoice ${invoiceId} not found`);

    inv.amountPaid = roundTo(inv.amountPaid + amount);
    inv.balanceDue = roundTo(inv.totalAmount - inv.amountPaid);
    inv.status = inv.balanceDue <= 0 ? 'PAID' : 'PARTIALLY_PAID';
    if (inv.status === 'PAID') {
      inv.paymentDate = new Date().toISOString().split('T')[0];
      inv.paymentReference = paymentReference;
    }
    inv.updatedAt = new Date().toISOString();
    this.invoices.set(invoiceId, inv);
    logger.info(`Payment of ${amount} recorded for invoice ${inv.invoiceNumber}`);
    return inv;
  }

  cancelInvoice(invoiceId: string, reason: string): Invoice {
    const inv = this.invoices.get(invoiceId);
    if (!inv) throw new Error(`Invoice ${invoiceId} not found`);
    if (['PAID', 'CANCELLED', 'REFUNDED'].includes(inv.status)) {
      throw new Error(`Cannot cancel invoice with status ${inv.status}`);
    }
    inv.status = 'CANCELLED';
    inv.notes = inv.notes ? `${inv.notes}
Cancelled: ${reason}` : `Cancelled: ${reason}`;
    inv.updatedAt = new Date().toISOString();
    this.invoices.set(invoiceId, inv);
    logger.info(`Invoice ${inv.invoiceNumber} cancelled: ${reason}`);
    return inv;
  }

  refundInvoice(invoiceId: string, reason: string): Invoice {
    const inv = this.invoices.get(invoiceId);
    if (!inv) throw new Error(`Invoice ${invoiceId} not found`);
    if (inv.status !== 'PAID') throw new Error(`Cannot refund invoice with status ${inv.status}`);
    inv.status = 'REFUNDED';
    inv.notes = inv.notes ? `${inv.notes}
Refunded: ${reason}` : `Refunded: ${reason}`;
    inv.updatedAt = new Date().toISOString();
    this.invoices.set(invoiceId, inv);
    logger.info(`Invoice ${inv.invoiceNumber} refunded: ${reason}`);
    return inv;
  }

  // ── Overdue Management ──

  checkOverdueInvoices(): Invoice[] {
    const today = new Date().toISOString().split('T')[0];
    const overdue: Invoice[] = [];
    for (const inv of this.invoices.values()) {
      if (['SENT', 'PARTIALLY_PAID', 'OVERDUE'].includes(inv.status) && inv.dueDate < today) {
        inv.status = 'OVERDUE';
        inv.updatedAt = new Date().toISOString();
        this.invoices.set(inv.id, inv);
        overdue.push(inv);
      }
    }
    if (overdue.length > 0) logger.info(`Marked ${overdue.length} invoices as overdue`);
    return overdue;
  }

  // ── Analytics ──

  getInvoiceSummary(filters?: { fromDate?: string; toDate?: string }): {
    totalInvoices: number; totalAmount: number; totalPaid: number; totalDue: number;
    byStatus: Record<InvoiceStatus, number>;
  } {
    let list = Array.from(this.invoices.values());
    if (filters?.fromDate) list = list.filter(inv => inv.createdAt >= filters.fromDate!);
    if (filters?.toDate) list = list.filter(inv => inv.createdAt <= filters.toDate!);

    const byStatus: Record<string, number> = {};
    for (const inv of list) {
      byStatus[inv.status] = (byStatus[inv.status] || 0) + 1;
    }

    return {
      totalInvoices: list.length,
      totalAmount: roundTo(sum(list.map(inv => inv.totalAmount))),
      totalPaid: roundTo(sum(list.filter(inv => inv.status === 'PAID').map(inv => inv.totalAmount))),
      totalDue: roundTo(sum(list.filter(inv => ['SENT', 'PARTIALLY_PAID', 'OVERDUE'].includes(inv.status)).map(inv => inv.balanceDue))),
      byStatus: byStatus as Record<InvoiceStatus, number>,
    };
  }

  getAgingReport(asOfDate?: string): Array<{
    bucket: string; count: number; totalAmount: number;
  }> {
    const today = asOfDate || new Date().toISOString().split('T')[0];
    const buckets = [
      { name: '0-30 days', min: 0, max: 30, count: 0, total: 0 },
      { name: '31-60 days', min: 31, max: 60, count: 0, total: 0 },
      { name: '61-90 days', min: 61, max: 90, count: 0, total: 0 },
      { name: '90+ days', min: 91, max: Infinity, count: 0, total: 0 },
    ];

    const overdueInvoices = Array.from(this.invoices.values()).filter(
      inv => ['SENT', 'PARTIALLY_PAID', 'OVERDUE'].includes(inv.status)
    );

    for (const inv of overdueInvoices) {
      const daysOverdue = Math.floor(
        (new Date(today).getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysOverdue > 0) {
        const bucket = buckets.find(b => daysOverdue >= b.min && daysOverdue <= b.max);
        if (bucket) {
          bucket.count++;
          bucket.total = roundTo(bucket.total + inv.balanceDue);
        }
      }
    }

    return buckets.map(b => ({ bucket: b.name, count: b.count, totalAmount: b.total }));
  }

  reset(): void {
    this.invoices.clear();
    this.invoiceCounter = 0;
  }
}

export default InvoiceEngine.getInstance();
