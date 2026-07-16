# Kartezy AI Platform

Centralized AI platform powering Kartezy's hyperlocal quick commerce ecosystem.

## Architecture

```
ai-platform/
├── src/
│   ├── config/           # Platform configuration
│   ├── models/           # ML model definitions and registry
│   │   ├── base-model.ts         # Abstract base model
│   │   ├── model-manager.ts      # Model lifecycle management
│   │   ├── recommendation/       # Recommendation engine models
│   │   ├── forecasting/         # Time series forecasting models
│   │   ├── fraud/              # Fraud detection models
│   │   ├── pricing/            # Dynamic pricing models
│   │   ├── nlp/               # NLP models
│   │   ├── cv/                # Computer vision models
│   │   └── voice/             # Voice AI models
│   ├── services/         # Inference and data services
│   ├── pipelines/        # Training and inference pipelines
│   ├── feature-store/    # Feature engineering and storage
│   ├── api/              # API handlers and routes
│   └── utils/            # Utilities and helpers
├── tests/
└── config/
```

## Core Capabilities

- **Recommendation Engine**: Collaborative, content-based, hybrid filtering
- **Smart Search**: Semantic, NLP-powered, personalized search
- **Forecasting**: Demand, sales, inventory forecasting
- **Dynamic Pricing**: Real-time price optimization
- **Fraud Detection**: ML-based fraud and abuse detection
- **Computer Vision**: Product recognition, barcode detection, shelf analysis
- **OCR**: Document processing (invoices, receipts, KYC)
- **NLP**: Sentiment analysis, entity extraction, translation
- **Voice AI**: Speech-to-text, text-to-speech, voice commands
- **Customer Intelligence**: Segmentation, LTV, churn prediction
- **Merchant Intelligence**: Sales insights, growth suggestions
- **Delivery Intelligence**: Route optimization, ETA prediction
- **Analytics AI**: Business insights, anomaly detection
- **Chatbot AI**: Multi-channel conversational AI

## Quick Start

```bash
npm install
npm run build
npm test
```

## Configuration

Set environment variables in `.env`:
- `AI_MODEL_PATH` - Path to stored models
- `REDIS_URL` - Redis connection for caching
- `ELASTICSEARCH_URL` - Search backend connection
- `LOG_LEVEL` - Logging verbosity (default: info)
