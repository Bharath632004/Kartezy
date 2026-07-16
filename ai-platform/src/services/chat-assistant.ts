import { createLogger } from '../utils/logger';

const logger = createLogger('ChatAssistant');

export type AssistantRole = 'customer' | 'merchant' | 'delivery' | 'admin' | 'support' | 'operations';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatContext {
  userId: string;
  role: AssistantRole;
  language?: string;
  orderId?: string;
  storeId?: string;
  deliveryId?: string;
  history?: ChatMessage[];
}

interface ChatResponse {
  response: string;
  intent: string;
  confidence: number;
  suggestedActions: string[];
  requiresHumanAgent: boolean;
  actionType: string;
  conversationId: string;
  language: string;
}

const GREETINGS: Record<string, string> = {
  en: 'Hello! How can I help you today?',
  hi: 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?',
  ta: 'வணக்கம்! நான் உங்களுக்கு எப்படி உதவ முடியும்?',
  te: 'నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?',
  kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
  ml: 'നമസ്കാരം! എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും?',
};

const ROLE_DESCRIPTIONS: Record<AssistantRole, string> = {
  customer: 'I am your personal Kartezy shopping assistant. I can help you find products, track orders, get recommendations, and more.',
  merchant: 'I am your Kartezy merchant intelligence assistant. I can help you with sales insights, inventory management, pricing optimization, and business growth.',
  delivery: 'I am your Kartezy delivery partner assistant. I can help with route optimization, order assignments, performance tracking, and delivery support.',
  admin: 'I am your Kartezy admin intelligence assistant. I can provide business insights, analytics, system monitoring, and operational dashboards.',
  support: 'I am your Kartezy customer support assistant. I can help resolve customer issues, handle complaints, manage returns, and provide support information.',
  operations: 'I am your Kartezy operations assistant. I can help with fleet management, warehouse optimization, inventory planning, and operational metrics.',
};

export class ChatAssistant {
  private conversations: Map<string, ChatMessage[]> = new Map();
  private static readonly MAX_HISTORY = 50;

  constructor(private role: AssistantRole) {}

  getRoleDescription(userId: string, language: string = 'en'): string {
    return ROLE_DESCRIPTIONS[this.role] || ROLE_DESCRIPTIONS.customer;
  }

