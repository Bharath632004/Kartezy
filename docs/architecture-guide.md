# Kartezy Architecture Guide

## Overview

Kartezy is a hyperlocal quick commerce platform built with a **microservices architecture** on the backend and **feature-first** organization on the frontend. The platform connects nearby customers with local merchants for instant and scheduled delivery of essentials.

## Architecture Principles

1. **Domain-Driven Design**: Each microservice owns a bounded context
2. **Event-Driven Communication**: Asynchronous events via Kafka and RabbitMQ
3. **API Gateway Pattern**: All client traffic routes through Spring Cloud Gateway
4. **Service Discovery**: Eureka handles dynamic service registration
5. **Externalized Configuration**: Spring Cloud Config with Git-backed repository
6. **CQRS Ready**: Services designed to support command/query separation
7. **Clean Architecture**: Layered design within each service

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Customer │ │ Merchant │ │ Delivery │ │ Admin/Website   │  │
│  │  Mobile  │ │  Mobile  │ │  Mobile  │ │  (Next.js)     │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬────────┘  │
└───────┼────────────┼────────────┼────────────────┼───────────┘
        │            │            │                │
┌───────▼────────────▼────────────▼────────────────▼───────────┐
│                    API Gateway (port 8080)                     │
│              Spring Cloud Gateway + Security                    │
└───────────────────────────────┬───────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────┐
│                    Service Discovery (Eureka)                   │
│                        Config Server                           │
└───────┬───────────────────────────────┬───────────────────────┘
        │                               │
┌───────▼───────────────────┐ ┌────────▼──────────────────────┐
│   Business Microservices  │ │     AI/ML Microservices       │
│                           │ │                               │
│  ┌─────────────────────┐  │ │  ┌─────────────────────────┐  │
│  │   Auth Service      │  │ │  │   AI Service            │  │
│  │   User Service      │  │ │  │   Recommendation        │  │
│  │   Merchant Service  │  │ │  │   Forecasting           │  │
│  │   Catalog Service   │  │ │  │   Fraud Detection       │  │
│  │   Inventory Service │  │ │  │   Computer Vision       │  │
│  │   Order Service     │  │ │  │   NLP Service           │  │
│  │   Payment Service   │  │ │  │   OCR Service           │  │
│  │   Delivery Service  │  │ │  │   Voice Service         │  │
│  │   Notification Svc  │  │ │  │   Chatbot Service       │  │
│  │   Review Service    │  │ │  └─────────────────────────┘  │
│  │   Wallet Service    │  │ │                               │
│  │   Analytics Service │  │ │                               │
│  └─────────────────────┘  │ └───────────────────────────────┘
└───────┬───────────────────┘
        │
┌───────▼───────────────────────────────────────────────────────┐
│                    Data Layer                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────┐ ┌────────┐ ┌─────────┐   │
│  │PostgreSQL│ │ MongoDB  │ │ Redis│ │ Kafka  │ │Elastic  │   │
│  │(Relational)│ (NoSQL)  │ │Cache │ │Events  │ │Search   │   │
│  └──────────┘ └──────────┘ └──────┘ └────────┘ └─────────┘   │
└────────────────────────────────────────────────────────────────┘
```

## Service Communication

### Synchronous (REST)
- API Gateway routes to services via Eureka discovery
- Services communicate via Feign clients for query operations
- Circuit breakers (Resilience4J) protect against failures

### Asynchronous (Events)
- **Kafka**: Order lifecycle events, payment events, delivery updates
- **RabbitMQ**: Notification delivery, analytics events
- Event sourcing ready for audit trails and replay

## Data Architecture

### Databases
- **PostgreSQL**: Primary relational data (users, orders, products, merchants)
- **MongoDB**: Catalog data, reviews, analytics events
- **Redis**: Session cache, rate limiting, real-time inventory
- **Elasticsearch**: Full-text search, analytics, log aggregation

### Data Flow
```
Order Creation:
Customer -> API Gateway -> Order Service -> Kafka Event
  -> Inventory Service (reserve stock)
  -> Payment Service (process payment)
  -> Notification Service (send confirmation)
  -> Delivery Service (assign delivery partner)
```

## Security Architecture

1. **Authentication**: JWT-based with refresh tokens
2. **Authorization**: Role-based (CUSTOMER, MERCHANT, DELIVERY, ADMIN)
3. **API Security**: Rate limiting, request validation, CORS
4. **Data Security**: Encrypted at rest, TLS in transit
5. **Secret Management**: Externalized via environment variables

## Deployment Architecture

```
Development: Docker Compose (local)
Staging: Kubernetes (single cluster)
Production: Kubernetes (multi-cluster, HA)
```

## Monitoring & Observability

- **Metrics**: Prometheus + Grafana dashboards
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Distributed tracing with Spring Cloud Sleuth
- **Alerting**: Prometheus AlertManager
- **Health Checks**: Spring Boot Actuator + readiness/liveness probes

## Key Design Decisions

1. **Microservices over Monolith**: Enables independent scaling and deployment
2. **Kafka for Order Events**: Guaranteed delivery, replay capability
3. **Redis for Inventory**: Real-time stock management with pub/sub
4. **PostgreSQL for Transactions**: ACID compliance for financial operations
5. **Feature-First Flutter**: Organized by business capability for maintainability
6. **Next.js App Router**: Server components for SEO, client components for interactivity
