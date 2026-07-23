# Database Schema Documentation

Schema definitions for all Kartezy databases.

## PostgreSQL Schemas
- `public` — Core application tables (users, orders, products, payments, etc.)
- `audit` — Audit log tables
- `analytics` — Aggregated analytics tables

## MongoDB Collections
- `orders` — Order documents with embedded items
- `products` — Product catalog with variants
- `reviews` — Product reviews and ratings
- `notifications` — User notification history

## Flyway Migrations
Database migrations are managed with Flyway:
- Location: `backend/shared/src/main/resources/db/migration/`
- Naming: `V<version>__<description>.sql`
- Profile: `V1__initial_schema.sql`, `V2__audit_logging.sql`