  async getResponse(context: ChatContext, message: string): Promise<ChatResponse> {
    logger.info(`[${this.role}] Processing message from ${context.userId}: ${message.substring(0, 50)}...`);

    const language = context.language || this.detectLanguage(message);
    this.recordMessage(context.userId, 'user', message);

    const intent = this.classifyIntent(message, this.role);
    const entities = this.extractEntities(message, intent);
    const responseText = this.generateResponse(message, intent, entities, context, language);
    const suggestedActions = this.getSuggestedActions(intent, language);
    const requiresHuman = this.requiresHumanAgent(intent);

    const response: ChatResponse = {
      response: responseText,
      intent,
      confidence: this.calculateConfidence(intent, message),
      suggestedActions,
      requiresHumanAgent: requiresHuman,
      actionType: this.determineActionType(intent),
      conversationId: `conv-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      language,
    };

    this.recordMessage(context.userId, 'assistant', responseText);
    return response;
  }

  getConversationHistory(userId: string): ChatMessage[] {
    return this.conversations.get(userId) || [];
  }

  clearHistory(userId: string): void {
    this.conversations.delete(userId);
    logger.info(`Cleared conversation history for ${userId}`);
  }

  private classifyIntent(message: string, role: AssistantRole): string {
    const lower = message.toLowerCase();

    if (lower.match(/\b(hi|hello|hey|namaste|vanakkam|good\s*(morning|afternoon|evening))\b/)) return 'GREETING';
    if (lower.match(/\b(thank|thanks|bye|goodbye|okay|ok|done)\b/)) return 'FAREWELL';
    if (lower.match(/\b(help|support|guide|how\s*to|what\s*can\s*you)\b/)) return 'HELP_REQUEST';

    switch (role) {
      case 'customer':
        if (lower.match(/\b(order|track|where\s*is\s*my)\b/)) return 'ORDER_STATUS';
        if (lower.match(/\b(search|find|looking|want|need|buy|show)\b/)) return 'PRODUCT_SEARCH';
        if (lower.match(/\b(delivery|shipping|dispatch|out\s*for|arriving)\b/)) return 'DELIVERY_STATUS';
        if (lower.match(/\b(return|cancel|refund|exchange|replace)\b/)) return 'RETURN_CANCEL';
        if (lower.match(/\b(pay|payment|wallet|upi|card|cod|bill)\b/)) return 'PAYMENT_QUERY';
        if (lower.match(/\b(recommend|suggest|offer|deal|coupon|discount|trending)\b/)) return 'RECOMMENDATION';
        if (lower.match(/\b(complaint|issue|problem|broken|damaged|wrong|bad)\b/)) return 'COMPLAINT';
        if (lower.match(/\b(account|profile|password|login|update|change)\b/)) return 'ACCOUNT_QUERY';
        return 'GENERAL_QUERY';

      case 'merchant':
        if (lower.match(/\b(sales|revenue|income|earning|profit)\b/)) return 'SALES_INSIGHT';
        if (lower.match(/\b(inventory|stock|restock|replenish|warehouse)\b/)) return 'INVENTORY_INSIGHT';
        if (lower.match(/\b(pricing|price|discount|offer|promotion)\b/)) return 'PRICING_INSIGHT';
        if (lower.match(/\b(product|best\s*seller|top|trending|performance)\b/)) return 'PRODUCT_INSIGHT';
        if (lower.match(/\b(customer|review|rating|feedback|segment)\b/)) return 'CUSTOMER_INSIGHT';
        if (lower.match(/\b(dashboard|overview|summary|report)\b/)) return 'DASHBOARD';
        return 'GENERAL_QUERY';

      case 'delivery':
        if (lower.match(/\b(route|navigation|direction|map|optimize)\b/)) return 'ROUTE_OPTIMIZATION';
        if (lower.match(/\b(order|assignment|pickup|drop|deliver)\b/)) return 'ORDER_ASSIGNMENT';
        if (lower.match(/\b(earn|earning|income|payment|payout)\b/)) return 'EARNING_QUERY';
        if (lower.match(/\b(shift|schedule|available|online|offline)\b/)) return 'SHIFT_MANAGEMENT';
        if (lower.match(/\b(performance|rating|score|stats|metrics)\b/)) return 'PERFORMANCE';
        return 'GENERAL_QUERY';

      case 'admin':
        if (lower.match(/\b(dashboard|overview|summary|metrics|kpi)\b/)) return 'DASHBOARD';
        if (lower.match(/\b(analytics|insight|trend|report)\b/)) return 'ANALYTICS';
        if (lower.match(/\b(monitor|system|health|status|alert)\b/)) return 'MONITORING';
        if (lower.match(/\b(user|customer|merchant|driver|role|permission)\b/)) return 'USER_MANAGEMENT';
        if (lower.match(/\b(config|setting|feature|flag|toggle)\b/)) return 'CONFIGURATION';
        return 'GENERAL_QUERY';

      default:
        return 'GENERAL_QUERY';
    }
  }

  private extractEntities(message: string, intent: string): Record<string, string> {
    const entities: Record<string, string> = {};

    const orderMatch = message.match(/(?:order|ORD|#)?(\d{4,12})/i);
    if (orderMatch) entities.orderId = orderMatch[1];

    const amountMatch = message.match(/(?:Rs|INR|₹)\s*(\d+(?:,\d{3})*(?:\.\d{2})?|\d+\.\d{2})/);
    if (amountMatch) entities.amount = amountMatch[1];

    const phoneMatch = message.match(/[6-9]\d{9}/);
    if (phoneMatch) entities.phone = phoneMatch[0];

    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) entities.email = emailMatch[0];

    const dateMatch = message.match(/\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/);
    if (dateMatch) entities.date = dateMatch[0];

    if (intent === 'PRODUCT_SEARCH') {
      const patterns = ['search for ', 'search ', 'find ', 'looking for ', 'want ', 'need ', 'buy ', 'show me '];
      for (const pattern of patterns) {
        const idx = message.toLowerCase().indexOf(pattern);
        if (idx >= 0) {
          entities.query = message.substring(idx + pattern.length).replace(/[.!?].*$/, '').trim();
          break;
        }
      }
    }

    return entities;
  }

  private generateResponse(message: string, intent: string, entities: Record<string, string>,
                           context: ChatContext, language: string): string {
    const role = context.role;

    if (intent === 'GREETING') {
      const greeting = GREETINGS[language] || GREETINGS.en;
      const roleDesc = ROLE_DESCRIPTIONS[role];
      return `${greeting}\n\n${roleDesc}`;
    }

    if (intent === 'FAREWELL') return 'Thank you for using Kartezy! Have a great day! 😊';
    if (intent === 'HELP_REQUEST') {
      const helps: Record<AssistantRole, string> = {
        customer: 'I can help you with:\n• 📦 Order tracking\n• 🔍 Product search\n• 🚚 Delivery updates\n• ↩️ Returns & refunds\n• 💳 Payment issues',
        merchant: 'I can help you with:\n• 📊 Sales & revenue insights\n• 📦 Inventory management\n• 💰 Pricing optimization\n• 📈 Business growth\n• 👥 Customer insights',
        delivery: 'I can help you with:\n• 🗺️ Route optimization\n• 📋 Order assignments\n• 💵 Earning reports\n• ⭐ Performance tracking\n• 🚚 Delivery support',
        admin: 'I can help you with:\n• 📊 Dashboard & KPIs\n• 📈 Analytics & reports\n• 🔒 System monitoring\n• 👥 User management\n• ⚙️ Configuration',
        support: 'I can help you with:\n• 🎫 Ticket management\n• 📞 Customer issues\n• ↩️ Returns & refunds\n• 💬 Customer queries\n• 📋 Knowledge base',
        operations: 'I can help you with:\n• 🚚 Fleet management\n• 🏭 Warehouse optimization\n• 📦 Inventory planning\n• 📊 Operational metrics\n• 📈 Performance analysis',
      };
      return helps[role] || helps.customer;
    }

    switch (role) {
      case 'customer': return this.generateCustomerResponse(intent, entities, language);
      case 'merchant': return this.generateMerchantResponse(intent, entities);
      case 'delivery': return this.generateDeliveryResponse(intent, entities);
      case 'admin': return this.generateAdminResponse(intent, entities);
      case 'support': return this.generateSupportResponse(intent, entities);
      case 'operations': return this.generateOperationsResponse(intent, entities);
      default: return 'I understand your query. Let me help you with that.';
    }
  }

  private generateCustomerResponse(intent: string, entities: Record<string, string>, language: string): string {
    switch (intent) {
      case 'ORDER_STATUS':
        return entities.orderId
          ? `Let me check order #${entities.orderId} for you. 📋\n\nYour order is currently being processed. Estimated delivery: Tomorrow by 8 PM.`
          : 'I\'d be happy to check your order status. Could you please provide your order ID?';
      case 'PRODUCT_SEARCH':
        return entities.query
          ? `Great! Let me search for "${entities.query}" on Kartezy. 🔍\n\nI'll find the best options and deals for you.`
          : 'What kind of products are you looking for? You can tell me a product name, category, or brand.';
      case 'DELIVERY_STATUS':
        return entities.orderId
          ? `Tracking delivery for order #${entities.orderId}... 🚚\n\nYour delivery partner is on the way! ETA: 15-20 minutes.`
          : 'I can help track your delivery. Please provide your order ID.';
      case 'RETURN_CANCEL':
        return 'I understand you want to return or cancel. ↩️\n\nReturns are accepted within 7 days of delivery. Let me check the eligibility for you.';
      case 'PAYMENT_QUERY':
        return 'I can help with payment queries. 💳\n\nKartezy accepts UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. What specific issue are you facing?';
      case 'RECOMMENDATION':
        return 'I\'d love to recommend some products! 🎯\n\nBased on your preferences, I can suggest trending items, top deals, and personalized picks. What category interests you?';
      case 'COMPLAINT':
        return 'I\'m sorry to hear that! 🙏\n\nPlease provide more details so I can help resolve this quickly. I can connect you with our support team if needed.';
      case 'ACCOUNT_QUERY':
        return 'I can help with account-related queries. 👤\n\nYou can update your profile, change password, and manage preferences in Account Settings.';
      default:
        return 'I\'m not quite sure I understand. Could you please rephrase? You can ask me about orders, products, delivery, payments, or any other queries.';
    }
  }

