# Merchant Service

Merchant and store management service.

## Features
- Merchant registration & KYC verification
- Store management (CRUD)
- Business hours configuration
- Store followers
- Merchant analytics
- Commission configuration

## Tech Stack
- PostgreSQL

## API
`/api/v1/merchants/*` — Merchant endpoints  
`/api/v1/stores/*` — Store endpoints

## Configuration
- `DB_URL`: PostgreSQL connection
- `JWT_SECRET`: JWT validation secret
