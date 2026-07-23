# Kartezy Architecture Guide

## System Overview

Kartezy is an AI-powered hyperlocal quick-commerce platform built on a microservices architecture with mobile-first delivery.

## Architecture Principles

1. **Microservices** — Each business capability is an independently deployable service
2. **Event-Driven** — Async communication via Kafka/RabbitMQ for resilience
3. **API Gateway** — Single entry point with routing, auth, rate limiting
4. **Service Discovery** — Eureka for dynamic service registration
5. **Config Centralization** — Spring Cloud Config Server for externalized config
6. **Observability** — OpenTelemetry tracing, Prometheus metrics, structured logging

## System Diagram

```
                    ┌──────────────┐
                    │  API Gateway  │
                    │   (Port 8080) │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                 ▼
   ┌──────────┐    ┌──────────────┐    ┌──────────┐
   │ Auth     │    │ Domain       │    │ Infra    │
   │ Service  │    │ Services     │    │ Services │
   └──────────┘    │ (Order,      │    │ (Config, │
                   │  Payment,    │    │  Discovery│
                   │  Delivery...)│    │  etc.)   │
                   └──────────────┘    └──────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
              ┌──────────┐ ┌──────────┐
              │  Kafka   │ │  Redis   │
              │ (Events) │ │ (Cache)  │
              └──────────┘ └──────────┘
```

## Service Map

| Layer | Services |
|-------|----------|
| **Infrastructure** | Config Server, Discovery Server, API Gateway |
| **Identity** | Auth Service |
| **Customer Domain** | User Service, Cart Service, Checkout Service, Wishlist Service, Review Service |
| **Merchant Domain** | Merchant Service, Catalog Service, Inventory Service, Pricing Service, Promotion Service |
| **Order Domain** | Order Service, Payment Service, Wallet Service, Invoice Service |
| **Delivery Domain** | Delivery Service, Tracking Service |
| **Communication** | Notification Service, Support Service, CMS Service |
| **Intelligence** | Search Service, Recommendation Service, Analytics Service, Report Service |
| **Admin** | Admin Service, Finance Service, Settlement Service |
| **Operations** | Membership Service, Subscription Service, Loyalty Service |
| **Security** | Fraud Service, Audit Service, Scheduler Service |

## Technology Stack

- **Backend:** Java 21, Spring Boot 3.2, Spring Cloud 2023, Spring Security
- **Mobile:** Flutter 3.x (Dart)
- **Web:** Next.js 16 (React 19, MUI v9, Tailwind CSS 4)
- **Databases:** PostgreSQL 15, MongoDB 7, Redis 7
- **Messaging:** Kafka, RabbitMQ
- **Search:** Elasticsearch 8 / OpenSearch
- **Infrastructure:** Docker, Kubernetes, NGINX, GitHub Actions
- **Monitoring:** Prometheus, Grafana, OpenTelemetry, ELK Stack

## Engineering Rules

See [ENGINEERING_RULES.md](../ENGINEERING_RULES.md) for the complete set of engineering standards enforced across the entire repository.
