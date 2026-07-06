# Kartezy

A modern, scalable food delivery platform inspired by Blinkit, Zepto, Instamart, Amazon Fresh, and Uber Eats.

## Repository Structure

```
Kartezy/
├── backend/                  # Backend services (Spring Boot microservices)
│   ├── api-gateway/          # API Gateway service
│   ├── config-server/        # Spring Cloud Config Server
│   ├── discovery-server/     # Service Discovery (Eureka)
│   ├── auth-service/         # Authentication and Authorization service
│   ├── user-service/         # User management service
│   ├── merchant-service/     # Merchant/restaurant management
│   ├── catalog-service/      # Product catalog service
│   ├── inventory-service/    # Inventory management
│   ├── order-service/        # Order processing
│   ├── payment-service/      # Payment processing
│   ├── delivery-service/     # Delivery management
│   ├── notification-service/ # Notification service (email, SMS, push)
│   ├── review-service/       # Review and rating service
│   ├── wallet-service/       # Wallet and payment methods
│   ├── analytics-service/    # Analytics and reporting
│   ├── recommendation-service/ # Recommendation engine
│   └── shared/               # Shared libraries and common utilities
├── apps/                     # Frontend applications
│   ├── customer-mobile/      # Customer mobile app (Flutter)
│   ├── merchant-mobile/      # Merchant mobile app (Flutter)
│   ├── delivery-mobile/      # Delivery personnel mobile app (Flutter)
│   ├── customer-web/         # Customer web app (React)
│   ├── merchant-web/         # Merchant web app (React)
│   ├── admin-dashboard/      # Admin dashboard (React)
│   └── landing-page/         # Landing page (React)
├── database/                 # Database schemas and migrations
├── devops/                   # DevOps and infrastructure
│   ├── docker/               # Dockerfiles
│   ├── kubernetes/           # Kubernetes manifests
│   ├── terraform/            # Terraform infrastructure as code
│   └── nginx/                # NGINX configurations
├── docs/                     # Documentation
├── infra/                    # Infrastructure scripts
├── scripts/                  # Utility scripts
└── .github/                  # GitHub workflows and issue templates
```

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Flutter 3.0+
- Docker and Docker Compose
- Kubernetes (for production)

### Backend Services

Each service is a standalone Spring Boot application. To build and run a service:

```bash
cd backend/service-name
./mvnw spring-boot:run
```

### Frontend Applications

#### React Apps

```bash
cd apps/app-name
npm install
npm start
```

#### Flutter Apps

```bash
cd apps/app-name
flutter pub get
flutter run
```

## Development Guidelines

- Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.
- Code must pass ESLint and Prettier checks for JavaScript/TypeScript.
- Java code must follow the Google Java Format style.
- All pull requests must pass the CI pipeline.

## License

This project is proprietary and confidential.

## Contact

For any inquiries, please contact [your-email@example.com].