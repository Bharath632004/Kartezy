# Kartezy AI Platform

Enterprise Artificial Intelligence platform powering intelligent features across the Kartezy marketplace ecosystem.

## Modules

| Module | Description | Status |
|--------|-------------|--------|
| **recommendation-engine** | ML-based product recommendations | Scaffolded |
| **demand-forecasting** | Predictive demand and inventory planning | Scaffolded |
| **eta-prediction** | Real-time delivery ETA estimation | Scaffolded |
| **smart-search** | AI-powered semantic search and autocomplete | Scaffolded |
| **product-ranking** | Dynamic product ranking algorithms | Scaffolded |
| **dynamic-pricing** | Real-time price optimization engine | Scaffolded |
| **fraud-detection** | Transaction fraud detection and prevention | Scaffolded |
| **customer-segmentation** | Behavioral customer segmentation | Scaffolded |
| **inventory-forecasting** | Predictive inventory replenishment | Scaffolded |
| **merchant-insights** | Analytics and insights for merchants | Scaffolded |
| **delivery-optimization** | Route optimization and delivery assignment | Scaffolded |
| **business-intelligence** | Cross-platform BI and reporting | Scaffolded |
| **llm-assistant** | Large Language Model assistant integration | Scaffolded |
| **chatbot** | Customer support and conversational AI | Scaffolded |
| **ocr** | Optical Character Recognition for documents | Scaffolded |
| **image-recognition** | Product image analysis and tagging | Scaffolded |

## Architecture

All modules are Spring Boot microservices that register with Eureka discovery server and pull configuration from the central Config Server.

## Building

```bash
mvn clean package
```

## Technology Stack

- **Language:** Java 21
- **Framework:** Spring Boot 3.2
- **Discovery:** Netflix Eureka
- **Config:** Spring Cloud Config
- **ML Pipeline:** Integration-ready for TensorFlow/PyTorch/sklearn models
