import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { crmService } from '@/lib/api';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lifetimeValue: number;
  segment: string;
  lifecycleStage: 'NEW' | 'ACTIVE' | 'AT_RISK' | 'CHURNED' | 'VIP';
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  loyaltyPoints: number;
  referralCount: number;
  signupDate: string;
  lastOrderDate: string;
  lastActivityDate: string;
  tags: string[];
  engagementScore: number;
  churnProbability: number;
}

export interface CustomerActivity {
  id: string;
  type: 'ORDER' | 'LOGIN' | 'REVIEW' | 'REFERRAL' | 'SUPPORT' | 'COUPON' | 'LOYALTY';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: 'WEBSITE' | 'REFERRAL' | 'SOCIAL' | 'EMAIL' | 'ADS' | 'ORGANIC' | 'OTHER';
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  score: number;
  assignedTo?: string;
  company?: string;
  title?: string;
  budget?: number;
  notes?: string;
  createdAt: string;
  lastContactedAt?: string;
  convertedAt?: string;
  convertedToCustomerId?: string;
  tags: string[];
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'ARCHIVED';
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationActionType[];
  stats: {
    totalTriggered: number;
    totalCompleted: number;
    conversionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AutomationTrigger {
  type: 'WELCOME' | 'CART_ABANDON' | 'ORDER_CONFIRMED' | 'BIRTHDAY' | 'ANNIVERSARY' | 'CUSTOM_EVENT' | 'SEGMENT_JOIN' | 'INACTIVITY';
  config: Record<string, unknown>;
}

export interface AutomationCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'IN';
  value: unknown;
}

export type AutomationActionType = 'SEND_EMAIL' | 'SEND_SMS' | 'SEND_PUSH' | 'AWARD_POINTS' | 'APPLY_TAG' | 'ADD_TO_SEGMENT' | 'CREATE_TASK' | 'UPDATE_FIELD';

export interface Segment {
  id: string;
  name: string;
  description: string;
  color: string;
  rules: SegmentRule[];
  customerCount: number;
  avgOrderValue: number;
  avgLifetimeValue: number;
  conversionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentRule {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'CONTAINS' | 'IN' | 'LAST_N_DAYS';
  value: unknown;
  valueEnd?: unknown;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'BIRTHDAY' | 'ANNIVERSARY' | 'MILESTONE' | 'REFERRAL' | 'CUSTOM';
  pointsCost?: number;
  value: number;
  valueType: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING' | 'POINTS';
  image?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  createdAt: string;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  rewardName: string;
  customerId: string;
  customerName: string;
  pointsCost: number;
  status: 'PENDING' | 'APPROVED' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED';
  redeemedAt: string;
  createdAt: string;
}

export interface MarketingAnalytics {
  overview: {
    totalCustomers: number;
    totalLeads: number;
    conversionRate: number;
    totalCampaigns: number;
    activeCampaigns: number;
    totalAutomations: number;
    customerGrowth: number;
    revenueAttributed: number;
  };
  channelPerformance: Array<{
    channel: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
  }>;
  customerGrowth: Array<{ date: string; newCustomers: number; totalCustomers: number }>;
  campaignPerformance: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    spend: number;
  }>;
  segmentBreakdown: Array<{ segment: string; count: number; percentage: number; avgLTV: number }>;
  conversionFunnel: Array<{ stage: string; count: number; dropoff: number }>;
  monthlyTrend: Array<{ month: string; revenue: number; spend: number; profit: number }>;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export type CRMState = {
  // Customers
  customers: CustomerProfile[];
  selectedCustomer: CustomerProfile | null;
  customerActivities: CustomerActivity[];
  customerLoading: boolean;
  customerError: string | null;

  // Leads
  leads: Lead[];
  leadLoading: boolean;
  leadError: string | null;

  // Automation
  workflows: AutomationWorkflow[];
  workflowLoading: boolean;
  workflowError: string | null;

  // Segments
  segments: Segment[];
  segmentLoading: boolean;
  segmentError: string | null;

  // Rewards
  rewards: Reward[];
  redemptions: RewardRedemption[];
  rewardLoading: boolean;
  rewardError: string | null;

  // Analytics
  analytics: MarketingAnalytics | null;
  analyticsLoading: boolean;
  analyticsError: string | null;

  // Actions
  fetchCustomers: (filters?: Record<string, unknown>) => Promise<void>;
  fetchCustomerById: (id: string) => Promise<void>;
  fetchCustomerActivities: (customerId: string) => Promise<void>;
  updateCustomer: (id: string, data: Partial<CustomerProfile>) => Promise<void>;

  fetchLeads: (filters?: Record<string, unknown>) => Promise<void>;
  createLead: (data: Partial<Lead>) => Promise<void>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;

  fetchWorkflows: (filters?: Record<string, unknown>) => Promise<void>;
  createWorkflow: (data: Partial<AutomationWorkflow>) => Promise<void>;
  updateWorkflow: (id: string, data: Partial<AutomationWorkflow>) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  toggleWorkflowStatus: (id: string) => Promise<void>;

  fetchSegments: (filters?: Record<string, unknown>) => Promise<void>;
  createSegment: (data: Partial<Segment>) => Promise<void>;
  updateSegment: (id: string, data: Partial<Segment>) => Promise<void>;
  deleteSegment: (id: string) => Promise<void>;

  fetchRewards: (filters?: Record<string, unknown>) => Promise<void>;
  createReward: (data: Partial<Reward>) => Promise<void>;
  updateReward: (id: string, data: Partial<Reward>) => Promise<void>;
  deleteReward: (id: string) => Promise<void>;
  fetchRedemptions: (filters?: Record<string, unknown>) => Promise<void>;
  approveRedemption: (id: string) => Promise<void>;

  fetchAnalytics: () => Promise<void>;
  setSelectedCustomer: (customer: CustomerProfile | null) => void;
  reset: () => void;
};

const initialState = {
  customers: [],
  selectedCustomer: null,
  customerActivities: [],
  customerLoading: false,
  customerError: null,
  leads: [],
  leadLoading: false,
  leadError: null,
  workflows: [],
  workflowLoading: false,
  workflowError: null,
  segments: [],
  segmentLoading: false,
  segmentError: null,
  rewards: [],
  redemptions: [],
  rewardLoading: false,
  rewardError: null,
  analytics: null,
  analyticsLoading: false,
  analyticsError: null,
};

export const useCRMStore = create<CRMState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ── Customers ──────────────────────────────────────────────────────
      fetchCustomers: async (filters = {}) => {
        set({ customerLoading: true, customerError: null });
        try {
          const response = await crmService.getCustomers(filters);
          set({ customers: response.data, customerLoading: false });
        } catch (error: any) {
          set({ customerError: error.message, customerLoading: false });
        }
      },