  private generateMerchantResponse(intent: string, entities: Record<string, string>): string {
    switch (intent) {
      case 'SALES_INSIGHT': return 'Here are your sales insights 📊\n\n• Today: ₹45,230 (+12% vs yesterday)\n• This week: ₹3,12,450 (+8% vs last week)\n• Best selling category: Groceries (35% of sales)';
      case 'INVENTORY_INSIGHT': return 'Here are your inventory insights 📦\n\n• Low stock alerts: 12 products\n• Out of stock: 5 products\n• Overstocked: 23 products\n• Recommended restock: 8 products';
      case 'PRICING_INSIGHT': return 'Here are pricing suggestions 💰\n\n• 5 products can be increased (high demand)\n• 3 products should be discounted (competition)\n• Optimal margin range: 18-25%';
      case 'PRODUCT_INSIGHT': return 'Here are your top products 📈\n\n1. Product A - ₹50,000 sales\n2. Product B - ₹42,000 sales\n3. Product C - ₹38,000 sales';
      case 'CUSTOMER_INSIGHT': return 'Here are your customer insights 👥\n\n• Repeat customers: 65%\n• Average rating: 4.2/5\n• Top segment: Regular shoppers\n• At-risk customers: 8';
      case 'DASHBOARD': return 'Merchant Dashboard Overview 📊\n\n• Total Sales: ₹12,45,000\n• Orders Today: 156\n• Avg Order Value: ₹345\n• Customer Rating: 4.2 ⭐';
      default: return 'I can help you with sales insights, inventory management, pricing, and business growth. What would you like to know?';
    }
  }

