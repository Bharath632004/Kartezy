# Folder Structure

This document details the folder structure of the Kartezy monorepo.

## Backend

```
backend/
├── api-gateway/          # API Gateway service
├── config-server/        # Spring Cloud Config Server
├── discovery-server/     # Service Discovery (Eureka)
├── auth-service/         # Authentication and Authorization
├── user-service/         # User management
├── merchant-service/     # Merchant/restaurant management
├── catalog-service/      # Product catalog
├── inventory-service/    # Inventory management
├── order-service/        # Order processing
├── payment-service/      # Payment processing
├── delivery-service/     # Delivery management
├── notification-service/ # Notifications (email, SMS, push)
├── review-service/       # Reviews and ratings
├── wallet-service/       # Wallet and payment methods
├── analytics-service/    # Analytics and reporting
├── recommendation-service/ # Recommendation engine
└── shared/               # Shared libraries and common utilities
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
└── Dockerfile (located in devops/docker/service-name/)
```

## Frontend

### React Applications

```
apps/
├── customer-web/         # Customer web application
├── merchant-web/         # Merchant web application
├── admin-dashboard/      # Admin dashboard
└── landing-page/         # Public landing page
```

Each React application follows the standard Create React App structure:

```
app-name/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.js
│   └── index.js
├── package.json
└── Dockerfile (located in devops/docker/app-name/)
```

### Flutter Applications

```
apps/
├── customer-mobile/      # Customer mobile application
├── merchant-mobile/      # Merchant mobile application
└── delivery-mobile/      # Delivery personnel mobile application
```

Each Flutter application follows the standard Flutter project structure:

```
app-name/
├── lib/
│   └── main.dart
├── android/
├── ios/
├── pubspec.yaml
└── Dockerfile (located in devops/docker/app-name/)
```

## DevOps

```
devops/
├── docker/               # Dockerfiles for each service and application
├── kubernetes/           # Kubernetes manifests
├── terraform/            # Terraform infrastructure as code
└── nginx/                # NGINX configuration and Dockerfile
```

## Other Directories

- `database/`: Contains SQL scripts for database schema and migrations.
- `docs/`: Documentation files.
- `infra/`: Infrastructure scripts and configurations.
- `scripts/`: Utility scripts for development, testing, and deployment.
- `.github/`: GitHub-specific configurations (workflows, issue templates, PR templates).

## Navigation Tips

- Each service and application has its own `README.md` with specific instructions.
- Use the scripts in the `scripts/` directory for common tasks.
- Refer to the [Development Guide](./development-guide.md) for setting up your development environment.