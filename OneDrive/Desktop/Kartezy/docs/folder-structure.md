# Folder Structure

This document details the folder structure of the Kartezy monorepo.

## Backend

```
backend/
├── api-gateway/                # API Gateway (Spring Cloud Gateway)
├── config-server/              # Spring Cloud Config Server
├── discovery-server/           # Service Discovery (Eureka)
├── auth-service/               # Authentication and Authorization
├── user-service/               # User management
├── merchant-service/           # Merchant onboarding & management
├── catalog-service/            # Product catalog & categories
├── inventory-service/          # Real-time inventory tracking
├── order-service/              # Order processing & lifecycle
├── payment-service/            # Payment processing & reconciliation
├── delivery-service/           # Delivery assignment & tracking
├── notification-service/       # Email, SMS, push notifications
├── review-service/             # Product & merchant reviews
├── wallet-service/             # Digital wallet & transactions
├── analytics-service/          # Analytics & reporting
├── recommendation-service/     # ML-driven recommendations
├── fraud-detection-service/    # Real-time fraud prevention
├── forecasting-service/        # Demand & inventory forecasting
├── chatbot-service/            # AI-powered customer support
├── computer-vision-service/    # Image recognition
├── nlp-service/                # Natural language search
├── ocr-service/                # OCR for documents
├── voice-service/              # Voice shopping assistant
├── ai-service/                 # Unified AI/ML platform
└── shared/                     # Shared libraries & common utilities
```

Each backend service follows the standard Maven directory structure:

```
service-name/
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
│       ├── java/
│       └── resources/
├── pom.xml
└── Dockerfile
```

## Frontend

### Next.js Applications

```
apps/
├── kartezy-website/      # Customer-facing website
└── admin-dashboard/       # Enterprise admin dashboard
```

Each Next.js application follows:

```
app-name/
├── src/
│   ├── app/              # App Router pages & layouts
│   ├── components/       # Shared components
│   ├── lib/              # Utilities & API clients
│   ├── store/            # State management
│   └── theme/            # Theme configuration
├── public/                # Static assets
├── package.json
└── next.config.ts
```

### Flutter Applications

```
apps/
├── customer-mobile/      # Customer mobile application
├── merchant-mobile/      # Merchant mobile application
└── delivery-mobile/      # Delivery partner application
```

Each Flutter application follows feature-first architecture:

```
app-name/
├── lib/
│   ├── features/         # Feature modules
│   │   └── feature-name/
│   │       ├── data/     # Data layer (repositories, DTOs)
│   │       ├── domain/   # Domain layer (entities, usecases)
│   │       └── presentation/ # UI layer (pages, widgets, providers)
│   ├── core/             # Core utilities, constants, themes
│   ├── navigation/       # Route definitions
│   └── main.dart
├── android/
├── ios/
├── pubspec.yaml
└── test/
```

## DevOps

```
devops/
├── docker/               # Docker Compose & environment templates
├── kubernetes/           # Kubernetes manifests
└── nginx/                # NGINX configuration & Dockerfile
```

## Configuration

```
config-repo/              # Spring Cloud Config external configurations
  ├── application.yml
  ├── auth-service.yml
  ├── catalog-service.yml
  └── ...
```

## Other Directories

- `database/`: Contains SQL migration scripts for schema and data.
- `docs/`: Documentation files.
- `infra/`: Infrastructure scripts and configurations.
- `scripts/`: Utility scripts for development and deployment.
- `.github/`: GitHub workflows, issue templates, PR templates.

## Navigation Tips

- Each service and application has its own self-contained structure.
- Use the scripts in `scripts/` directory for common tasks.
- Refer to the [Development Guide](./development-guide.md) for environment setup.