# Kartezy Deployment Guide

## Architecture Overview

Kartezy is built as a **microservices architecture** with Spring Boot 3 backend services, Flutter mobile apps, Next.js web apps, and a Node.js AI platform.

### System Components

| Component | Technology | Description |
|-----------|-----------|-------------|
| **API Gateway** | Spring Cloud Gateway | Entry point for all API requests, authentication, routing |
| **Service Discovery** | Eureka | Service registration and discovery |
| **Config Server** | Spring Cloud Config | Centralized configuration management |
| **Business Services** | Spring Boot 3 | Auth, User, Merchant, Catalog, Order, Payment, etc. |
| **AI/ML Services** | Spring Boot 3 | NLP, Computer Vision, Forecasting, Recommendation, etc. |
| **AI Platform** | Node.js/TensorFlow.js | Centralized ML model management |
| **Mobile Apps** | Flutter | Customer, Merchant, Delivery Partner |
| **Web Apps** | Next.js | Admin Dashboard, Customer Website |
| **Databases** | PostgreSQL, MongoDB, Redis | Primary, Document, Cache |
| **Message Queue** | Kafka, RabbitMQ | Event streaming, async processing |
| **Search** | Elasticsearch | Full-text search and analytics |
| **Monitoring** | Prometheus, Grafana, Jaeger | Metrics, visualization, distributed tracing |

## Prerequisites

### Development
- JDK 21
- Docker & Docker Compose
- Node.js 20+
- Flutter 3.22+
- Maven 3.9+

### Production
- Kubernetes cluster (v1.28+)
- kubectl configured
- Helm 3+
- Ingress Controller (NGINX)
- Cert-Manager (for TLS)
- Container Registry (GHCR, Docker Hub, or ECR)

## Deployment Options

### Option 1: Docker Compose (Development/Staging)

```bash
# 1. Clone repository
git clone https://github.com/kartezy/kartezy.git
cd kartezy

# 2. Configure environment
cp devops/docker/.env.template devops/docker/.env
# Edit .env with your secrets

# 3. Start infra + services
cd devops/docker
docker compose up -d

# 4. Verify
curl http://localhost:8761/actuator/health  # Discovery Server
curl http://localhost:8080/actuator/health   # API Gateway
```

### Option 2: Kubernetes (Production)

```bash
# 1. Create namespace
kubectl apply -f devops/kubernetes/kartezy-namespace.yaml

# 2. Create secrets (using external secrets manager recommended)
kubectl apply -f devops/kubernetes/secrets.yaml

# 3. Deploy infrastructure
kubectl apply -f devops/kubernetes/infrastructure.yaml
kubectl apply -f devops/kubernetes/rbac.yaml

# 4. Deploy service infrastructure
kubectl apply -f devops/kubernetes/service-infrastructure.yaml

# 5. Deploy business services
kubectl apply -f devops/kubernetes/business-services.yaml

# 6. Deploy AI services
kubectl apply -f devops/kubernetes/ai-services.yaml

# 7. Deploy monitoring
kubectl apply -f devops/kubernetes/monitoring.yaml

# 8. Deploy ingress and autoscaling
kubectl apply -f devops/kubernetes/ingress.yaml
kubectl apply -f devops/kubernetes/hpa.yaml
kubectl apply -f devops/kubernetes/network-policies.yaml
kubectl apply -f devops/kubernetes/pod-disruption-budgets.yaml

# 9. Verify deployment
kubectl -n kartezy get pods
kubectl -n kartezy get svc
kubectl -n kartezy get hpa
```

## Building Microservices

### Backend Services (Maven)

```bash
cd backend

# Build all services
mvn clean package -DskipTests

# Build a specific service
mvn clean package -pl order-service -am -DskipTests

# Run tests
mvn clean verify

# Run a specific service
java -jar order-service/target/order-service-*.jar
```

### Docker Images

```bash
# Build all backend images
for service in api-gateway auth-service user-service merchant-service catalog-service inventory-service order-service payment-service delivery-service notification-service wallet-service review-service recommendation-service analytics-service fraud-detection-service forecasting-service chatbot-service computer-vision-service nlp-service ocr-service voice-service ai-service config-server discovery-server; do
    docker build -f backend/$service/Dockerfile -t kartezy/$service:latest backend/
done

# Build web apps
docker build -f apps/admin-dashboard/Dockerfile -t kartezy/admin-dashboard:latest apps/admin-dashboard/
docker build -f apps/kartezy-website/Dockerfile -t kartezy/kartezy-website:latest apps/kartezy-website/
```

