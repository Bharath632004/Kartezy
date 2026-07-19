# Kartezy

An AI-powered Hyperlocal Quick Commerce Marketplace connecting nearby local merchants with nearby customers for instant and scheduled deliveries. Inspired by Blinkit, Zepto, Swiggy Instamart, BigBasket Now, Flipkart Minutes, and Amazon Fresh.

## Repository Structure

```
Kartezy/
├── backend/                  # Backend services (Spring Boot 3 microservices)
│   ├── api-gateway/          # API Gateway (Spring Cloud Gateway)
│   ├── config-server/        # Spring Cloud Config Server
│   ├── discovery-server/     # Service Discovery (Eureka)
│   ├── auth-service/         # Authentication & Authorization
│   ├── user-service/         # User management
│   ├── merchant-service/     # Merchant onboarding & management
│   ├── catalog-service/      # Product catalog & category management
│   ├── inventory-service/    # Real-time inventory tracking
│   ├── order-service/        # Order processing & lifecycle
│   ├── payment-service/      # Payment processing & reconciliation
│   ├── delivery-service/     # Delivery assignment & tracking
│   ├── notification-service/ # Email, SMS, push notifications
│   ├── review-service/       # Product & merchant reviews
│   ├── wallet-service/       # Digital wallet & transactions
│   ├── analytics-service/    # Analytics & reporting
│   ├── recommendation-service/ # ML-driven recommendations
│   ├── fraud-detection-service/ # Real-time fraud prevention
│   ├── forecasting-service/  # Demand & inventory forecasting
│   ├── chatbot-service/      # AI-powered customer support
│   ├── computer-vision-service/ # Image recognition for catalog
│   ├── nlp-service/          # Natural language search
│   ├── ocr-service/          # OCR for documents & bills
│   ├── voice-service/        # Voice-based shopping assistant
│   ├── ai-service/           # Unified AI/ML platform
│   └── shared/               # Shared libraries & common utilities
├── apps/                     # Frontend applications
│   ├── customer-mobile/      # Customer mobile app (Flutter)
│   ├── merchant-mobile/      # Merchant mobile app (Flutter)
│   ├── delivery-mobile/      # Delivery partner app (Flutter)
│   ├── kartezy-website/      # Customer website (Next.js)
│   └── admin-dashboard/      # Enterprise admin dashboard (Next.js)
├── database/                 # Database schemas & migrations
├── devops/                   # DevOps & infrastructure
│   ├── docker/               # Docker Compose & Dockerfiles
│   ├── kubernetes/           # Kubernetes manifests
│   └── nginx/                # NGINX reverse proxy configs
├── config-repo/              # Spring Cloud Config repository
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
└── .github/                  # GitHub workflows & templates
```

## Platform Overview

Kartezy is built for **Hyperlocal Quick Commerce** — connecting customers with nearby merchants for:

- **Groceries & Essentials**: Kirana stores, supermarkets, F&V, dairy, bakery
- **Health & Wellness**: Pharmacies, medical stores, organic stores
- **Lifestyle & Electronics**: Mobile stores, electronics, fashion, cosmetics
- **Home & Daily Needs**: Hardware, stationery, pet supplies, baby products
- **Gifts & Flowers**: Local flower shops, gift shops, home essentials

### Key Differentiators

- **Multi-Merchant Marketplace**: Customers can order from multiple local merchants in a single transaction
- **AI-Powered Everything**: Demand forecasting, personalized recommendations, dynamic pricing, fraud detection
- **Real-Time Inventory**: Live stock tracking across all merchant locations
- **Instant & Scheduled Delivery**: Choose delivery windows from 10 minutes to 24 hours
- **Enterprise Ready**: Built for scale with microservices, event-driven architecture, and cloud-native deployment

### Merchant Categories

| Category | Examples |
|----------|----------|
| Kirana & Grocery | Local kirana stores, grocery shops, supermarkets |
| Fruits & Vegetables | Fresh produce vendors, organic stores |
| Dairy & Bakery | Milk booths, dairy stores, bakeries |
| Pharmacy | Medical stores, chemist shops |
| Electronics | Mobile stores, electronics shops |
| Fashion | Clothing stores, cosmetic shops |
| Home & Stationery | Hardware stores, stationery shops |
| Gifts & Flowers | Flower shops, gift shops |
| Baby & Pet | Baby products, pet stores |

## Technology Stack

### Backend

| Component | Technology |
|-----------|-----------|
| Language | Java 21 |
| Framework | Spring Boot 3.2 |
| Cloud | Spring Cloud 2023.0 |
| API Gateway | Spring Cloud Gateway |
| Service Discovery | Netflix Eureka |
| Config Management | Spring Cloud Config |
| Database (Relational) | PostgreSQL 15 |
| Database (NoSQL) | MongoDB 7 |
| Cache | Redis 7 |
| Message Queue | RabbitMQ 3.13, Kafka 7.6 |
| Search | Elasticsearch 8.14 |
| AI/ML | Spring AI, OpenAI, TensorFlow |
| Documentation | OpenAPI 3 / SpringDoc |

### Frontend - Mobile

| Component | Technology |
|-----------|-----------|
| Framework | Flutter (Stable) |
| Language | Dart 3.x |
| State Management | Riverpod |
| Navigation | GoRouter |
| Networking | Dio |
| Local Storage | Hive, Flutter Secure Storage |
| Maps | Google Maps Flutter |

### Frontend - Web

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 16 |
| Language | TypeScript 5.x |
| UI Library | Material-UI 9 + Tailwind CSS 4 |
| State Management | Zustand |
| Data Fetching | TanStack Query |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |

### Infrastructure

| Component | Technology |
|-----------|-----------|
| Containerization | Docker & Docker Compose |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |
| Logging | ELK Stack |

## Getting Started

### Prerequisites

- **Java**: 21 (OpenJDK or Oracle JDK)
- **Node.js**: 20 LTS or higher
- **Flutter**: Stable channel (Dart 3.x)
- **Docker**: 24+ & Docker Compose v2
- **Git**: 2.30+

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/kartezy.git
cd kartezy

# 2. Copy environment template and configure
cp .env.example .env

# 3. Start infrastructure services
cd devops/docker
docker compose up -d postgres redis mongodb kafka

# 4. Start backend services
cd ../../backend
./mvnw clean install -DskipTests
./mvnw spring-boot:run -pl discovery-server & ./mvnw spring-boot:run -pl config-server & ./mvnw spring-boot:run -pl api-gateway &

# 5. Start frontend applications
cd apps/kartezy-website
npm install
npm run dev
```

### Environment Configuration

```env
POSTGRES_PASSWORD=<your_password>
MONGODB_PASSWORD=<your_password>
JWT_SECRET=<your_base64_256bit_secret>
JWT_EXPIRATION=86400000
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Documentation

- [Architecture Guide](docs/architecture-guide.md)
- [Development Guide](docs/development-guide.md)
- [Folder Structure](docs/folder-structure.md)
- [Coding Standards](docs/coding-standards.md)
- [Contributing Guide](.github/CONTRIBUTING.md)

## Contributing

Please read our [Contributing Guidelines](.github/CONTRIBUTING.md) for details.

## Security

- Report vulnerabilities to security@kartezy.com
- See our [Security Policy](.github/SECURITY.md) for details

## License

Proprietary. All rights reserved.

---

*Kartezy — Your Neighborhood, Delivered.*