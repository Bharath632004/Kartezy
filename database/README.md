# Kartezy Database Infrastructure

All database, cache, queue, and search infrastructure configuration for the Kartezy platform.

## Subsystems

| System | Purpose | Status |
|--------|---------|--------|
| `postgres/` | Primary relational database (PostgreSQL 15) | ✅ Configured |
| `mongodb/` | Document store for orders, products, reviews | ✅ Configured |
| `redis/` | Caching and session management (Redis 7) | 📋 Planned |
| `kafka/` | Event streaming and async communication | 📋 Planned |
| `rabbitmq/` | Message queuing for task distribution | 📋 Planned |
| `opensearch/` | Full-text search and analytics (OpenSearch) | 📋 Planned |
| `object-storage/` | File/image storage (S3-compatible) | 📋 Planned |

## Configuration Guidelines

- All database containers use health checks in Docker Compose
- Connection strings are managed via environment variables
- Migrations use Flyway (PostgreSQL) and manual scripts (MongoDB)
- Production databases use connection pooling (PgBouncer for PostgreSQL)
