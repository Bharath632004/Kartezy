# Config Server

Centralized configuration server for all Kartezy microservices.

## Features
- Externalized configuration management
- Git-backed configuration repository
- Environment-specific configs (dev, prod, k8s)
- Configuration refresh without restart
- Encryption support for secrets
- Health monitoring

## Tech Stack
- Spring Cloud Config Server
- Git (config backend)

## Configuration Sources
Configurations served from: `src/main/resources/config/` directory

| Service | Config File |
|---------|------------|
| auth-service | `config/auth-service.yml` |
| cart-service | `config/cart-service.yml` |
| catalog-service | `config/catalog-service.yml` |
| delivery-service | `config/delivery-service.yml` |
| inventory-service | `config/inventory-service.yml` |
| merchant-service | `config/merchant-service.yml` |
| notification-service | `config/notification-service.yml` |
| order-service | `config/order-service.yml` |
| payment-service | `config/payment-service.yml` |
| user-service | `config/user-service.yml` |
| wallet-service | `config/wallet-service.yml` |

## Running
```bash
cd backend
mvn spring-boot:run -pl config-server
```

## Port
- Server: 8888
