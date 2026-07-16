import { APIHandler } from './handler';

export interface RouteDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: keyof APIHandler;
  auth: boolean;
  rateLimit: number;
  description: string;
}

export const routes: RouteDefinition[] = [
  // === HEALTH & STATUS ===
  { method: 'GET', path: '/v1/health', handler: 'healthCheck' as keyof APIHandler, auth: false, rateLimit: 100, description: 'Health check endpoint' },
  { method: 'GET', path: '/v1/models/status', handler: 'handleModelStatus' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get all model statuses' },

  // === RECOMMENDATION ENGINE ===
  { method: 'POST', path: '/v1/recommendations/personalized', handler: 'handleRecommendation' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Get personalized recommendations' },
  { method: 'POST', path: '/v1/recommendations/similar', handler: 'handleRecommendation' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Get similar products' },
  { method: 'POST', path: '/v1/recommendations/trending', handler: 'handleRecommendation' as keyof APIHandler, auth: false, rateLimit: 200, description: 'Get trending products' },
  { method: 'POST', path: '/v1/recommendations/cross-sell', handler: 'handleRecommendation' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Get cross-sell recommendations' },
  { method: 'POST', path: '/v1/recommendations/upsell', handler: 'handleRecommendation' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Get upsell recommendations' },
  { method: 'POST', path: '/v1/recommendations/home-feed', handler: 'handleHomeFeed' as keyof APIHandler, auth: true, rateLimit: 50, description: 'Get personalized home feed' },
  { method: 'POST', path: '/v1/recommendations/festival', handler: 'handleRecommendation' as keyof APIHandler, auth: true, rateLimit: 50, description: 'Get festival recommendations' },
  { method: 'POST', path: '/v1/recommendations/frequently-bought-together', handler: 'handleRecommendation' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Get frequently bought together products' },

  // === SEARCH ===
  { method: 'POST', path: '/v1/search', handler: 'handleSearch' as keyof APIHandler, auth: false, rateLimit: 200, description: 'Search products, stores, brands' },
  { method: 'GET', path: '/v1/search/autocomplete', handler: 'handleAutocomplete' as keyof APIHandler, auth: false, rateLimit: 300, description: 'Get autocomplete suggestions' },
  { method: 'GET', path: '/v1/search/spell-check', handler: 'handleSpellCheck' as keyof APIHandler, auth: false, rateLimit: 200, description: 'Spell check search query' },

  // === FORECASTING ===
  { method: 'POST', path: '/v1/forecast/demand', handler: 'handleForecasting' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get demand forecast' },
  { method: 'POST', path: '/v1/forecast/sales', handler: 'handleForecasting' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get sales forecast' },
  { method: 'POST', path: '/v1/forecast/inventory', handler: 'handleInventoryForecast' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get inventory forecast' },

  // === PRICING ===
  { method: 'POST', path: '/v1/pricing/calculate', handler: 'handlePricing' as keyof APIHandler, auth: true, rateLimit: 200, description: 'Calculate dynamic price' },
  { method: 'POST', path: '/v1/pricing/discount-optimize', handler: 'handlePricing' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Optimize discount' },

  // === FRAUD DETECTION ===
  { method: 'POST', path: '/v1/fraud/check', handler: 'handleFraudDetection' as keyof APIHandler, auth: true, rateLimit: 200, description: 'Check transaction/user for fraud' },

  // === OCR ===
  { method: 'POST', path: '/v1/ocr/extract', handler: 'handleOCR' as keyof APIHandler, auth: true, rateLimit: 50, description: 'Extract text from document image' },

  // === NLP ===
  { method: 'POST', path: '/v1/nlp/process', handler: 'handleNLP' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Process text with NLP' },

  // === VOICE ===
  { method: 'POST', path: '/v1/voice/process', handler: 'handleVoice' as keyof APIHandler, auth: true, rateLimit: 50, description: 'Process voice input' },
  { method: 'POST', path: '/v1/voice/command', handler: 'handleVoice' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Process voice command' },

  // === COMPUTER VISION ===
  { method: 'POST', path: '/v1/cv/recognize', handler: 'handleComputerVision' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Recognize products in image' },
  { method: 'POST', path: '/v1/cv/similarity', handler: 'handleComputerVision' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Compute image similarity' },
  { method: 'POST', path: '/v1/cv/duplicate', handler: 'handleComputerVision' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Detect duplicate products' },
  { method: 'POST', path: '/v1/cv/shelf-analysis', handler: 'handleComputerVision' as keyof APIHandler, auth: true, rateLimit: 30, description: 'Analyze shelf image' },

  // === CUSTOMER INTELLIGENCE ===
  { method: 'GET', path: '/v1/customer-intelligence/profile', handler: 'handleCustomerIntelligence' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Get customer profile' },
  { method: 'GET', path: '/v1/customer-intelligence/segments', handler: 'handleCustomerIntelligence' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Get customer segments' },
  { method: 'GET', path: '/v1/customer-intelligence/lifetime-value', handler: 'handleCustomerIntelligence' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Predict customer lifetime value' },
  { method: 'GET', path: '/v1/customer-intelligence/churn-risk', handler: 'handleCustomerIntelligence' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get churn risk assessment' },

  // === MERCHANT INTELLIGENCE ===
  { method: 'GET', path: '/v1/merchant-intelligence/dashboard', handler: 'handleMerchantIntelligence' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Get merchant dashboard' },
  { method: 'GET', path: '/v1/merchant-intelligence/sales-forecast', handler: 'handleMerchantIntelligence' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get sales forecast' },
  { method: 'GET', path: '/v1/merchant-intelligence/top-products', handler: 'handleMerchantIntelligence' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Get top products' },
  { method: 'GET', path: '/v1/merchant-intelligence/inventory-suggestions', handler: 'handleMerchantIntelligence' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get inventory suggestions' },

  // === DELIVERY INTELLIGENCE ===
  { method: 'GET', path: '/v1/delivery-intelligence/eta', handler: 'handleDeliveryIntelligence' as keyof APIHandler, auth: true, rateLimit: 200, description: 'Predict ETA' },
  { method: 'GET', path: '/v1/delivery-intelligence/route-optimize', handler: 'handleDeliveryIntelligence' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Optimize delivery route' },
  { method: 'GET', path: '/v1/delivery-intelligence/driver-assign', handler: 'handleDeliveryIntelligence' as keyof APIHandler, auth: true, rateLimit: 200, description: 'Assign driver to order' },

  // === ANALYTICS / BI ===
  { method: 'GET', path: '/v1/analytics/business', handler: 'handleAnalytics' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get business insights' },
  { method: 'GET', path: '/v1/analytics/customer', handler: 'handleAnalytics' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get customer insights' },
  { method: 'GET', path: '/v1/analytics/inventory', handler: 'handleAnalytics' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get inventory insights' },
  { method: 'GET', path: '/v1/analytics/marketing', handler: 'handleAnalytics' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get marketing insights' },
  { method: 'GET', path: '/v1/analytics/financial', handler: 'handleAnalytics' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get financial insights' },
  { method: 'GET', path: '/v1/analytics/operational', handler: 'handleAnalytics' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get operational insights' },
  { method: 'GET', path: '/v1/analytics/anomalies', handler: 'handleAnalytics' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Detect anomalies' },
  { method: 'GET', path: '/v1/analytics/funnel', handler: 'handleAnalytics' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Analyze conversion funnel' },
  { method: 'GET', path: '/v1/analytics/cohort', handler: 'handleAnalytics' as keyof APIHandler, auth: true, rateLimit: 30, description: 'Perform cohort analysis' },
  { method: 'GET', path: '/v1/analytics/predictions', handler: 'handleAnalytics' as keyof APIHandler, auth: true, rateLimit: 60, description: 'Get sales predictions' },

  // === CHAT ASSISTANTS ===
  { method: 'POST', path: '/v1/chat/customer', handler: 'handleChat' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Customer chat assistant' },
  { method: 'POST', path: '/v1/chat/merchant', handler: 'handleChat' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Merchant chat assistant' },
  { method: 'POST', path: '/v1/chat/delivery', handler: 'handleChat' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Delivery partner chat assistant' },
  { method: 'POST', path: '/v1/chat/admin', handler: 'handleChat' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Admin chat assistant' },
  { method: 'POST', path: '/v1/chat/support', handler: 'handleChat' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Support chat assistant' },
  { method: 'POST', path: '/v1/chat/operations', handler: 'handleChat' as keyof APIHandler, auth: true, rateLimit: 100, description: 'Operations chat assistant' },
  { method: 'GET', path: '/v1/chat/history', handler: 'handleChatHistory' as keyof APIHandler, auth: true, rateLimit: 200, description: 'Get chat history' },
];

export function getRoutes(): RouteDefinition[] {
  return routes;
}

export function findRoute(method: string, path: string): RouteDefinition | undefined {
  return routes.find(r => r.method === method && r.path === path);
}
