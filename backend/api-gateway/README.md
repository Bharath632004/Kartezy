# API Gateway

Centralized API gateway and edge service for Kartezy.

## Features
- Intelligent routing to backend services
- JWT token validation & propagation
- Rate limiting & throttling
- CORS configuration
- Security headers
- Request/response logging
- Circuit breaker (via Resilience4j)
- OWASP protection (SQLi, XSS, SSRF)
- Bot detection & mitigation
- API version routing

## Tech Stack
- Spring Cloud Gateway
- Spring Security + OAuth2 Resource Server
- Resilience4j
- Redis (rate limiting store)
- Micrometer + OpenTelemetry (observability)

## Routes

| Path | Target Service |
|------|---------------|
| `/api/v1/auth/**` | auth-service |
| `/api/v1/users/**` | user-service |
| `/api/v1/merchants/**` | merchant-service |
| `/api/v1/products/**` | catalog-service |
| `/api/v1/orders/**` | order-service |
| `/api/v1/payments/**` | payment-service |
| `/api/v1/delivery/**` | delivery-service |
| `/api/v1/cart/**` | cart-service |
| `/api/v1/notifications/**` | notification-service |
| `/api/v1/search/**` | search-service |
| `/api/v1/wallet/**` | wallet-service |

## Configuration
- `JWT_SECRET`: JWT validation secret
- `REDIS_HOST`: Redis host for rate limiting
- Gateway routes configured in `application.yml`