### Flutter Apps

```bash
cd apps/customer-mobile
flutter pub get
flutter analyze
flutter test
flutter build apk --release

# iOS
flutter build ios --release
```

## CI/CD Pipeline

The project uses GitHub Actions for CI/CD:

- **Backend CI/CD**: Builds, tests, and publishes backend services
- **Flutter CI**: Builds and tests mobile apps
- **Security Scan**: Trivy, OWASP Dependency Check, Gitleaks
- **Docker Build**: Multi-architecture images to GHCR
- **Deploy**: Automated Kubernetes deployment
- **Release**: Automatic release creation on version tags

View workflows in `.github/workflows/ci-cd.yml`

## Environment Variables

### Required Secrets

| Variable | Description | Source |
|----------|-------------|--------|
| `POSTGRES_PASSWORD` | PostgreSQL password | Generate random (32+ chars) |
| `MONGODB_PASSWORD` | MongoDB password | Generate random (32+ chars) |
| `JWT_SECRET` | JWT signing key | `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | JWT refresh key | `openssl rand -base64 32` |
| `RABBITMQ_PASSWORD` | RabbitMQ password | Generate random |
| `ELASTICSEARCH_PASSWORD` | Elasticsearch password | Generate random |

### Optional Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_PROFILES` | `prod` | Active Spring profile |
| `JWT_EXPIRATION` | `86400000` | JWT expiry (ms, 24h) |
| `JWT_REFRESH_EXPIRATION` | `604800000` | Refresh token expiry (ms, 7d) |
| `NGINX_HOST` | `localhost` | Nginx server name |

## Database Migrations

The project uses Flyway for PostgreSQL migrations:

```bash
# Migration files location
backend/shared/src/main/resources/db/migration/

# Apply migrations (auto-applied on service startup)
```

Current migration: `V1__initial_schema.sql`

## Monitoring & Observability

### Prometheus Metrics

All Spring Boot services expose metrics at `/actuator/prometheus`.

### Grafana Dashboards

Access Grafana at `http://grafana:3000` (default credentials in secrets).

### Distributed Tracing (Jaeger)

Access Jaeger UI at `http://jaeger:16686`.

Service-to-service tracing is enabled via OpenTelemetry.

## Backup & Disaster Recovery

### Automated Backup

```bash
# Full database backup
./scripts/backup-database.sh

# With custom directory
./scripts/backup-database.sh /mnt/backups/kartezy
```

### Restore

```bash
# List available backups
ls -la ./backups/

# Restore specific backup
./scripts/restore-database.sh 20240101_120000
```

## Scaling

### Horizontal Scaling

- **HPA configured**: CPU-based autoscaling for all services
- **API Gateway**: `minReplicas: 2, maxReplicas: 10`
- **Order Service**: `minReplicas: 2, maxReplicas: 10`
- **Auth Service**: `minReplicas: 2, maxReplicas: 8`

### Multi-Region Deployment

For multi-city/state/country deployment:

1. Deploy core services in each region
2. Use global PostgreSQL read replicas
3. Configure CDN for static assets
4. Set up global load balancer (AWS Global Accelerator / Cloudflare)

## Security

- **JWT Authentication**: Access and refresh token pattern
- **RBAC**: Role-based access control
- **Network Policies**: Kubernetes network isolation
- **TLS**: End-to-end encryption
- **Rate Limiting**: Nginx + API Gateway
- **Secrets**: External secrets manager (AWS Secrets Manager / HashiCorp Vault)
- **OWASP**: CSRF, XSS, SQL injection protection

## Troubleshooting

### Common Issues

1. **Service won't start**: Check Config Server and Discovery Server are healthy first
2. **Database connection refused**: Verify credentials and network policies
3. **Kafka not connecting**: Check broker listeners and advertised listeners
4. **Elasticsearch out of memory**: Adjust `ES_JAVA_OPTS` in environment

### Health Check Endpoints

```bash
# Per-service health
curl http://<service>:<port>/actuator/health

# Liveness
curl http://<service>:<port>/actuator/health/liveness

# Readiness
curl http://<service>:<port>/actuator/health/readiness
```

## Performance Tuning

### JVM Settings

```bash
# Default (in Docker)
JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# For high-throughput services
JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:MaxGCPauseMillis=100"
```

### Connection Pools

Configured via Spring Boot:
- HikariCP: max 20 connections per service
- Redis: timeout 60s
- Elasticsearch: connection timeout 5s, socket timeout 60s
