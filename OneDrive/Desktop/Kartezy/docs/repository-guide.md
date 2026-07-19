# Repository Guide

This document provides an overview of the Kartezy monorepo structure and how to navigate it.

## Repository Overview

The repository is organized as a monorepo with the following top-level directories:

| Directory | Purpose |
|-----------|---------|
| `backend/` | 24 Spring Boot microservices (Java 21) |
| `apps/` | 5 frontend applications (2 Next.js, 3 Flutter) |
| `database/` | Database schemas and migration scripts |
| `config-repo/` | Externalized configuration for Spring Cloud Config |
| `devops/` | Docker, Kubernetes, and NGINX configurations |
| `docs/` | Documentation |
| `infra/` | Infrastructure scripts and configurations |
| `scripts/` | Utility scripts for development and deployment |
| `.github/` | GitHub workflows, issue templates, PR templates |

## Key Architecture Decisions

1. **Microservices**: Each backend service is independently deployable with its own database schema
2. **Feature-First**: Flutter apps organize code by business feature
3. **App Router**: Next.js apps use the App Router for server components and routing
4. **Externalized Config**: All configuration is managed via Spring Cloud Config
5. **Event-Driven**: Services communicate via Kafka and RabbitMQ for async operations
6. **API Gateway**: All external traffic routes through Spring Cloud Gateway
7. **Service Discovery**: Eureka handles service registration and discovery

## Getting Started

To get started with development, please refer to the [Development Guide](./development-guide.md).

## Contributing

Please read our [Contributing Guidelines](../.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is proprietary and confidential.