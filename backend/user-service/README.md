# User Service

Customer profile and account management service.

## Features
- User profiles (CRUD)
- Address management
- Payment methods
- Preferences & settings
- Search history
- Account deletion & data export
- Wishlist integration

## Tech Stack
- PostgreSQL (primary)
- Redis (cache for profile lookups)
- Kafka (user events)

## API
`/api/v1/users/*` — All endpoints

## Configuration
- `DB_URL`: PostgreSQL connection
- `JWT_SECRET`: JWT validation secret