      fetchCustomerById: async (id: string) => {
        set({ customerLoading: true, customerError: null });
        try {
          const response = await crmService.getCustomerById(id);
          set({ selectedCustomer: response.data, customerLoading: false });
        } catch (error: any) {
          set({ customerError: error.message, customerLoading: false });
        }
      },

      fetchCustomerActivities: async (customerId: string) => {
        try {
          const response = await crmService.getCustomerActivities(customerId);
          set({ customerActivities: response.data });
        } catch (error: any) {
          console.error('Error fetching customer activities:', error);
        }
      },

      updateCustomer: async (id: string, data: Partial<CustomerProfile>) => {
        try {
          await crmService.updateCustomer(id, data);
          set((state) => ({
            customers: state.customers.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
            selectedCustomer:
              state.selectedCustomer?.id === id
                ? { ...state.selectedCustomer, ...data }
                : state.selectedCustomer,
          }));
        } catch (error: any) {
          console.error('Error updating customer:', error);
          throw error;
        }
      },

      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

      // ── Leads ──────────────────────────────────────────────────────────
      fetchLeads: async (filters = {}) => {
        set({ leadLoading: true, leadError: null });
        try {
          const response = await crmService.getLeads(filters);
          set({ leads: response.data, leadLoading: false });
        } catch (error: any) {
          set({ leadError: error.message, leadLoading: false });
        }
      },

      createLead: async (data) => {
        try {
          const response = await crmService.createLead(data);
          set((state) => ({ leads: [...state.leads, response.data] }));
        } catch (error: any) {
          console.error('Error creating lead:', error);
          throw error;
        }
      },

      updateLead: async (id, data) => {
        try {
          await crmService.updateLead(id, data);
          set((state) => ({
            leads: state.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
          }));
        } catch (error: any) {
          console.error('Error updating lead:', error);
          throw error;
        }
      },

      deleteLead: async (id) => {
        try {
          await crmService.deleteLead(id);
          set((state) => ({ leads: state.leads.filter((l) => l.id !== id) }));
        } catch (error: any) {
          console.error('Error deleting lead:', error);
          throw error;
        }
      },

      // ── Workflows ──────────────────────────────────────────────────────
      fetchWorkflows: async (filters = {}) => {
        set({ workflowLoading: true, workflowError: null });
        try {
          const response = await crmService.getWorkflows(filters);
          set({ workflows: response.data, workflowLoading: false });
        } catch (error: any) {
          set({ workflowError: error.message, workflowLoading: false });
        }
      },

      createWorkflow: async (data) => {
        try {
          const response = await crmService.createWorkflow(data);
          set((state) => ({ workflows: [...state.workflows, response.data] }));
        } catch (error: any) {
          console.error('Error creating workflow:', error);
          throw error;
        }
      },

