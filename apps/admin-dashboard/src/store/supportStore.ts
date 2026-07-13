import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supportService } from '@/lib/api';

// Using the support service from '@/lib/api'

export type Ticket = {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  type: 'technical' | 'billing' | 'account' | 'feature_request' | 'bug' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  category: string;
  subcategory?: string;
  tags: string[];
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterType: 'customer' | 'merchant' | 'driver' | 'admin';
  assignedTo?: string;
  assignedToName?: string;
  assignedGroup?: string;
  ccEmails: string[];
  slaDueDate?: string;
  firstResponseDue?: string;
  resolutionDue?: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  satisfactionRating?: number;
  satisfactionComment?: string;
  timeSpent: number; // in minutes
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  activityLog: Array<{
    id: string;
    timestamp: string;
    actorId: string;
    actorName: string;
    action: string;
    details?: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeBaseArticle = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  views: number;
  helpful Votes: number;
  notHelpfulVotes: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'merchant' | 'driver' | 'agent' | 'bot';
  message: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  read: boolean;
};

export type SupportSettings = {
  id: string;
  enableLiveChat: boolean;
  chatWidgetPosition: 'bottom-left' | 'bottom-right';
  businessHours: {
    monday: { start: string; end: string; enabled: boolean };
    tuesday: { start: string; end: string; enabled: boolean };
    wednesday: { start: string; end: string; enabled: boolean };
    thursday: { start: string; end: string; enabled: boolean };
    friday: { start: string; end: string; enabled: boolean };
    saturday: { start: string; end: string; enabled: boolean };
    sunday: { start: string; end: string: string; enabled: boolean };
  };
  timezone: string;
  autoAssignment: boolean;
  assignmentRules: Array<{
    id: string;
    name: string;
    conditions: any;
    assignTo: string;
    assignGroup: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }>;
  slaPolicies: Array<{
    id: string;
    name: string;
    responseTime: number; // in minutes
    resolutionTime: number; // in minutes
    appliesTo: string[];
  }>;
  emailNotifications: {
    newTicket: boolean;
    agentAssignment: boolean;
    ticketUpdate: boolean;
    ticketResolution: boolean;
    satisfactionRequest: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

export type SupportStats = {
  totalTickets: number;
  openTickets: number;
  pendingTickets: number;
  resolvedToday: number;
  averageFirstResponseTime: number; // in minutes
  averageResolutionTime: number; // in hours
  customerSatisfactionScore: number;
  ticketVolumeByDay: Array<{
    date: string;
    count: number;
  }>;
  ticketVolumeByCategory: Array<{
    category: string;
    count: number;
  }>;
  ticketVolumeByPriority: Array<{
    priority: string;
    count: number;
  }>;
  agentPerformance: Array<{
    agentId: string;
    agentName: string;
    ticketsHandled: number;
    avgResponseTime: number;
    avgResolutionTime: number;
    satisfactionScore: number;
  }>;
};

export type SupportState = {
  tickets: Ticket[];
  knowledgeBase: KnowledgeBaseArticle[];
  chatMessages: ChatMessage[];
  settings: SupportSettings | null;
  stats: SupportStats | null;
  loading: boolean;
  error: string | null;
  setTickets: (tickets: Ticket[]) => void;
  setKnowledgeBase: (articles: KnowledgeBaseArticle[]) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setSettings: (settings: SupportSettings) => void;
  setStats: (stats: SupportStats) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, ticket: Partial<Ticket>) => void;
  removeTicket: (id: string) => void;
  addKnowledgeBaseArticle: (article: KnowledgeBaseArticle) => void;
  updateKnowledgeBaseArticle: (id: string, article: Partial<KnowledgeBaseArticle>) => void;
  removeKnowledgeBaseArticle: (id: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  updateChatMessage: (id: string, message: Partial<ChatMessage>) => void;
  removeChatMessage: (id: string) => void;
  fetchTickets: (filters?: any) => Promise<void>;
  fetchTicket: (id: string) => Promise<Ticket | null>;
  createTicket: (data: any) => Promise<void>;
  updateTicketAPI: (id: string, data: any) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  assignTicket: (ticketId: string, agentId: string) => Promise<void>;
  addTicketComment: (ticketId: string, comment: string, authorId: string, authorName: string) => Promise<void>;
  changeTicketStatus: (ticketId: string, status: string) => Promise<void>;
  changeTicketPriority: (ticketId: string, priority: string) => Promise<void>;
  resolveTicket: (ticketId: string, resolution: string) => Promise<void>;
  closeTicket: (ticketId: string) => Promise<void>;
  reopenTicket: (ticketId: string) => Promise<void>;
  fetchKnowledgeBase: (filters?: any) => Promise<void>;
  createKnowledgeBaseArticle: (data: any) => Promise<void>;
  updateKnowledgeBaseArticleAPI: (id: string, data: any) => Promise<void>;
  deleteKnowledgeBaseArticle: (id: string) => Promise<void>;
  fetchChatMessages: (conversationId: string) => Promise<void>;
  sendChatMessage: (conversationId: string, message: string, senderId: string, senderName: string, senderType: string) => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: any) => Promise<void>;
  fetchStats: (filters?: any) => Promise<void>;
  exportTickets: (format: string, filters: any) => Promise<string>;
  bulkUpdateTickets: (ticketIds: string[], updates: Partial<Ticket>) => Promise<void>;
  bulkDeleteTickets: (ticketIds: string[]) => Promise<void>;
  reset: () => void;
};

export const useSupportStore = create<SupportState>()(
  devtools(
    (set, get) => ({
      tickets: [],
      knowledgeBase: [],
      chatMessages: [],
      settings: null,
      stats: null,
      loading: false,
      error: null,
      setTickets: (tickets) => set({ tickets }),
      setKnowledgeBase: (articles) => set({ knowledgeBase: articles }),
      setChatMessages: (messages) => set({ chatMessages: messages }),
      setSettings: (settings) => set({ settings }),
      setStats: (stats) => set({ stats }),
      addTicket: (ticket) => set((state) => ({ tickets: [...state.tickets, ticket] })),
      updateTicket: (id, ticket) =>
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, ...ticket } : t
          ),
        })),
      removeTicket: (id) =>
        set((state) => ({
          tickets: state.tickets.filter((t) => t.id !== id),
        })),
      addKnowledgeBaseArticle: (article) =>
        set((state) => ({ knowledgeBase: [...state.knowledgeBase, article] })),
      updateKnowledgeBaseArticle: (id, article) =>
        set((state) => ({
          knowledgeBase: state.knowledgeBase.map((a) =>
            a.id === id ? { ...a, ...article } : a
          ),
        })),
      removeKnowledgeBaseArticle: (id) =>
        set((state) => ({
          knowledgeBase: state.knowledgeBase.filter((a) => a.id !== id),
        })),
      addChatMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      updateChatMessage: (id, message) =>
        set((state) => ({
          chatMessages: state.chatMessages.map((m) =>
            m.id === id ? { ...m, ...message } : m
          ),
        })),
      removeChatMessage: (id) =>
        set((state) => ({
          chatMessages: state.chatMessages.filter((m) => m.id !== id),
        })),
      fetchTickets: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await supportService.getTickets(filters);
          set({ tickets: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchTicket: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await supportService.getTicket(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      createTicket: async (data) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a support service API
          await supportService.createTicket(data);
          // After creating, we could refresh the ticket list if needed
          // For now, we'll rely on the UI to refetch or we could fetch updated list
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateTicketAPI: async (id, data) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a support service API
          get().updateTicket(id, data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      deleteTicket: async (id) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a support service API
          get().removeTicket(id);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      assignTicket: async (ticketId, agentId) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a support service API
          const ticket = get().tickets.find((t) => t.id === ticketId);
          if (ticket) {
            // In a real implementation, we'd fetch agent details
            get().updateTicket(ticketId, {
              assignedTo: agentId,
              assignedToName: `Agent ${agentId}`,
              activityLog: [
                ...ticket.activityLog,
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  actorId: 'system',
                  actorName: 'System',
                  action: 'assigned',
                  details: `Assigned to agent ${agentId}`,
                },
              ],
            });
          }
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      addTicketComment: async (ticketId, comment, authorId, authorName) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a support service API
          const ticket = get().tickets.find((t) => t.id === ticketId);
          if (ticket) {
            const newActivity = {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorId: authorId,
              actorName: authorName,
              action: 'comment',
              details: comment,
            };
            get().updateTicket(ticketId, {
              activityLog: [...ticket.activityLog, newActivity],
            });
          }
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      changeTicketStatus: async (ticketId, status) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a support service API
          const ticket = get().tickets.find((t) => t.id === ticketId);
          if (ticket) {
            const statusChangeActivity = {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorId: 'current_user',
              actorName: 'Current User',
              action: 'status_change',
              details: `Changed status from ${ticket.status} to ${status}`,
            };
            let updatedTicket = { ...ticket, status };
            if (status === 'resolved') {
              updatedTicket = {
                ...updatedTicket,
                resolvedAt: new Date().toISOString(),
              };
            } else if (status === 'closed') {
              updatedTicket = {
                ...updatedTicket,
                closedAt: new Date().toISOString(),
              };
            }
            get().updateTicket(ticketId, {
              ...updatedTicket,
              activityLog: [...ticket.activityLog, statusChangeActivity],
            });
          }
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      changeTicketPriority: async (ticketId, priority) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a support service API
          const ticket = get().tickets.find((t) => t.id === ticketId);
          if (ticket) {
            const priorityChangeActivity = {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorId: 'current_user',
              actorName: 'Current User',
              action: 'priority_change',
              details: `Changed priority from ${ticket.priority} to ${priority}`,
            };
            get().updateTicket(ticketId, {
              ...ticket,
              priority,
              activityLog: [...ticket.activityLog, priorityChangeActivity],
            });
          }
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      resolveTicket: async (ticketId, resolution) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a support service API
          const ticket = get().tickets.find((t) => t.id === ticketId);
          if (ticket) {
            const resolutionActivity = {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorId: 'current_user',
              actorName: 'Current User',
              action: 'resolved',
              details: `Resolved with: ${resolution}`,
            };
            get().updateTicket(ticketId, {
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
              activityLog: [...ticket.activityLog, resolutionActivity],
            });
          }
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      closeTicket: async (ticketId) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a support service API
          const ticket = get().tickets.find((t) => t.id === ticketId);
          if (ticket) {
            const closeActivity = {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorId: 'current_user',
              actorName: 'Current User',
              action: 'closed',
              details: 'Ticket closed',
            };
            get().updateTicket(ticketId, {
              status: 'closed',
              closedAt: new Date().toISOString(),
              activityLog: [...ticket.activityLog, closeActivity],
            });
          }
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      reopenTicket: async (ticketId) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a support service API
          const ticket = get().tickets.find((t) => t.id === ticketId);
          if (ticket) {
            const reopenActivity = {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorId: 'current_user',
              actorName: 'Current User',
              action: 'reopened',
              details: 'Ticket reopened',
            };
            get().updateTicket(ticketId, {
              status: 'open',
              resolvedAt: undefined,
              closedAt: undefined,
              activityLog: [...ticket.activityLog, reopenActivity],
            });
          }
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchKnowledgeBase: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a knowledge base API
          set({ knowledgeBase: [], loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      createKnowledgeBaseArticle: async (data) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a knowledge base API
          const newArticle = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          get().addKnowledgeBaseArticle(newArticle);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateKnowledgeBaseArticleAPI: async (id, data) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a knowledge base API
          get().updateKnowledgeBaseArticle(id, data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      deleteKnowledgeBaseArticle: async (id) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a knowledge base API
          get().removeKnowledgeBaseArticle(id);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchChatMessages: async (conversationId) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a chat service API
          set({ chatMessages: [], loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      sendChatMessage: async (conversationId, message, senderId, senderName, senderType) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a chat service API
          const newMessage = {
            id: Math.random().toString(36).substr(2, 9),
            conversationId,
            senderId,
            senderName,
            senderType: senderType as any,
            message,
            type: 'text',
            timestamp: new Date().toISOString(),
            read: false,
          };
          get().addChatMessage(newMessage);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
          // This would typically call a settings API
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateSettings: async (data) => {
        set({ loading: true, error: null });
        try {
          // This would typically call a settings API
          get().setSettings(data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchStats: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await supportService.fetchStats(filters);
          set({ stats: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      exportTickets: async (format, filters) => {
        set({ loading: true, error: null });
        try {
          const response = await supportService.exportTickets(format, filters);
          set({ loading: false });
          return response.data?.fileUrl || '';
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      bulkUpdateTickets: async (ticketIds, updates) => {
        set({ loading: true, error: null });
        try {
          ticketIds.forEach((id) => {
            get().updateTicket(id, updates);
          });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      bulkDeleteTickets: async (ticketIds) => {
        set({ loading: true, error: null });
        try {
          ticketIds.forEach((id) => {
            get().removeTicket(id);
          });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      reset: () => {
        set({
          tickets: [],
          knowledgeBase: [],
          chatMessages: [],
          settings: null,
          stats: null,
          loading: false,
          error: null,
        });
      },
    }),
    { name: 'SupportStore' }
  )
);