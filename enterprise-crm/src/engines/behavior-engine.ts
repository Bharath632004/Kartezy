/**
 * Kartezy Enterprise CRM — Behavior Tracking Engine
 *
 * Customer behavior tracking: events, sessions, page views,
 * product interactions, and real-time activity monitoring.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum, avg } from '../utils/helpers';
import type { BehaviorEvent, Session } from '../types';

const logger = createLogger('BehaviorEngine');

export class BehaviorTrackingEngine {
  private static instance: BehaviorTrackingEngine;
  private events: Map<string, BehaviorEvent> = new Map();
  private sessions: Map<string, Session> = new Map();

  static getInstance(): BehaviorTrackingEngine {
    if (!BehaviorTrackingEngine.instance) {
      BehaviorTrackingEngine.instance = new BehaviorTrackingEngine();
    }
    return BehaviorTrackingEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Behavior Tracking Engine');
  }

  trackEvent(data: {
    customerId: string; sessionId: string; eventType: string;
    category: string; action: string; label?: string; value?: number;
    pageUrl?: string; referrerUrl?: string; userAgent?: string;
    ipAddress?: string; metadata?: Record<string, unknown>;
  }): BehaviorEvent {
    const event: BehaviorEvent = {
      id: generateId('BEV'),
      customerId: data.customerId,
      sessionId: data.sessionId,
      eventType: data.eventType,
      category: data.category,
      action: data.action,
      label: data.label,
      value: data.value,
      pageUrl: data.pageUrl,
      referrerUrl: data.referrerUrl,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
      metadata: data.metadata,
      timestamp: new Date().toISOString(),
    };

    this.events.set(event.id, event);

    // Update session
    const session = this.sessions.get(data.sessionId);
    if (session) {
      session.pageViews++;
      session.endTime = event.timestamp;
      this.sessions.set(data.sessionId, session);
    }

    return event;
  }

  trackPageView(customerId: string, pageUrl: string, metadata?: Record<string, unknown>): BehaviorEvent {
    const sessionId = this.getOrCreateSession(customerId).id;
    return this.trackEvent({
      customerId, sessionId, eventType: 'page_view',
      category: 'page', action: 'view', pageUrl, metadata,
    });
  }

  trackProductView(customerId: string, productId: string, productName: string): BehaviorEvent {
    const sessionId = this.getOrCreateSession(customerId).id;
    return this.trackEvent({
      customerId, sessionId, eventType: 'product_view',
      category: 'product', action: 'view', label: productName,
      metadata: { productId, productName },
    });
  }

  trackSearch(customerId: string, searchQuery: string, resultsCount: number): BehaviorEvent {
    const sessionId = this.getOrCreateSession(customerId).id;
    return this.trackEvent({
      customerId, sessionId,
      eventType: 'search', category: 'search', action: 'search',
      label: searchQuery, value: resultsCount,
      metadata: { query: searchQuery, results: resultsCount },
    });
  }

  trackAddToCart(customerId: string, productId: string, productName: string, price: number, quantity: number): BehaviorEvent {
    const sessionId = this.getOrCreateSession(customerId).id;
    return this.trackEvent({
      customerId, sessionId,
      eventType: 'add_to_cart', category: 'cart', action: 'add',
      label: productName, value: price * quantity,
      metadata: { productId, productName, price, quantity },
    });
  }

  // ── Session Management ──

  startSession(customerId: string, data?: {
    deviceType?: string; browser?: string; os?: string;
    ipAddress?: string; referrer?: string;
  }): Session {
    const now = new Date().toISOString();
    const session: Session = {
      id: generateId('SES'),
      customerId,
      startTime: now,
      duration: 0,
      pageViews: 0,
      deviceType: data?.deviceType || 'unknown',
      browser: data?.browser || 'unknown',
      os: data?.os || 'unknown',
      ipAddress: data?.ipAddress || '',
      referrer: data?.referrer || 'direct',
      isActive: true,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  endSession(sessionId: string): Session {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.endTime = new Date().toISOString();
    session.duration = Math.floor(
      (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000
    );
    session.isActive = false;
    this.sessions.set(sessionId, session);
    return session;
  }

  private getOrCreateSession(customerId: string): Session {
    const activeSession = Array.from(this.sessions.values())
      .find(s => s.customerId === customerId && s.isActive);
    if (activeSession) return activeSession;
    return this.startSession(customerId);
  }

  getCustomerSessions(customerId: string): Session[] {
    return Array.from(this.sessions.values())
      .filter(s => s.customerId === customerId)
      .sort((a, b) => b.startTime.localeCompare(a.startTime));
  }

  getCustomerEvents(customerId: string, limit?: number): BehaviorEvent[] {
    let evts = Array.from(this.events.values())
      .filter(e => e.customerId === customerId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return limit ? evts.slice(0, limit) : evts;
  }

  // ── Analytics ──

  getBehaviorSummary(customerId: string): {
    totalSessions: number; totalPageViews: number;
    totalSearches: number; totalAddToCart: number;
    averageSessionDuration: number;
    topCategories: string[];
    topPages: string[];
    lastActive: string;
  } {
    const customerEvents = this.getCustomerEvents(customerId);
    const customerSessions = this.getCustomerSessions(customerId);

    const pageViews = customerEvents.filter(e => e.eventType === 'page_view');
    const searches = customerEvents.filter(e => e.eventType === 'search');
    const addToCarts = customerEvents.filter(e => e.eventType === 'add_to_cart');

    const categoryCount = new Map<string, number>();
    const pageCount = new Map<string, number>();

    for (const evt of pageViews) {
      if (evt.metadata?.category) {
        const cat = String(evt.metadata.category);
        categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
      }
      if (evt.pageUrl) {
        pageCount.set(evt.pageUrl, (pageCount.get(evt.pageUrl) || 0) + 1);
      }
    }

    return {
      totalSessions: customerSessions.length,
      totalPageViews: pageViews.length,
      totalSearches: searches.length,
      totalAddToCart: addToCarts.length,
      averageSessionDuration: customerSessions.length > 0
        ? roundTo(avg(customerSessions.map(s => s.duration)), 1) : 0,
      topCategories: Array.from(categoryCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c]) => c),
      topPages: Array.from(pageCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([p]) => p),
      lastActive: customerEvents[0]?.timestamp || '',
    };
  }

  reset(): void {
    this.events.clear();
    this.sessions.clear();
  }
}

export default BehaviorTrackingEngine.getInstance();
