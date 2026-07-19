# Finance & ERP Service

Comprehensive Finance and ERP Platform for Kartezy, built with Spring Boot 3.2 and Java 21.

## Architecture

The finance-service is a microservice in the Kartezy platform that handles all financial operations:

- **19 ERP Modules** covering complete financial management
- **Double-entry Accounting** with immutable audit trail
- **Event-driven Architecture** via Kafka for Payment & Wallet service sync
- **Multi-bank Support** with automated reconciliation
- **Commission Engine** with configurable rules
- **GST & Tax Management** for Indian compliance

## Modules

| Module | API Base Path | Description |
|--------|--------------|-------------|
| Accounting | `/api/finance/accounting` | Chart of Accounts, Journal Entries, Ledger |
| Settlements | `/api/finance/settlements` | Merchant settlement processing |
| Invoices | `/api/finance/invoices` | Invoice management and payments |
| Vendors | `/api/finance/vendors` | Vendor management |
| Suppliers | `/api/finance/suppliers` | Supplier management |
| Purchase Orders | `/api/finance/purchase-orders` | Purchase order lifecycle |
| GST | `/api/finance/taxes/gst` | GST returns and input credit |
| Taxes | `/api/finance/taxes` | TDS and other tax management |
| Commissions | `/api/finance/commissions` | Commission engine and rules |
| Revenue | `/api/finance/revenue` | Revenue tracking |
| Reports | `/api/finance/reports` | P&L, Balance Sheet, Cash Flow |
| Banks | `/api/finance/banks` | Multi-bank account management |
| Reconciliation | `/api/finance/banks/reconcile` | Payment reconciliation |
| Wallet Accounting | `/api/finance/wallet-accounting` | Wallet transaction tracking |
| Refunds | `/api/finance/refunds` | Refund processing |
| Audit Trail | `/api/finance/audit` | Comprehensive audit logging |

## Tech Stack

- **Java 21** with Spring Boot 3.2.12
- **PostgreSQL 16** with Flyway migrations
- **Apache Kafka** for event-driven integration
- **Spring Cloud** (Eureka, OpenFeign, Config)
- **Redis** for caching
- **Spring Security** with OAuth2 / JWT
- **SpringDoc OpenAPI** for API documentation
- **JUnit 5 + Mockito** for testing

## Quick Start

### Prerequisites
- JDK 21+
- Docker & Docker Compose
- Maven 3.9+

### Local Development

```bash
# Start dependencies (PostgreSQL, Kafka, Redis)
cd deploy/docker
docker-compose up -d postgres kafka redis zookeeper

# Build and run
cd ../../backend
mvn clean install -pl shared -DskipTests
mvn spring-boot:run -pl finance-service
```

### Using Docker Compose (full stack)

```bash
cd deploy/docker
docker-compose up -d
```

### API Documentation

Once running, access Swagger UI at:
```
http://localhost:8096/api/finance/swagger-ui.html
```

## Testing

```bash
cd backend
mvn test -pl finance-service
```

## Configuration

Key environment variables:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` - PostgreSQL
- `KAFKA_BOOTSTRAP_SERVERS` - Kafka connection
- `EUREKA_URI` - Service discovery
- `JWT_ISSUER_URI`, `JWT_JWK_URI` - OAuth2 settings

## Deployment

See `deploy/kubernetes/finance-service.yaml` for Kubernetes manifests.
