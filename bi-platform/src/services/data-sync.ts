/**
 * Kartezy Enterprise BI Platform - Admin Dashboard Sync
 *
 * Synchronization service that connects the BI Platform with
 * the admin dashboard stores for real-time data updates.
 */

import { createBILogger } from '../utils/logger';
import { getBIConfig } from '../config';
import { generateBIId } from '../utils/helpers';

const logger = createBILogger('DataSync');

export interface SyncState {
  lastSyncTimestamp: string;
  syncIntervalMs: number;
  status: 'running' | 'idle' | 'error' | 'stopped';
  lastSyncDurationMs: number;
  recordsSynced: number;
  errors: number;
  syncHistory: Array<{
    id: string;
    timestamp: string;
    durationMs: number;
    records: number;
    status: 'success' | 'partial' | 'failed';
    error?: string;
  }>;
}

export interface SyncDataPacket {
  type: string;
  domain: string;
  data: Record<string, unknown>;
  checksum: string;
  timestamp: string;
  version: number;
}

export class DataSyncService {
  private static instance: DataSyncService;
  private state: SyncState;
  private syncTimer: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    const config = getBIConfig();
    this.state = {
      lastSyncTimestamp: new Date(0).toISOString(),
      syncIntervalMs: config.sync.intervalMs,
      status: 'idle',
      lastSyncDurationMs: 0,
      recordsSynced: 0,
      errors: 0,
      syncHistory: [],
    };
  }

  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService();
    }
    return DataSyncService.instance;
  }

  /** Start periodic sync with the admin dashboard */
  async startSync(): Promise<void> {
    if (this.state.status === 'running') {
      logger.warn('Sync already running');
      return;
    }

    this.state.status = 'running';
    logger.info('Starting data sync with interval', { intervalMs: this.state.syncIntervalMs });

    // Initial sync
    await this.performSync();

    // Periodic sync
    this.syncTimer = setInterval(async () => {
      await this.performSync();
    }, this.state.syncIntervalMs);
  }

  /** Stop periodic sync */
  stopSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    this.state.status = 'stopped';
    logger.info('Data sync stopped');
  }

  /** Perform a single sync cycle */
  async performSync(): Promise<SyncDataPacket[]> {
    const startTime = Date.now();
    const syncId = generateBIId();

    logger.debug('Starting sync cycle', { syncId });

    try {
      // Collect data from all analytics engines
      const packets: SyncDataPacket[] = [];
      const config = getBIConfig();

      // Generate data packets for each domain
      const domains = [
        { type: 'dashboard', domain: 'overview' },
        { type: 'analytics', domain: 'revenue' },
        { type: 'analytics', domain: 'customers' },
        { type: 'analytics', domain: 'merchants' },
        { type: 'analytics', domain: 'delivery' },
        { type: 'analytics', domain: 'inventory' },
        { type: 'analytics', domain: 'marketing' },
        { type: 'analytics', domain: 'finance' },
        { type: 'kpi', domain: 'metrics' },
        { type: 'reports', domain: 'summary' },
      ];

      for (const domain of domains) {
        packets.push(this.createDataPacket(domain.type, domain.domain));
      }

      // Update state
      const duration = Date.now() - startTime;
      this.state.lastSyncTimestamp = new Date().toISOString();
      this.state.lastSyncDurationMs = duration;
      this.state.recordsSynced += packets.length;

      this.state.syncHistory.push({
        id: syncId,
        timestamp: new Date().toISOString(),
        durationMs: duration,
        records: packets.length,
        status: 'success',
      });

      // Keep only last 100 sync records
      if (this.state.syncHistory.length > 100) {
        this.state.syncHistory = this.state.syncHistory.slice(-100);
      }

      logger.info('Sync completed', { syncId, packets: packets.length, durationMs: duration });
      return packets;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.state.errors++;
      this.state.syncHistory.push({
        id: syncId,
        timestamp: new Date().toISOString(),
        durationMs: duration,
        records: 0,
        status: 'failed',
        error: (error as Error).message,
      });

      logger.error('Sync failed', { syncId, error: (error as Error).message });
      return [];
    }
  }

  /** Sync data to admin dashboard store */
  async syncToDashboard(storeName: string, data: Record<string, unknown>): Promise<boolean> {
    logger.debug('Syncing to dashboard store', { storeName });
    try {
      // In production, this would call the admin dashboard's API
      // to update the Zustand stores
      return true;
    } catch (error) {
      logger.error('Failed to sync to dashboard', { storeName, error: (error as Error).message });
      return false;
    }
  }

  /** Get sync state */
  getSyncState(): SyncState {
    return { ...this.state };
  }

  /** Update sync interval */
  setSyncInterval(intervalMs: number): void {
    this.state.syncIntervalMs = intervalMs;
    if (this.syncTimer) {
      this.stopSync();
      this.startSync();
    }
  }

  /** Force an immediate sync */
  async forceSync(): Promise<SyncDataPacket[]> {
    logger.info('Force sync triggered');
    return this.performSync();
  }

  private createDataPacket(type: string, domain: string): SyncDataPacket {
    return {
      type,
      domain,
      data: {
        timestamp: new Date().toISOString(),
        metrics: {
          value: 0,
          previousValue: 0,
          timestamp: Date.now(),
        },
        summary: `Pending sync: ${domain} data awaiting upstream calculation`,
      },
      checksum: generateBIId(),
      timestamp: new Date().toISOString(),
      version: 1,
    };
  }
}

export default DataSyncService.getInstance();
