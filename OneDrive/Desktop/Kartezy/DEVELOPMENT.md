# Development Guide

## Prerequisites

- **Java 21** (OpenJDK or Oracle JDK)
- **Node.js 20+** with npm
- **Dart SDK 3.x** with Flutter Stable
- **Docker Desktop** with Docker Compose v2
- **PostgreSQL 15** (or use Docker)
- **Redis 7** (or use Docker)

## Getting Started

### 1. Infrastructure Services

```bash
cd devops/docker
docker compose up -d postgres redis mongodb kafka elasticsearch
```

### 2. Backend Services

```bash
cd backend

# Build all services
./mvnw clean install -DskipTests

# Start core infrastructure
./mvnw spring-boot:run -pl discovery-server &
./mvnw spring-boot:run -pl config-server &

# Start API Gateway
./mvnw spring-boot:run -pl api-gateway &

# Start business services (in any order)
./mvnw spring-boot:run -pl auth-service &
./mvnw spring-boot:run -pl user-service &
./mvnw spring-boot:run -pl catalog-service &
./mvnw spring-boot:run -pl inventory-service &
./mvnw spring-boot:run -pl order-service &
./mvnw spring-boot:run -pl merchant-service &
./mvnw spring-boot:run -pl payment-service &
./mvnw spring-boot:run -pl delivery-service &
./mvnw spring-boot:run -pl notification-service &
./mvnw spring-boot:run -pl review-service &
./mvnw spring-boot:run -pl wallet-service &
```

### 3. Frontend Applications

```bash
# Customer Website
cd apps/kartezy-website
npm install
npm run dev

# Admin Dashboard
cd apps/admin-dashboard
npm install
npm run dev

# Flutter apps (choose one)
cd apps/customer-mobile
flutter pub get
flutter run

cd apps/merchant-mobile
flutter pub get
flutter run
```

## Project Structure

```
kartezy/
├── backend/           # Spring Boot microservices (23 services)
├── apps/              # Frontend applications
│   ├── customer-mobile/    # Flutter
│   ├── merchant-mobile/    # Flutter
│   ├── delivery-app/      # Flutter
│   ├── admin-dashboard/   # Next.js
│   └── website/           # Next.js
├── devops/            # Docker, Kubernetes, NGINX
├── database/          # SQL schemas and migrations
└── docs/              # Architecture and design docs
```

## Coding Standards

See `CODING_STANDARDS.md` for detailed coding guidelines.

## Testing

```bash
# Backend tests
cd backend
./mvnw test

# Flutter tests
cd apps/customer-mobile
flutter test

# Next.js lint
cd apps/admin-dashboard
npm run lint
```

## Commit Guidelines

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring
- `docs:` Documentation changes
- `chore:` Maintenance tasks
