# Notification Service

Multi-channel notification delivery service.

## Features
- Email notifications
- SMS notifications
- Push notifications (FCM)
- In-app notifications
- Notification templates
- Kafka consumer for async delivery
- Delivery status tracking
- User notification preferences

## Tech Stack
- PostgreSQL (notification records, templates)
- Kafka (consume events, send notifications)
- Firebase Cloud Messaging (push)
- SMTP (email)
- SMS gateway provider

## API
`/api/v1/notifications/*` — Notification endpoints

## Events Consumed
- `order.*` — Order status changes
- `payment.*` — Payment confirmations
- `delivery.*` — Delivery updates

## Configuration
- `KAFKA_BOOTSTRAP_SERVERS`: Kafka broker
- `FCM_SERVER_KEY`: Firebase Cloud Messaging key
- `SMTP_*`: Email server configuration
- `SMS_*`: SMS gateway credentials
