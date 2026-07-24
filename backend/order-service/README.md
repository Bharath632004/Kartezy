# Order Service

Order lifecycle management service.

## Features
- Order creation & lifecycle (PENDING → CONFIRMED → DELIVERED)
- Order status tracking with timeline
- Driver assignment
- Cancellation & returns
- Refund processing
- Invoice generation
- Real-time WebSocket status updates
- Kafka event publishing

## Tech Stack
- PostgreSQL
- Kafka (order events)
- WebSocket (real-time updates)
- Redis (order cache)

## API
`/api/v1/orders/*` — Order CRUD and management

## Events Published
- `order.created` — When order is placed
- `order.confirmed` — When merchant confirms
- `order.cancelled` — When order is cancelled
- `order.delivered` — When order is delivered

## Configuration
- `DB_URL`: PostgreSQL connection
- `KAFKA_BOOTSTRAP_SERVERS`: Kafka broker address