  private generateDeliveryResponse(intent: string, entities: Record<string, string>): string {
    switch (intent) {
      case 'ROUTE_OPTIMIZATION': return 'Route optimization complete 🗺️\n\n• Optimized route saves 15 min\n• Distance: 8.5 km\n• Orders: 4 deliveries\n• Estimated completion: 2 hours';
      case 'ORDER_ASSIGNMENT': return 'Order assignment details 📋\n\n• You have 3 new orders\n• Pickup from: Store #102, Store #115\n• Best route optimized for minimum time';
      case 'EARNING_QUERY': return 'Your earnings today 💵\n\n• Today: ₹850 (5 deliveries)\n• This week: ₹5,200\n• This month: ₹22,500\n• Incentives earned: ₹350';
      case 'SHIFT_MANAGEMENT': return 'Shift management ⏰\n\n• Current shift: 2 PM - 10 PM\n• Online status: Active\n• Orders completed: 4/8 target\n• Break: Available at 6 PM';
      case 'PERFORMANCE': return 'Your performance metrics ⭐\n\n• On-time delivery: 95%\n• Customer rating: 4.8/5\n• Orders/hour: 2.5\n• Acceptance rate: 92%';
      default: return 'I can help with routes, orders, earnings, and performance. What do you need?';
    }
  }

  private generateAdminResponse(intent: string, entities: Record<string, string>): string {
    switch (intent) {
      case 'DASHBOARD': return 'Admin Dashboard 📊\n\n• Active Users: 1,24,532\n• Total Orders: 45,678\n• Revenue: ₹2,45,67,890\n• Growth: +15% MoM\n• System Health: ✅ All services operational';
      case 'ANALYTICS': return 'Analytics Overview 📈\n\n• Customer acquisition: +12%\n• Order growth: +18%\n• Revenue per user: ₹345\n• Retention rate: 62%';
      case 'MONITORING': return 'System Health ✅\n\n• All 23 microservices operational\n• API latency: 45ms avg\n• Error rate: 0.02%\n• Cache hit ratio: 89%';
      case 'USER_MANAGEMENT': return 'User Management 👥\n\n• Total users: 1,24,532\n• Active customers: 98,450\n• Merchants: 2,340\n• Delivery partners: 5,678';
      case 'CONFIGURATION': return 'Current System Configuration ⚙️\n\n• Feature flags: 12 active\n• Pricing rules: 8 enabled\n• Fraud rules: 15 active\n• Notification templates: 23';
      default: return 'I can help with dashboard, analytics, monitoring, and system management. What would you like?';
    }
  }

