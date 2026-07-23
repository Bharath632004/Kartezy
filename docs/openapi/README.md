# OpenAPI / Swagger Specifications

Centralized OpenAPI 3.0 specification files for Kartezy platform APIs.

## Files
- `openapi.yaml` — Composite OpenAPI spec (all services aggregated)
- `auth-service.yaml` — Authentication and authorization APIs
- `user-service.yaml` — User management APIs
- `order-service.yaml` — Order lifecycle APIs
- `payment-service.yaml` — Payment processing APIs
- `delivery-service.yaml` — Delivery management APIs

## Generation
OpenAPI specs are auto-generated via `springdoc-openapi` and available at:
- Development: `http://localhost:<port>/v3/api-docs`
- Production: Swagger UI at `https://api.kartezy.com/swagger-ui.html`
