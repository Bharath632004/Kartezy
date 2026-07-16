import { ChatAssistant, createAssistant } from '../../src/services/chat-assistant';

describe('ChatAssistant', () => {
  describe('Customer Assistant', () => {
    const assistant = createAssistant('customer');

    test('should respond to greetings', async () => {
      const response = await assistant.getResponse(
        { userId: 'user1', role: 'customer' },
        'Hello, I need help!'
      );
      expect(response.response).toContain('Hello');
      expect(response.intent).toBe('GREETING');
      expect(response.confidence).toBeGreaterThan(0.8);
    });

    test('should handle order status queries', async () => {
      const response = await assistant.getResponse(
        { userId: 'user1', role: 'customer', orderId: 'ORD-123456' },
        'Where is my order?'
      );
      expect(response.intent).toBe('ORDER_STATUS');
      expect(response.response).toBeDefined();
      expect(response.suggestedActions.length).toBeGreaterThan(0);
    });

    test('should handle product search queries', async () => {
      const response = await assistant.getResponse(
        { userId: 'user1', role: 'customer' },
        'Search for groceries near me'
      );
      expect(response.intent).toBe('PRODUCT_SEARCH');
      expect(response.response).toContain('groceries');
    });

    test('should handle complaints and escalate', async () => {
      const response = await assistant.getResponse(
        { userId: 'user1', role: 'customer' },
        'I have a complaint about broken delivery'
      );
      expect(response.intent).toBe('COMPLAINT');
      expect(response.requiresHumanAgent).toBe(true);
      expect(response.actionType).toBe('ESCALATE');
    });

    test('should maintain conversation history', async () => {
      await assistant.getResponse(
        { userId: 'history_user', role: 'customer' },
        'Hello'
      );
      await assistant.getResponse(
        { userId: 'history_user', role: 'customer' },
        'Track my order'
      );
      const history = assistant.getConversationHistory('history_user');
      expect(history.length).toBe(4); // 2 user + 2 assistant
      expect(history[0].role).toBe('user');
      expect(history[1].role).toBe('assistant');
    });
  });

  describe('Merchant Assistant', () => {
    const assistant = createAssistant('merchant');

    test('should handle sales insight queries', async () => {
      const response = await assistant.getResponse(
        { userId: 'merchant1', role: 'merchant' },
        'Show me my sales insights'
      );
      expect(response.intent).toBe('SALES_INSIGHT');
      expect(response.response).toContain('sales');
    });

    test('should handle inventory queries', async () => {
      const response = await assistant.getResponse(
        { userId: 'merchant1', role: 'merchant' },
        'What is my inventory status?'
      );
      expect(response.intent).toBe('INVENTORY_INSIGHT');
      expect(response.response).toContain('inventory');
    });
  });

  describe('Delivery Assistant', () => {
    const assistant = createAssistant('delivery');

    test('should handle route optimization queries', async () => {
      const response = await assistant.getResponse(
        { userId: 'driver1', role: 'delivery' },
        'Optimize my route'
      );
      expect(response.intent).toBe('ROUTE_OPTIMIZATION');
      expect(response.response).toContain('route');
    });

    test('should handle earning queries', async () => {
      const response = await assistant.getResponse(
        { userId: 'driver1', role: 'delivery' },
        'How much did I earn today?'
      );
      expect(response.intent).toBe('EARNING_QUERY');
      expect(response.response).toContain('earnings');
    });
  });

  describe('Admin Assistant', () => {
    const assistant = createAssistant('admin');

    test('should handle dashboard queries', async () => {
      const response = await assistant.getResponse(
        { userId: 'admin1', role: 'admin' },
        'Show me the dashboard'
      );
      expect(response.intent).toBe('DASHBOARD');
      expect(response.response).toContain('Dashboard');
    });

    test('should handle monitoring queries', async () => {
      const response = await assistant.getResponse(
        { userId: 'admin1', role: 'admin' },
        'How is the system health?'
      );
      expect(response.intent).toBe('MONITORING');
      expect(response.response).toContain('Service');
    });
  });

  describe('Support Assistant', () => {
    const assistant = createAssistant('support');

    test('should handle order queries', async () => {
      const response = await assistant.getResponse(
        { userId: 'support1', role: 'support' },
        'Found ticket for order #ORD-123'
      );
      expect(response.intent).toBe('ORDER_STATUS');
      expect(response.response).toContain('ORD-123');
    });
  });

  describe('Operations Assistant', () => {
    const assistant = createAssistant('operations');

    test('should handle optimization queries', async () => {
      const response = await assistant.getResponse(
        { userId: 'ops1', role: 'operations' },
        'Optimize fleet routes'
      );
      expect(response.intent).toBe('ROUTE_OPTIMIZATION');
      expect(response.response).toContain('fleet');
    });
  });

  describe('Multi-language Support', () => {
    const assistant = createAssistant('customer');

    test('should detect Hindi', async () => {
      const response = await assistant.getResponse(
        { userId: 'user1', role: 'customer' },
        'नमस्ते, मुझे ऑर्डर चेक करना है'
      );
      expect(response.language).toBe('hi');
    });

    test('should detect Tamil', async () => {
      const response = await assistant.getResponse(
        { userId: 'user1', role: 'customer' },
        'வணக்கம், எனது ஆர்டரைச் சரிபார்க்கவும்'
      );
      expect(response.language).toBe('ta');
    });
  });

  describe('History Management', () => {
    const assistant = createAssistant('customer');

    test('should clear history', async () => {
      await assistant.getResponse(
        { userId: 'clear_user', role: 'customer' },
        'Hello'
      );
      expect(assistant.getConversationHistory('clear_user').length).toBe(2);
      assistant.clearHistory('clear_user');
      expect(assistant.getConversationHistory('clear_user').length).toBe(0);
    });
  });
});