  private generateSupportResponse(intent: string, entities: Record<string, string>): string {
    switch (intent) {
      case 'ORDER_STATUS': return entities.orderId
        ? `Found ticket for order #${entities.orderId}. Customer reported delay in delivery. Status: In Progress.`
        : 'Please provide the order ID or customer details to look up the ticket.';
      case 'COMPLAINT': return 'I can help resolve complaints. I see the issue has been escalated to our senior team.';
      case 'RETURN_CANCEL': return 'For returns: 7-day policy applies. Items must be unused with original packaging.';
      default: return 'How can I help you with customer support? I can handle tickets, complaints, returns, and queries.';
    }
  }

  private generateOperationsResponse(intent: string, entities: Record<string, string>): string {
    switch (intent) {
      case 'ROUTE_OPTIMIZATION': return 'Fleet optimization complete 🚚\n\n• 45 active drivers\n• Fleet utilization: 78%\n• Average delivery time: 22 min\n• Optimized 156 routes today';
      case 'ORDER_ASSIGNMENT': return 'Warehouse status 🏭\n\n• Orders pending: 234\n• Picking in progress: 89\n• Ready for dispatch: 145\n• Packing efficiency: 92%';
      default: return 'I can help with fleet, warehouse, inventory, and operations. What do you need?';
    }
  }

  private getSuggestedActions(intent: string, language: string): string[] {
    const isHindi = language === 'hi';
    const defaults = isHindi
      ? ['अपना ऑर्डर चेक करें', 'उत्पाद खोजें', 'सहायता प्राप्त करें']
      : ['Check my order', 'Search products', 'Get help'];

    return defaults;
  }

  private requiresHumanAgent(intent: string): boolean {
    return ['COMPLAINT', 'PAYMENT_QUERY'].includes(intent);
  }

  private determineActionType(intent: string): string {
    if (['ORDER_STATUS', 'DELIVERY_STATUS'].includes(intent)) return 'RETRIEVE_INFO';
    if (['RETURN_CANCEL'].includes(intent)) return 'INITIATE_PROCESS';
    if (['PRODUCT_SEARCH', 'RECOMMENDATION'].includes(intent)) return 'NAVIGATE';
    if (['COMPLAINT'].includes(intent)) return 'ESCALATE';
    return 'RESPOND';
  }

  private detectLanguage(message: string): string {
    if (message.match(/[\u0900-\u097F]/)) return 'hi';
    if (message.match(/[\u0B80-\u0BFF]/)) return 'ta';
    if (message.match(/[\u0C00-\u0C7F]/)) return 'te';
    if (message.match(/[\u0C80-\u0CFF]/)) return 'kn';
    if (message.match(/[\u0D00-\u0D7F]/)) return 'ml';
    return 'en';
  }

  private calculateConfidence(intent: string, message: string): number {
    if (intent === 'GREETING' || intent === 'FAREWELL') return 0.95;
    if (intent === 'GENERAL_QUERY') return 0.45;
    return Math.min(0.95, 0.7 + message.split(/\s+/).length * 0.005);
  }

  private recordMessage(userId: string, role: 'user' | 'assistant' | 'system', content: string): void {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, []);
    }
    const history = this.conversations.get(userId)!;
    history.push({ role, content, timestamp: new Date() });
    if (history.length > ChatAssistant.MAX_HISTORY) history.shift();
  }
}

// Assistant factory
export function createAssistant(role: AssistantRole): ChatAssistant {
  return new ChatAssistant(role);
}
