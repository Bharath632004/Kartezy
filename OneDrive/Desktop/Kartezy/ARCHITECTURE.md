# Kartezy Platform Architecture

## Overview
Kartezy is an AI-powered Hyperlocal Quick Commerce Platform connecting customers with local merchants for instant and scheduled deliveries of groceries, essentials, and local retail products.

## System Architecture

### Backend (Spring Boot Microservices)
- **API Gateway**: Spring Cloud Gateway - single entry point for all client requests
- **Service Discovery**: Netflix Eureka - dynamic service registration and discovery
- **Config Server**: Spring Cloud Config - centralized configuration management
- **Auth Service**: JWT-based authentication with OTP, OAuth2, and RBAC
- **Business Services**: Modular microservices for each domain

### Frontend
- **Customer Mobile**: Flutter app with Riverpod state management
- **Merchant Mobile**: Flutter app for store management
- **Delivery App**: Flutter app for delivery partners
- **Admin Dashboard**: Next.js with Material-UI
- **Website**: Next.js customer-facing website

### Data Layer
- **PostgreSQL**: Primary relational database (per-service schema)
- **Redis**: Caching and session management
- **Elasticsearch**: Product and order search
- **RabbitMQ/Kafka**: Event-driven messaging

## Microservices

| Service | Port | Description |
|---------|------|-------------|
| api-gateway | 8080 | API Gateway |
| discovery-server | 8761 | Eureka Service Discovery |
| config-server | 8888 | Spring Cloud Config |
| auth-service | 8081 | Authentication & Authorization |
| user-service | 8082 | User management |
| catalog-service | 8083 | Product catalog |
| inventory-service | 8084 | Inventory management |
| order-service | 8085 | Order processing |
| merchant-service | 8086 | Merchant management |
| delivery-service | 8091 | Delivery management |
| payment-service | 8092 | Payment processing |
| notification-service | 8093 | Notifications |
| review-service | 8094 | Reviews & ratings |
| wallet-service | 8095 | Wallet management |

## Technology Stack

- **Java 21** with Spring Boot 3.2
- **Flutter** with Dart 3.x
- **Next.js 16** with TypeScript
- **PostgreSQL**, **Redis**, **Elasticsearch**
- **Docker** & **Kubernetes**
- **Apache Kafka** & **RabbitMQ**
