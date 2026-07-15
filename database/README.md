# Database

This directory contains database schemas, migrations, and seed data for the Kartezy platform.

## Structure

```
database/
├── postgres/        # PostgreSQL migrations and schemas
├── mongodb/         # MongoDB schemas and seed data
└── README.md
```

## PostgreSQL Migrations

PostgreSQL migrations are managed via Flyway and stored in each backend service's resources directory or centrally here.

## MongoDB

MongoDB schemas and indexes are documented in the `mongodb/` directory.

## Conventions

- Migration scripts should be idempotent
- Use `V{version}__{description}.sql` naming for Flyway migrations
- Document any breaking schema changes
