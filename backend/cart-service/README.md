# Cart Service

Shopping cart management service.

## Features
- Cart CRUD operations
- Item add/remove/update quantity
- Save for later functionality
- Cart merge on login
- Coupon application
- Cart expiry & cleanup
- Real-time inventory validation

## Tech Stack
- PostgreSQL
- Redis (active cart cache)

## API
`/api/v1/cart/*` — Cart endpoints

## Configuration
- `DB_URL`: PostgreSQL connection
- `REDIS_HOST`: Redis cache host
