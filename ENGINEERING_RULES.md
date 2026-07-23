# Kartezy Engineering Rules

## Compilation & Startup

- **Every application must compile independently.** Each Flutter app, Next.js app, and backend microservice must pass its own build without depending on another app's build artifacts.
- **Every microservice must start independently.** Each Spring Boot service must start with its own embedded server and not require another service to be running (except Config Server + Discovery Server for full functionality).

## Module Requirements

Every module (backend service, app, website, library) must contain:

1. **README.md** — Purpose, architecture overview, setup instructions, and API documentation
2. **Configuration** — All environment variables documented in a configuration file or README
3. **Tests** — Unit tests, integration tests, or widget tests as appropriate
4. **Documentation** — Inline code documentation and architecture decision records (ADRs)
5. **Health Endpoint** — `GET /health` endpoint returning service status and dependencies
6. **Logging** — Structured logging with correlation IDs (traceId, spanId, requestId)
7. **Monitoring** — Metrics endpoint exposing Prometheus-compatible metrics
8. **Error Handling** — Global exception handler returning consistent error responses
9. **Validation** — Input validation on all API endpoints and user inputs

## Dependency Rules

- **Shared modules must never depend on applications.** (No circular imports from `shared/` into `apps/`.)
- **Applications depend on shared modules.** (Apps import from `shared/` but not vice versa.)
- **Backend services communicate only through:**
  - **REST** — Synchronous HTTP calls via Feign clients
  - **Kafka** — Asynchronous event-driven communication
  - **RabbitMQ** — Work queue and message distribution
  - **Never create circular dependencies.** Service A may call Service B, but Service B must not call Service A.

## Naming Conventions

- **Directories**: `kebab-case` (e.g., `auth-service`, `customer-mobile`, `api-gateway`)
- **Java packages**: `com.kartezy.<service>` (lowercase, no hyphens: `com.kartezy.authservice`)
- **Flutter features**: `snake_case` (e.g., `order_management`, `delivery_onboarding`)
- **Docker images**: `kartezy/<service>:<version>` (e.g., `kartezy/auth-service:1.0.0`)
- **Environment variables**: `UPPER_SNAKE_CASE` with `KARTEZY_` prefix where needed

## Repository Structure

```
kartezy/
├── backend/       # Java Spring Boot microservices
├── apps/          # Native mobile apps + admin dashboard
├── websites/      # Web-based portals and marketing sites
├── shared/        # Cross-platform shared libraries
├── ai-platform/   # AI/ML models and services
├── infrastructure/# IaC and platform configuration
├── database/      # Database configs, schemas, migrations
├── devops/        # CI/CD, Docker, K8s, monitoring
├── docs/          # Documentation (architecture, API, runbooks)
├── scripts/       # Automation scripts and generators
├── tools/         # Developer tooling and utilities
└── .github/       # GitHub workflows, templates, configs
```

## Dependency Direction

```
apps/ ────→ shared/ (never the other direction)
           ↓
websites/ ─→ shared/ (never the other direction)
           ↓
backend/ ←→ backend/shared/ (via Maven dependency)
           ↓
Backend services communicate via: REST / Feign / Kafka / RabbitMQ
Never create circular service dependencies.
```

## Enforcement

- CI/CD pipelines MUST include build verification for all modules
- ArchUnit tests SHOULD verify package dependency rules
- PR reviews MUST check for circular dependency violations
- Dependabot/Renovate SHOULD monitor for outdated dependencies
