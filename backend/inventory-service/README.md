# Inventory Service

Stock and inventory management service.

## Features
- Stock tracking by product/SKU
- Inventory reservations for orders
- Stock release on cancellation
- Low stock alerts
- Inventory audits & adjustments
- Transfers between warehouses
- Real-time stock updates

## Tech Stack
- PostgreSQL
- Redis (real-time stock cache)
- Kafka (inventory events)

## API
`/api/v1/inventory/*` — Inventory endpoints

## Events Published
- `inventory.reserved` — Stock reserved for order
- `inventory.released` — Stock released
- `inventory.low.stock` — Low stock alert

## Configuration
- `DB_URL`: PostgreSQL connection
