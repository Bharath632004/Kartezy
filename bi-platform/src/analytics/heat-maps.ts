/**
 * Kartezy Enterprise BI Platform - Heat Maps
 *
 * Geographic heat map generation for visualizing order density,
 * delivery hotspots, merchant concentration, and customer activity.
 */

import { createBILogger } from '../utils/logger';

const logger = createBILogger('HeatMaps');

export interface HeatMapPoint {
  latitude: number;
  longitude: number;
  intensity: number;
  weight: number;
  label?: string;
  category?: string;
}

export interface HeatMapRegion {
  region: string;
  city: string;
  points: HeatMapPoint[];
  totalValue: number;
  density: number;
  color: string;
}

export interface CityCluster {
  clusterId: string;
  center: { lat: number; lng: number };
  radius: number;
  orderCount: number;
  revenue: number;
  topMerchant: string;
  topCategory: string;
}

export class HeatMapAnalytics {
  static getInstance(): HeatMapAnalytics {
    return new HeatMapAnalytics();
  }

  /** Get order density heat map data for a city */
  async getOrderDensity(city: string, zone?: string): Promise<HeatMapPoint[]> {
    const cityCenters: Record<string, { lat: number; lng: number }> = {
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Delhi': { lat: 28.7041, lng: 77.1025 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Hyderabad': { lat: 17.3850, lng: 78.4867 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Pune': { lat: 18.5204, lng: 73.8567 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 },
      'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
    };

    const center = cityCenters[city] || { lat: 19.0760, lng: 72.8777 };
    const points: HeatMapPoint[] = [];

    // Generate clustered heat map points around city center
    const numPoints = 50 + Math.floor(Math.random() * 100);
    for (let i = 0; i < numPoints; i++) {
      const latOffset = (Math.random() - 0.5) * 0.5;
      const lngOffset = (Math.random() - 0.5) * 0.5;
      const distance = Math.sqrt(latOffset * latOffset + lngOffset * lngOffset);
      const intensity = Math.max(0, 1 - distance * 3) * (0.5 + Math.random() * 0.5);

      points.push({
        latitude: center.lat + latOffset,
        longitude: center.lng + lngOffset,
        intensity: Math.round(intensity * 100) / 100,
        weight: Math.round((intensity * (50 + Math.random() * 200)) * 100) / 100,
        label: `Cluster ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        category: ['GROCERY', 'DAIRY', 'BEVERAGES', 'SNACKS'][Math.floor(Math.random() * 4)],
      });
    }

    return points;
  }

  /** Get merchant concentration heat map */
  async getMerchantDensity(city: string): Promise<HeatMapRegion[]> {
    const zones = ['Zone-A', 'Zone-B', 'Zone-C', 'Zone-D', 'Zone-E'];
    return zones.map(zone => {
      const numPoints = 10 + Math.floor(Math.random() * 30);
      const points: HeatMapPoint[] = Array.from({ length: numPoints }, () => ({
        latitude: 19 + Math.random() * 0.3,
        longitude: 72.7 + Math.random() * 0.3,
        intensity: Math.round((0.3 + Math.random() * 0.7) * 100) / 100,
        weight: Math.round((100 + Math.random() * 500) * 100) / 100,
        label: `${zone} - Merchant`,
      }));

      return {
        region: zone,
        city,
        points,
        totalValue: Math.round((50000 + Math.random() * 200000) * 100) / 100,
        density: Math.round((0.2 + Math.random() * 0.8) * 100) / 100,
        color: `rgba(255, ${Math.floor(50 + Math.random() * 100)}, ${Math.floor(Math.random() * 50)}, 0.6)`,
      };
    });
  }

  /** Get delivery route heat map */
  async getDeliveryHeatMap(city: string): Promise<CityCluster[]> {
    return Array.from({ length: 5 + Math.floor(Math.random() * 8) }, (_, i) => ({
      clusterId: `CL-${1000 + i}`,
      center: {
        lat: 19 + Math.random() * 0.2,
        lng: 72.7 + Math.random() * 0.3,
      },
      radius: 0.5 + Math.random() * 1.5,
      orderCount: Math.floor(50 + Math.random() * 500),
      revenue: Math.round((10000 + Math.random() * 100000) * 100) / 100,
      topMerchant: `Merchant-${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      topCategory: ['Groceries', 'Dairy', 'Beverages'][Math.floor(Math.random() * 3)],
    }));
  }

  /** Get customer activity heat map (by time of day) */
  async getActivityHeatMap(): Promise<Array<{ hour: number; dayOfWeek: number; intensity: number; orders: number }>> {
    const data: Array<{ hour: number; dayOfWeek: number; intensity: number; orders: number }> = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let day = 1; day <= 7; day++) {
        const baseIntensity =
          (hour >= 8 && hour <= 10 ? 0.6 : 0) +
          (hour >= 12 && hour <= 14 ? 0.8 : 0) +
          (hour >= 18 && hour <= 21 ? 1.0 : 0) +
          (hour >= 22 || hour <= 6 ? 0.1 : 0) +
          (hour >= 11 && hour <= 13 ? 0.5 : 0);

        const dayMultiplier = day >= 6 ? 1.2 : 1.0;
        const intensity = Math.min(1, (baseIntensity + Math.random() * 0.2) * dayMultiplier);

        data.push({
          hour,
          dayOfWeek: day,
          intensity: Math.round(intensity * 100) / 100,
          orders: Math.floor(intensity * 100 + Math.random() * 50),
        });
      }
    }

    return data;
  }
}

export default HeatMapAnalytics.getInstance();
