# Delivery Service

Delivery partner management and order dispatch service.

## Features
- Delivery partner registration & verification
- Order assignment & acceptance
- Pickup & delivery with OTP verification
- Live location tracking (WebSocket)
- Earnings & wallet integration
- Partner performance metrics
- Delivery zone management

## Tech Stack
- PostgreSQL
- WebSocket (real-time tracking)
- Kafka (delivery events)
- Google Maps API (navigation)

## API
`/api/v1/delivery/*` — Delivery endpoints  
`/ws/location` — WebSocket for live tracking

## Events Published
- `delivery.assigned` — Delivery partner assigned
- `delivery.picked.up` — Order picked up
- `delivery.completed` — Delivery completed

## Configuration
- `DB_URL`: PostgreSQL connection
- `GOOGLE_MAPS_API_KEY`: Maps API key
