import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { operationsApi } from '@/lib/api';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface City {
  id: string;
  name: string;
  state: string;
  zone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LAUNCHING' | 'SUSPENDED';
  population: number;
  totalOrders: number;
  totalMerchants: number;
  totalDrivers: number;
  totalCustomers: number;
  avgDeliveryTime: number;
  avgOrderValue: number;
  revenue: number;
  growthRate: number;
  launchedAt: string;
  updatedAt: string;
}

export interface Zone {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  type: 'HOT' | 'WARM' | 'COLD' | 'EXPANDING';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  totalOrders: number;
  totalMerchants: number;
  totalDrivers: number;
  coverageArea: number;
  avgDeliveryTime: number;
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  peakHours: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  cityId: string;
  cityName: string;
  zoneId?: string;
  zoneName?: string;
  type: 'PRIMARY' | 'SECONDARY' | 'MICRO' | 'DARK_STORE';
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CLOSED';
  capacity: number;
  utilizedCapacity: number;
  totalSKUs: number;
  totalStaff: number;
  activeOrders: number;
  processingCapacity: number;
  avgProcessingTime: number;
  location: { lat: number; lng: number; address: string };
  operatingHours: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperationsMerchant {
  id: string;
  name: string;
  storeName: string;
  cityId: string;
  cityName: string;
  zoneId?: string;
  zoneName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING' | 'ONBOARDING';
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  avgPrepTime: number;
  fulfillmentRate: number;
  cancellationRate: number;
  rating: number;
  liveStatus: 'OPEN' | 'BUSY' | 'CLOSED' | 'HOLIDAY';
  lastOrderAt?: string;
  joinedAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouseId: string;
  warehouseName: string;
  merchantId?: string;
  merchantName?: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitPrice: number;
  totalValue: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCKED' | 'DISCONTINUED';
  lastRestockedAt: string;
  updatedAt: string;
}

export interface OperationsDelivery {
  id: string;
  orderId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  zoneId: string;
  zoneName: string;
  cityId: string;
  cityName: string;
  status: 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  pickupLocation: { lat: number; lng: number; address: string };
  dropLocation: { lat: number; lng: number; address: string };
  currentLocation?: { lat: number; lng: number };
  distance: number;
  estimatedTime: number;
  actualTime?: number;
  customerName: string;
  customerPhone: string;
  amount: number;
  startedAt: string;
  completedAt?: string;
  eta: string;
}

export interface OperationsCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cityId: string;
  cityName: string;
  zoneId?: string;
  zoneName?: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lifetimeValue: number;
  segment: string;
  lifecycleStage: 'NEW' | 'ACTIVE' | 'AT_RISK' | 'CHURNED' | 'VIP';
  lastOrderAt?: string;
  signupDate: string;
  churnProbability: number;
  feedbackScore: number;
  supportTickets: number;
  tags: string[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  type: 'ORDER' | 'PAYMENT' | 'DELIVERY' | 'MERCHANT' | 'ACCOUNT' | 'TECHNICAL' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_ON_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  subject: string;
  description: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  assignedTo?: string;
  assignedToName?: string;
  relatedOrderId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  channel: 'PHONE' | 'EMAIL' | 'CHAT' | 'WHATSAPP' | 'PORTAL' | 'SOCIAL';
  satisfactionScore?: number;
  tags: string[];
  firstResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Escalation {
  id: string;
  ticketId: string;
  ticketNumber: string;
  level: 1 | 2 | 3;
  reason: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  raisedBy: string;
  raisedByName: string;
  assignedTo?: string;
  assignedToName?: string;
  customerId: string;
  customerName: string;
  notes: EscalationNote[];
  resolutionSummary?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EscalationNote {
  id: string;
  author: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface SLA {
  id: string;
  name: string;
  description: string;
  type: 'RESPONSE' | 'RESOLUTION' | 'FULFILLMENT' | 'DELIVERY' | 'SUPPORT' | 'CUSTOM';
  target: number; // in minutes
  warningThreshold: number; // percentage of target time
  criticalThreshold: number; // percentage of target time
  scope: 'ALL' | 'ZONE' | 'CITY' | 'MERCHANT' | 'CUSTOMER_TIER';
  scopeValue?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'INACTIVE' | 'PAUSED';
  metrics: SLAMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface SLAMetrics {
  totalViolations: number;
  totalMet: number;
  complianceRate: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  breachesToday: number;
  breachesThisWeek: number;
  breachesThisMonth: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'BLOCKER';
  status: 'DETECTED' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'MITIGATING' | 'RESOLVED' | 'CLOSED';
  category: 'INFRASTRUCTURE' | 'APPLICATION' | 'DELIVERY' | 'PAYMENT' | 'SECURITY' | 'MERCHANT' | 'CUSTOMER' | 'THIRD_PARTY';
  source: 'MONITORING' | 'ALERT' | 'CUSTOMER_REPORT' | 'MERCHANT_REPORT' | 'TEAM' | 'AUTOMATED';
  affectedServices: string[];
  affectedZones?: string[];
  affectedCities?: string[];
  rootCause?: string;
  resolution?: string;
  assignedTo?: string;
  assignedToName?: string;
  detectedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  domain: 'DELIVERY' | 'INVENTORY' | 'PRICING' | 'ALLOCATION' | 'DISPATCH' | 'MERCHANT' | 'CUSTOMER' | 'PROMOTION';
  type: 'THRESHOLD' | 'ELIGIBILITY' | 'PRIORITY' | 'ALLOCATION' | 'DISCOUNT' | 'ROUTING' | 'CUSTOM';
  condition: string;
  action: string;
  priority: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'DEPRECATED';
  evaluationCount: number;
  triggerCount: number;
  lastTriggeredAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperationsDashboard {
  summary: {
    totalActiveOrders: number;
    totalPendingOrders: number;
    totalDeliveredToday: number;
    totalFailedDeliveries: number;
    activeDrivers: number;
    availableDrivers: number;
    activeMerchants: number;
    avgDeliveryTime: number;
    SLAComplianceRate: number;
    activeIncidents: number;
    criticalIncidents: number;
    pendingEscalations: number;
    urgentEscalations: number;
    totalSupportTickets: number;
    openSupportTickets: number;
  };
  cityPerformance: Array<{
    cityId: string;
    cityName: string;
    ordersToday: number;
    activeDrivers: number;
    avgDeliveryTime: number;
    SLACompliance: number;
    revenue: number;
  }>;
  zoneHeatmap: Array<{
    zoneId: string;
    zoneName: string;
    demandLevel: string;
    activeOrders: number;
    availableDrivers: number;
    avgWaitTime: number;
  }>;
  alertSummary: {
    critical: number;
    warning: number;
    info: number;
    inventoryAlerts: number;
    fraudAlerts: number;
    deliveryAlerts: number;
  };
  realtimeMetrics: {
    ordersPerMinute: number;
    deliveriesPerMinute: number;
    revenuePerMinute: number;
    activeUsers: number;
  };
}

// ─── Store ──────────────────────────────────────────────────────────────────

export type OperationsState = {
  // Cities
  cities: City[];
  selectedCity: City | null;
  cityLoading: boolean;
  cityError: string | null;

  // Zones
  zones: Zone[];
  selectedZone: Zone | null;
  zoneLoading: boolean;
  zoneError: string | null;

  // Warehouses
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse | null;
  warehouseLoading: boolean;
  warehouseError: string | null;

  // Merchants (Ops View)
  opsMerchants: OperationsMerchant[];
  opsMerchantLoading: boolean;
  opsMerchantError: string | null;

  // Inventory
  inventoryItems: InventoryItem[];
  inventoryLoading: boolean;
  inventoryError: string | null;

  // Delivery (Ops View)
  opsDeliveries: OperationsDelivery[];
  opsDeliveryLoading: boolean;
  opsDeliveryError: string | null;

  // Customers (Ops View)
  opsCustomers: OperationsCustomer[];
  opsCustomerLoading: boolean;
  opsCustomerError: string | null;

  // Support
  supportTickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  supportLoading: boolean;
  supportError: string | null;

  // Escalations
  escalations: Escalation[];
  escalationLoading: boolean;
  escalationError: string | null;

  // SLA
  slaConfigs: SLA[];
  slaLoading: boolean;
  slaError: string | null;

  // Incidents
  incidents: Incident[];
  selectedIncident: Incident | null;
  incidentLoading: boolean;
  incidentError: string | null;

  // Business Rules
  businessRules: BusinessRule[];
  ruleLoading: boolean;
  ruleError: string | null;

  // Dashboard
  dashboard: OperationsDashboard | null;
  dashboardLoading: boolean;
  dashboardError: string | null;

  // Actions
  fetchCities: (filters?: Record<string, unknown>) => Promise<void>;
  fetchCityById: (id: string) => Promise<void>;
  updateCity: (id: string, data: Partial<City>) => Promise<void>;

  fetchZones: (filters?: Record<string, unknown>) => Promise<void>;
  fetchZoneById: (id: string) => Promise<void>;
  createZone: (data: Partial<Zone>) => Promise<void>;
  updateZone: (id: string, data: Partial<Zone>) => Promise<void>;

  fetchWarehouses: (filters?: Record<string, unknown>) => Promise<void>;
  fetchWarehouseById: (id: string) => Promise<void>;
  updateWarehouse: (id: string, data: Partial<Warehouse>) => Promise<void>;

  fetchOpsMerchants: (filters?: Record<string, unknown>) => Promise<void>;
  updateOpsMerchant: (id: string, data: Partial<OperationsMerchant>) => Promise<void>;

  fetchInventoryItems: (filters?: Record<string, unknown>) => Promise<void>;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => Promise<void>;

  fetchOpsDeliveries: (filters?: Record<string, unknown>) => Promise<void>;
  fetchOpsDeliveryById: (id: string) => Promise<void>;

  fetchOpsCustomers: (filters?: Record<string, unknown>) => Promise<void>;
  fetchOpsCustomerById: (id: string) => Promise<void>;

  fetchSupportTickets: (filters?: Record<string, unknown>) => Promise<void>;
  fetchSupportTicketById: (id: string) => Promise<void>;
  createSupportTicket: (data: Partial<SupportTicket>) => Promise<void>;
  updateSupportTicket: (id: string, data: Partial<SupportTicket>) => Promise<void>;
  assignTicket: (ticketId: string, agentId: string) => Promise<void>;
  resolveTicket: (ticketId: string) => Promise<void>;

  fetchEscalations: (filters?: Record<string, unknown>) => Promise<void>;
  acknowledgeEscalation: (id: string) => Promise<void>;
  resolveEscalation: (id: string, summary: string) => Promise<void>;
  addEscalationNote: (id: string, content: string) => Promise<void>;

  fetchSLAConfigs: (filters?: Record<string, unknown>) => Promise<void>;
  createSLAConfig: (data: Partial<SLA>) => Promise<void>;
  updateSLAConfig: (id: string, data: Partial<SLA>) => Promise<void>;
  toggleSLAStatus: (id: string) => Promise<void>;

  fetchIncidents: (filters?: Record<string, unknown>) => Promise<void>;
  fetchIncidentById: (id: string) => Promise<void>;
  createIncident: (data: Partial<Incident>) => Promise<void>;
  updateIncident: (id: string, data: Partial<Incident>) => Promise<void>;
  acknowledgeIncident: (id: string) => Promise<void>;
  resolveIncident: (id: string, resolution: string, rootCause: string) => Promise<void>;

  fetchBusinessRules: (filters?: Record<string, unknown>) => Promise<void>;
  createBusinessRule: (data: Partial<BusinessRule>) => Promise<void>;
  updateBusinessRule: (id: string, data: Partial<BusinessRule>) => Promise<void>;
  deleteBusinessRule: (id: string) => Promise<void>;
  toggleRuleStatus: (id: string) => Promise<void>;
  evaluateRule: (id: string) => Promise<void>;

  fetchDashboard: () => Promise<void>;

  setSelectedCity: (city: City | null) => void;
  setSelectedZone: (zone: Zone | null) => void;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  setSelectedTicket: (ticket: SupportTicket | null) => void;
  setSelectedIncident: (incident: Incident | null) => void;

  reset: () => void;
};

const initialState = {
  cities: [],
  selectedCity: null,
  cityLoading: false,
  cityError: null,
  zones: [],
  selectedZone: null,
  zoneLoading: false,
  zoneError: null,
  warehouses: [],
  selectedWarehouse: null,
  warehouseLoading: false,
  warehouseError: null,
  opsMerchants: [],
  opsMerchantLoading: false,
  opsMerchantError: null,
  inventoryItems: [],
  inventoryLoading: false,
  inventoryError: null,
  opsDeliveries: [],
  opsDeliveryLoading: false,
  opsDeliveryError: null,
  opsCustomers: [],
  opsCustomerLoading: false,
  opsCustomerError: null,
  supportTickets: [],
  selectedTicket: null,
  supportLoading: false,
  supportError: null,
  escalations: [],
  escalationLoading: false,
  escalationError: null,
  slaConfigs: [],
  slaLoading: false,
  slaError: null,
  incidents: [],
  selectedIncident: null,
  incidentLoading: false,
  incidentError: null,
  businessRules: [],
  ruleLoading: false,
  ruleError: null,
  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,
};

export const useOperationsStore = create<OperationsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ── Cities ─────────────────────────────────────────────────────────
      fetchCities: async (filters = {}) => {
        set({ cityLoading: true, cityError: null });
        try {
          const response = await operationsApi.getCities(filters);
          set({ cities: response.data, cityLoading: false });
        } catch (error: any) {
          set({ cityError: error.message, cityLoading: false });
        }
      },

      fetchCityById: async (id: string) => {
        set({ cityLoading: true, cityError: null });
        try {
          const response = await operationsApi.getCityById(id);
          set({ selectedCity: response.data, cityLoading: false });
        } catch (error: any) {
          set({ cityError: error.message, cityLoading: false });
        }
      },

      updateCity: async (id, data) => {
        try {
          await operationsApi.updateCity(id, data);
          set((state) => ({
            cities: state.cities.map((c) => (c.id === id ? { ...c, ...data } : c)),
            selectedCity: state.selectedCity?.id === id ? { ...state.selectedCity, ...data } : state.selectedCity,
          }));
        } catch (error: any) {
          console.error('Error updating city:', error);
          throw error;
        }
      },

      setSelectedCity: (city) => set({ selectedCity: city }),

      // ── Zones ──────────────────────────────────────────────────────────
      fetchZones: async (filters = {}) => {
        set({ zoneLoading: true, zoneError: null });
        try {
          const response = await operationsApi.getZones(filters);
          set({ zones: response.data, zoneLoading: false });
        } catch (error: any) {
          set({ zoneError: error.message, zoneLoading: false });
        }
      },

      fetchZoneById: async (id: string) => {
        set({ zoneLoading: true, zoneError: null });
        try {
          const response = await operationsApi.getZoneById(id);
          set({ selectedZone: response.data, zoneLoading: false });
        } catch (error: any) {
          set({ zoneError: error.message, zoneLoading: false });
        }
      },

      createZone: async (data) => {
        try {
          const response = await operationsApi.createZone(data);
          set((state) => ({ zones: [...state.zones, response.data] }));
        } catch (error: any) {
          console.error('Error creating zone:', error);
          throw error;
        }
      },

      updateZone: async (id, data) => {
        try {
          await operationsApi.updateZone(id, data);
          set((state) => ({
            zones: state.zones.map((z) => (z.id === id ? { ...z, ...data } : z)),
            selectedZone: state.selectedZone?.id === id ? { ...state.selectedZone, ...data } : state.selectedZone,
          }));
        } catch (error: any) {
          console.error('Error updating zone:', error);
          throw error;
        }
      },

      setSelectedZone: (zone) => set({ selectedZone: zone }),

      // ── Warehouses ─────────────────────────────────────────────────────
      fetchWarehouses: async (filters = {}) => {
        set({ warehouseLoading: true, warehouseError: null });
        try {
          const response = await operationsApi.getWarehouses(filters);
          set({ warehouses: response.data, warehouseLoading: false });
        } catch (error: any) {
          set({ warehouseError: error.message, warehouseLoading: false });
        }
      },

      fetchWarehouseById: async (id: string) => {
        set({ warehouseLoading: true, warehouseError: null });
        try {
          const response = await operationsApi.getWarehouseById(id);
          set({ selectedWarehouse: response.data, warehouseLoading: false });
        } catch (error: any) {
          set({ warehouseError: error.message, warehouseLoading: false });
        }
      },

      updateWarehouse: async (id, data) => {
        try {
          await operationsApi.updateWarehouse(id, data);
          set((state) => ({
            warehouses: state.warehouses.map((w) => (w.id === id ? { ...w, ...data } : w)),
            selectedWarehouse: state.selectedWarehouse?.id === id ? { ...state.selectedWarehouse, ...data } : state.selectedWarehouse,
          }));
        } catch (error: any) {
          console.error('Error updating warehouse:', error);
          throw error;
        }
      },

      setSelectedWarehouse: (warehouse) => set({ selectedWarehouse: warehouse }),

      // ── Merchants (Ops View) ───────────────────────────────────────────
      fetchOpsMerchants: async (filters = {}) => {
        set({ opsMerchantLoading: true, opsMerchantError: null });
        try {
          const response = await operationsApi.getOpsMerchants(filters);
          set({ opsMerchants: response.data, opsMerchantLoading: false });
        } catch (error: any) {
          set({ opsMerchantError: error.message, opsMerchantLoading: false });
        }
      },

      updateOpsMerchant: async (id, data) => {
        try {
          await operationsApi.updateOpsMerchant(id, data);
          set((state) => ({
            opsMerchants: state.opsMerchants.map((m) => (m.id === id ? { ...m, ...data } : m)),
          }));
        } catch (error: any) {
          console.error('Error updating merchant:', error);
          throw error;
        }
      },

      // ── Inventory ──────────────────────────────────────────────────────
      fetchInventoryItems: async (filters = {}) => {
        set({ inventoryLoading: true, inventoryError: null });
        try {
          const response = await operationsApi.getInventoryItems(filters);
          set({ inventoryItems: response.data, inventoryLoading: false });
        } catch (error: any) {
          set({ inventoryError: error.message, inventoryLoading: false });
        }
      },

      updateInventoryItem: async (id, data) => {
        try {
          await operationsApi.updateInventoryItem(id, data);
          set((state) => ({
            inventoryItems: state.inventoryItems.map((i) => (i.id === id ? { ...i, ...data } : i)),
          }));
        } catch (error: any) {
          console.error('Error updating inventory:', error);
          throw error;
        }
      },

      // ── Delivery (Ops View) ────────────────────────────────────────────
      fetchOpsDeliveries: async (filters = {}) => {
        set({ opsDeliveryLoading: true, opsDeliveryError: null });
        try {
          const response = await operationsApi.getOpsDeliveries(filters);
          set({ opsDeliveries: response.data, opsDeliveryLoading: false });
        } catch (error: any) {
          set({ opsDeliveryError: error.message, opsDeliveryLoading: false });
        }
      },

      fetchOpsDeliveryById: async (id: string) => {
        set({ opsDeliveryLoading: true, opsDeliveryError: null });
        try {
          const response = await operationsApi.getOpsDeliveryById(id);
          // Add to list or update
          set((state) => ({
            opsDeliveries: state.opsDeliveries.some((d) => d.id === id)
              ? state.opsDeliveries.map((d) => (d.id === id ? response.data : d))
              : [...state.opsDeliveries, response.data],
            opsDeliveryLoading: false,
          }));
        } catch (error: any) {
          set({ opsDeliveryError: error.message, opsDeliveryLoading: false });
        }
      },

      // ── Customers (Ops View) ───────────────────────────────────────────
      fetchOpsCustomers: async (filters = {}) => {
        set({ opsCustomerLoading: true, opsCustomerError: null });
        try {
          const response = await operationsApi.getOpsCustomers(filters);
          set({ opsCustomers: response.data, opsCustomerLoading: false });
        } catch (error: any) {
          set({ opsCustomerError: error.message, opsCustomerLoading: false });
        }
      },

      fetchOpsCustomerById: async (id: string) => {
        set({ opsCustomerLoading: true, opsCustomerError: null });
        try {
          const response = await operationsApi.getOpsCustomerById(id);
          set((state) => ({
            opsCustomers: state.opsCustomers.some((c) => c.id === id)
              ? state.opsCustomers.map((c) => (c.id === id ? response.data : c))
              : [...state.opsCustomers, response.data],
            opsCustomerLoading: false,
          }));
        } catch (error: any) {
          set({ opsCustomerError: error.message, opsCustomerLoading: false });
        }
      },

      // ── Support Tickets ────────────────────────────────────────────────
      fetchSupportTickets: async (filters = {}) => {
        set({ supportLoading: true, supportError: null });
        try {
          const response = await operationsApi.getSupportTickets(filters);
          set({ supportTickets: response.data, supportLoading: false });
        } catch (error: any) {
          set({ supportError: error.message, supportLoading: false });
        }
      },

      fetchSupportTicketById: async (id: string) => {
        set({ supportLoading: true, supportError: null });
        try {
          const response = await operationsApi.getSupportTicketById(id);
          set({ selectedTicket: response.data, supportLoading: false });
        } catch (error: any) {
          set({ supportError: error.message, supportLoading: false });
        }
      },

      createSupportTicket: async (data) => {
        try {
          const response = await operationsApi.createSupportTicket(data);
          set((state) => ({ supportTickets: [response.data, ...state.supportTickets] }));
        } catch (error: any) {
          console.error('Error creating ticket:', error);
          throw error;
        }
      },

      updateSupportTicket: async (id, data) => {
        try {
          await operationsApi.updateSupportTicket(id, data);
          set((state) => ({
            supportTickets: state.supportTickets.map((t) => (t.id === id ? { ...t, ...data } : t)),
            selectedTicket: state.selectedTicket?.id === id ? { ...state.selectedTicket, ...data } : state.selectedTicket,
          }));
        } catch (error: any) {
          console.error('Error updating ticket:', error);
          throw error;
        }
      },

      assignTicket: async (ticketId, agentId) => {
        try {
          await operationsApi.assignSupportTicket(ticketId, agentId);
          set((state) => ({
            supportTickets: state.supportTickets.map((t) =>
              t.id === ticketId ? { ...t, assignedTo: agentId, status: 'ASSIGNED' } : t
            ),
          }));
        } catch (error: any) {
          console.error('Error assigning ticket:', error);
          throw error;
        }
      },

      resolveTicket: async (ticketId) => {
        try {
          await operationsApi.resolveSupportTicket(ticketId);
          set((state) => ({
            supportTickets: state.supportTickets.map((t) =>
              t.id === ticketId ? { ...t, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : t
            ),
          }));
        } catch (error: any) {
          console.error('Error resolving ticket:', error);
          throw error;
        }
      },

      setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),

      // ── Escalations ────────────────────────────────────────────────────
      fetchEscalations: async (filters = {}) => {
        set({ escalationLoading: true, escalationError: null });
        try {
          const response = await operationsApi.getEscalations(filters);
          set({ escalations: response.data, escalationLoading: false });
        } catch (error: any) {
          set({ escalationError: error.message, escalationLoading: false });
        }
      },

      acknowledgeEscalation: async (id) => {
        try {
          await operationsApi.acknowledgeEscalation(id);
          set((state) => ({
            escalations: state.escalations.map((e) =>
              e.id === id ? { ...e, status: 'ACKNOWLEDGED' } : e
            ),
          }));
        } catch (error: any) {
          console.error('Error acknowledging escalation:', error);
          throw error;
        }
      },

      resolveEscalation: async (id, summary) => {
        try {
          await operationsApi.resolveEscalation(id, summary);
          set((state) => ({
            escalations: state.escalations.map((e) =>
              e.id === id ? { ...e, status: 'RESOLVED', resolutionSummary: summary, resolvedAt: new Date().toISOString() } : e
            ),
          }));
        } catch (error: any) {
          console.error('Error resolving escalation:', error);
          throw error;
        }
      },

      addEscalationNote: async (id, content) => {
        try {
          const response = await operationsApi.addEscalationNote(id, content);
          set((state) => ({
            escalations: state.escalations.map((e) =>
              e.id === id ? { ...e, notes: [...e.notes, response.data] } : e
            ),
          }));
        } catch (error: any) {
          console.error('Error adding note:', error);
          throw error;
        }
      },

      // ── SLA ────────────────────────────────────────────────────────────
      fetchSLAConfigs: async (filters = {}) => {
        set({ slaLoading: true, slaError: null });
        try {
          const response = await operationsApi.getSLAConfigs(filters);
          set({ slaConfigs: response.data, slaLoading: false });
        } catch (error: any) {
          set({ slaError: error.message, slaLoading: false });
        }
      },

      createSLAConfig: async (data) => {
        try {
          const response = await operationsApi.createSLAConfig(data);
          set((state) => ({ slaConfigs: [...state.slaConfigs, response.data] }));
        } catch (error: any) {
          console.error('Error creating SLA:', error);
          throw error;
        }
      },

      updateSLAConfig: async (id, data) => {
        try {
          await operationsApi.updateSLAConfig(id, data);
          set((state) => ({
            slaConfigs: state.slaConfigs.map((s) => (s.id === id ? { ...s, ...data } : s)),
          }));
        } catch (error: any) {
          console.error('Error updating SLA:', error);
          throw error;
        }
      },

      toggleSLAStatus: async (id) => {
        const sla = get().slaConfigs.find((s) => s.id === id);
        if (!sla) return;
        const newStatus = sla.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        try {
          await operationsApi.updateSLAConfig(id, { status: newStatus });
          set((state) => ({
            slaConfigs: state.slaConfigs.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
          }));
        } catch (error: any) {
          console.error('Error toggling SLA:', error);
        }
      },

      // ── Incidents ──────────────────────────────────────────────────────
      fetchIncidents: async (filters = {}) => {
        set({ incidentLoading: true, incidentError: null });
        try {
          const response = await operationsApi.getIncidents(filters);
          set({ incidents: response.data, incidentLoading: false });
        } catch (error: any) {
          set({ incidentError: error.message, incidentLoading: false });
        }
      },

      fetchIncidentById: async (id: string) => {
        set({ incidentLoading: true, incidentError: null });
        try {
          const response = await operationsApi.getIncidentById(id);
          set({ selectedIncident: response.data, incidentLoading: false });
        } catch (error: any) {
          set({ incidentError: error.message, incidentLoading: false });
        }
      },

      createIncident: async (data) => {
        try {
          const response = await operationsApi.createIncident(data);
          set((state) => ({ incidents: [response.data, ...state.incidents] }));
        } catch (error: any) {
          console.error('Error creating incident:', error);
          throw error;
        }
      },

      updateIncident: async (id, data) => {
        try {
          await operationsApi.updateIncident(id, data);
          set((state) => ({
            incidents: state.incidents.map((i) => (i.id === id ? { ...i, ...data } : i)),
            selectedIncident: state.selectedIncident?.id === id ? { ...state.selectedIncident, ...data } : state.selectedIncident,
          }));
        } catch (error: any) {
          console.error('Error updating incident:', error);
          throw error;
        }
      },

      acknowledgeIncident: async (id) => {
        try {
          await operationsApi.acknowledgeIncident(id);
          set((state) => ({
            incidents: state.incidents.map((i) =>
              i.id === id ? { ...i, status: 'ACKNOWLEDGED', acknowledgedAt: new Date().toISOString() } : i
            ),
          }));
        } catch (error: any) {
          console.error('Error acknowledging incident:', error);
        }
      },

      resolveIncident: async (id, resolution, rootCause) => {
        try {
          await operationsApi.resolveIncident(id, resolution, rootCause);
          set((state) => ({
            incidents: state.incidents.map((i) =>
              i.id === id ? { ...i, status: 'RESOLVED', resolution, rootCause, resolvedAt: new Date().toISOString() } : i
            ),
          }));
        } catch (error: any) {
          console.error('Error resolving incident:', error);
          throw error;
        }
      },

      setSelectedIncident: (incident) => set({ selectedIncident: incident }),

      // ── Business Rules ─────────────────────────────────────────────────
      fetchBusinessRules: async (filters = {}) => {
        set({ ruleLoading: true, ruleError: null });
        try {
          const response = await operationsApi.getBusinessRules(filters);
          set({ businessRules: response.data, ruleLoading: false });
        } catch (error: any) {
          set({ ruleError: error.message, ruleLoading: false });
        }
      },

      createBusinessRule: async (data) => {
        try {
          const response = await operationsApi.createBusinessRule(data);
          set((state) => ({ businessRules: [...state.businessRules, response.data] }));
        } catch (error: any) {
          console.error('Error creating rule:', error);
          throw error;
        }
      },

      updateBusinessRule: async (id, data) => {
        try {
          await operationsApi.updateBusinessRule(id, data);
          set((state) => ({
            businessRules: state.businessRules.map((r) => (r.id === id ? { ...r, ...data } : r)),
          }));
        } catch (error: any) {
          console.error('Error updating rule:', error);
          throw error;
        }
      },

      deleteBusinessRule: async (id) => {
        try {
          await operationsApi.deleteBusinessRule(id);
          set((state) => ({
            businessRules: state.businessRules.filter((r) => r.id !== id),
          }));
        } catch (error: any) {
          console.error('Error deleting rule:', error);
          throw error;
        }
      },

      toggleRuleStatus: async (id) => {
        const rule = get().businessRules.find((r) => r.id === id);
        if (!rule) return;
        const newStatus = rule.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
          await operationsApi.updateBusinessRule(id, { status: newStatus });
          set((state) => ({
            businessRules: state.businessRules.map((r) =>
              r.id === id ? { ...r, status: newStatus } : r
            ),
          }));
        } catch (error: any) {
          console.error('Error toggling rule:', error);
        }
      },

      evaluateRule: async (id) => {
        try {
          const response = await operationsApi.evaluateBusinessRule(id);
          set((state) => ({
            businessRules: state.businessRules.map((r) =>
              r.id === id
                ? { ...r, evaluationCount: response.data.evaluationCount, triggerCount: response.data.triggerCount, lastTriggeredAt: response.data.lastTriggeredAt }
                : r
            ),
          }));
        } catch (error: any) {
          console.error('Error evaluating rule:', error);
        }
      },

      // ── Dashboard ──────────────────────────────────────────────────────
      fetchDashboard: async () => {
        set({ dashboardLoading: true, dashboardError: null });
        try {
          const response = await operationsApi.getDashboard();
          set({ dashboard: response.data, dashboardLoading: false });
        } catch (error: any) {
          set({ dashboardError: error.message, dashboardLoading: false });
        }
      },

      reset: () => set({ ...initialState }),
    }),
    { name: 'OperationsStore' }
  )
);
