# Catalog Service

Product catalog and category management service.

## Features
- Product CRUD with variants
- Category management (hierarchical)
- Brand management
- Product search & filtering
- Inventory status integration
- Product images & media

## Tech Stack
- PostgreSQL
- Redis (product cache)
- Kafka (product events)

## API
`/api/v1/products/*` — Product endpoints  
`/api/v1/categories/*` — Category endpoints  
`/api/v1/brands/*` — Brand endpoints

## Events Published
- `product.created` — New product added
- `product.updated` — Product details changed

## Configuration
- `DB_URL`: PostgreSQL connection
- `REDIS_HOST`: Redis cache host