      updateWorkflow: async (id, data) => {
        try {
          await crmService.updateWorkflow(id, data);
          set((state) => ({
            workflows: state.workflows.map((w) =>
              w.id === id ? { ...w, ...data } : w
            ),
          }));
        } catch (error: any) {
          console.error('Error updating workflow:', error);
          throw error;
        }
      },

      deleteWorkflow: async (id) => {
        try {
          await crmService.deleteWorkflow(id);
          set((state) => ({
            workflows: state.workflows.filter((w) => w.id !== id),
          }));
        } catch (error: any) {
          console.error('Error deleting workflow:', error);
          throw error;
        }
      },

      toggleWorkflowStatus: async (id) => {
        const workflow = get().workflows.find((w) => w.id === id);
        if (!workflow) return;
        const newStatus =
          workflow.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        try {
          await crmService.updateWorkflow(id, { status: newStatus });
          set((state) => ({
            workflows: state.workflows.map((w) =>
              w.id === id ? { ...w, status: newStatus } : w
            ),
          }));
        } catch (error: any) {
          console.error('Error toggling workflow:', error);
        }
      },

      // ── Segments ───────────────────────────────────────────────────────
      fetchSegments: async (filters = {}) => {
        set({ segmentLoading: true, segmentError: null });
        try {
          const response = await crmService.getSegments(filters);
          set({ segments: response.data, segmentLoading: false });
        } catch (error: any) {
          set({ segmentError: error.message, segmentLoading: false });
        }
      },

      createSegment: async (data) => {
        try {
          const response = await crmService.createSegment(data);
          set((state) => ({ segments: [...state.segments, response.data] }));
        } catch (error: any) {
          console.error('Error creating segment:', error);
          throw error;
        }
      },

      updateSegment: async (id, data) => {
        try {
          await crmService.updateSegment(id, data);
          set((state) => ({
            segments: state.segments.map((s) =>
              s.id === id ? { ...s, ...data } : s
            ),
          }));
        } catch (error: any) {
          console.error('Error updating segment:', error);
          throw error;
        }
      },

      deleteSegment: async (id) => {
        try {
          await crmService.deleteSegment(id);
          set((state) => ({
            segments: state.segments.filter((s) => s.id !== id),
          }));
        } catch (error: any) {
          console.error('Error deleting segment:', error);
          throw error;
        }
      },

      // ── Rewards ────────────────────────────────────────────────────────
      fetchRewards: async (filters = {}) => {
        set({ rewardLoading: true, rewardError: null });
        try {
          const response = await crmService.getRewards(filters);
          set({ rewards: response.data, rewardLoading: false });
        } catch (error: any) {
          set({ rewardError: error.message, rewardLoading: false });
        }
      },

      createReward: async (data) => {
        try {
          const response = await crmService.createReward(data);
          set((state) => ({ rewards: [...state.rewards, response.data] }));
        } catch (error: any) {
          console.error('Error creating reward:', error);
          throw error;
        }
      },

      updateReward: async (id, data) => {
        try {
          await crmService.updateReward(id, data);
          set((state) => ({
            rewards: state.rewards.map((r) =>
              r.id === id ? { ...r, ...data } : r
            ),
          }));
        } catch (error: any) {
          console.error('Error updating reward:', error);
          throw error;
        }
      },

      deleteReward: async (id) => {
        try {
          await crmService.deleteReward(id);
          set((state) => ({
            rewards: state.rewards.filter((r) => r.id !== id),
          }));
        } catch (error: any) {
          console.error('Error deleting reward:', error);
          throw error;
        }
      },

      fetchRedemptions: async (filters = {}) => {
        try {
          const response = await crmService.getRedemptions(filters);
          set({ redemptions: response.data });
        } catch (error: any) {
          console.error('Error fetching redemptions:', error);
        }
      },

      approveRedemption: async (id) => {
        try {
          await crmService.approveRedemption(id);
          set((state) => ({
            redemptions: state.redemptions.map((r) =>
              r.id === id ? { ...r, status: 'APPROVED' } : r
            ),
          }));
        } catch (error: any) {
          console.error('Error approving redemption:', error);
          throw error;
        }
      },

      // ── Analytics ──────────────────────────────────────────────────────
      fetchAnalytics: async () => {
        set({ analyticsLoading: true, analyticsError: null });
        try {
          const response = await crmService.getMarketingAnalytics();
          set({ analytics: response.data, analyticsLoading: false });
        } catch (error: any) {
          set({ analyticsError: error.message, analyticsLoading: false });
        }
      },

      reset: () => set({ ...initialState }),
    }),
    { name: 'CRMStore' }
  )
);
